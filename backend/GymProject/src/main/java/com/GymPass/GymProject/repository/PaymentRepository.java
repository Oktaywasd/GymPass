package com.GymPass.GymProject.repository;

import com.GymPass.GymProject.entity.GymSession;
import com.GymPass.GymProject.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    boolean existsBySession(GymSession session);

    List<Payment> findByUser_Id(Long userId);

    Optional<Payment> findBySession_Id(Long sessionId);
}
