package com.GymPass.GymProject.repository;

import com.GymPass.GymProject.entity.Gym;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GymRepository extends JpaRepository<Gym, Long> {
}

