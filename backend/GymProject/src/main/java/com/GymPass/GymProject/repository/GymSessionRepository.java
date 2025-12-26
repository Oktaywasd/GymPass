package com.GymPass.GymProject.repository;

import com.GymPass.GymProject.entity.GymSession;
import com.GymPass.GymProject.entity.User;
import com.GymPass.GymProject.enums.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GymSessionRepository extends JpaRepository<GymSession, Long> {

    Optional<GymSession> findByUserAndStatus(User user, SessionStatus status);
}
