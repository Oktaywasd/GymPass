package com.GymPass.GymProject.controller;

import com.GymPass.GymProject.Service.PaymentHistoryService;
import com.GymPass.GymProject.entity.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentHistoryController {

    private final PaymentHistoryService paymentHistoryService;

    // Kullanıcının ödeme geçmişi
    @GetMapping("/user/{userId}")
    public List<Payment> getUserPayments(@PathVariable Long userId) {
        return paymentHistoryService.getUserPayments(userId);
    }

    // Session’a ait ödeme
    @GetMapping("/session/{sessionId}")
    public Payment getPaymentBySession(@PathVariable Long sessionId) {
        return paymentHistoryService.getBySession(sessionId);
    }
}
