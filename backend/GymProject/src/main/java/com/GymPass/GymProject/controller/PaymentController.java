package com.GymPass.GymProject.controller;

import com.GymPass.GymProject.Service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/pay/{sessionId}")
    public ResponseEntity<String> pay(@PathVariable Long sessionId) {
        paymentService.pay(sessionId);
        return ResponseEntity.ok("Payment successful");
    }
}
