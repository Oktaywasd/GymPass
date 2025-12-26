package com.GymPass.GymProject.Service;

import com.GymPass.GymProject.entity.GymSession;
import com.GymPass.GymProject.entity.Payment;
import com.GymPass.GymProject.entity.User;
import com.GymPass.GymProject.enums.PaymentStatus;
import com.GymPass.GymProject.enums.SessionStatus;
import com.GymPass.GymProject.repository.GymSessionRepository;
import com.GymPass.GymProject.repository.PaymentRepository;
import com.GymPass.GymProject.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final GymSessionRepository gymSessionRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public void pay(Long sessionId) {

        GymSession session = gymSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getStatus() != SessionStatus.COMPLETED) {
            throw new RuntimeException("Session is not completed");
        }

        if (paymentRepository.existsBySession(session)) {
            throw new RuntimeException("Payment already done");
        }

        User user = session.getUser();
        BigDecimal price = session.getTotalPrice();

        if (user.getBalance().compareTo(price) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // 🔻 Bakiye düş
        user.setBalance(user.getBalance().subtract(price));
        userRepository.save(user);

        // 💳 Payment oluştur
        Payment payment = Payment.builder()
                .session(session)
                .amount(price)
                .status(PaymentStatus.SUCCESS)
                .paymentTime(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);
    }
}
