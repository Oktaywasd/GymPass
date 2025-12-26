package com.GymPass.GymProject.Service;

import com.GymPass.GymProject.entity.GymJoinRequest;
import com.GymPass.GymProject.entity.GymSession;
import com.GymPass.GymProject.entity.User;
import com.GymPass.GymProject.enums.JoinRequestStatus;
import com.GymPass.GymProject.enums.SessionStatus;
import com.GymPass.GymProject.repository.GymJoinRequestRepository;
import com.GymPass.GymProject.repository.GymSessionRepository;
import com.GymPass.GymProject.repository.UserRepository;
import com.GymPass.GymProject.util.PriceCalculator;
import com.GymPass.GymProject.util.TimeUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GymSessionService {

    private final GymSessionRepository sessionRepository;
    private final GymJoinRequestRepository requestRepository;
    private final UserRepository userRepository;

    // 1️⃣ SESSION BAŞLAT
    public void startSession(Long requestId) {

        GymJoinRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != JoinRequestStatus.ACCEPTED) {
            throw new RuntimeException("Request not accepted");
        }

        User user = request.getUser();

        // Aynı anda aktif session engeli
        if (sessionRepository.findByUserAndStatus(user, SessionStatus.ACTIVE).isPresent()) {
            throw new RuntimeException("User already has active session");
        }

        GymSession session = GymSession.builder()
                .user(user)
                .gym(request.getGym())
                .startTime(LocalDateTime.now())
                .status(SessionStatus.ACTIVE)
                .build();

        sessionRepository.save(session);
    }

    // 2️⃣ AKTİF SESSION GETİR
    public GymSession getActiveSession(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return sessionRepository.findByUserAndStatus(user, SessionStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No active session"));
    }

/// /////////////
        @Transactional
        public GymSession endSession(Long sessionId) {

            GymSession session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found"));

            if (session.getStatus() != SessionStatus.ACTIVE) {
                throw new RuntimeException("Session already finished");
            }

            LocalDateTime endTime = LocalDateTime.now();
            session.setEndTime(endTime);

            long minutes = TimeUtil.calculateMinutes(
                    session.getStartTime(),
                    endTime
            );

            BigDecimal price = PriceCalculator.calculatePrice(
                    minutes,
                    session.getGym().getPricePerMinute()
            );

            session.setTotalMinutes(minutes);
            session.setTotalPrice(price);
            session.setStatus(SessionStatus.COMPLETED);

            return sessionRepository.save(session);
        }
    }


