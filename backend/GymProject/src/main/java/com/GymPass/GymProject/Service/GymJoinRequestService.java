package com.GymPass.GymProject.Service;

import com.GymPass.GymProject.entity.Gym;
import com.GymPass.GymProject.entity.GymJoinRequest;
import com.GymPass.GymProject.entity.User;
import com.GymPass.GymProject.enums.JoinRequestStatus;
import com.GymPass.GymProject.repository.GymJoinRequestRepository;
import com.GymPass.GymProject.repository.GymRepository;
import com.GymPass.GymProject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GymJoinRequestService {

    private final GymJoinRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final GymRepository gymRepository;

    // 1️⃣ SEND REQUEST
    public void sendRequest(Long userId, Long gymId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));

        if (requestRepository.existsByUserAndGym(user, gym)) {
            throw new RuntimeException("Request already exists");
        }

        GymJoinRequest request = GymJoinRequest.builder()
                .user(user)
                .gym(gym)
                .status(JoinRequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        requestRepository.save(request);
    }

    // 2️⃣ ACCEPT REQUEST
    public void acceptRequest(Long requestId) {

        GymJoinRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(JoinRequestStatus.ACCEPTED);
        requestRepository.save(request);
    }

    // 3️⃣ REJECT REQUEST
    public void rejectRequest(Long requestId) {

        GymJoinRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(JoinRequestStatus.REJECTED);
        requestRepository.save(request);
    }
}
