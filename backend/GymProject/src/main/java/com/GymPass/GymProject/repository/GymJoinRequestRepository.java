package com.GymPass.GymProject.repository;

import com.GymPass.GymProject.entity.Gym;
import com.GymPass.GymProject.entity.GymJoinRequest;
import com.GymPass.GymProject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GymJoinRequestRepository extends JpaRepository<GymJoinRequest, Long> {
    boolean existsByUserAndGym(User user, Gym gym);
}
