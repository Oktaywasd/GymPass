package com.GymPass.GymProject.Service;

import com.GymPass.GymProject.entity.Payment;
import com.GymPass.GymProject.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentHistoryService {

    private final PaymentRepository paymentRepository;

    public List<Payment> getUserPayments(Long userId) {
        return paymentRepository.findByUser_Id(userId);
    }

    public Payment getBySession(Long sessionId) {
        return paymentRepository.findBySession_Id(sessionId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));//hata satırı
    }
}
