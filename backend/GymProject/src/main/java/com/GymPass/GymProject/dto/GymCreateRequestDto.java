package com.GymPass.GymProject.dto;

import java.math.BigDecimal;

public record GymCreateRequestDto(
        String name,
        String location,
        BigDecimal pricePerMinute
) {}
