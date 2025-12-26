package com.GymPass.GymProject.dto;

import java.math.BigDecimal;

public record GymResponseDto(
        Long id,
        String name,
        String location,
        BigDecimal pricePerMinute
) {}
