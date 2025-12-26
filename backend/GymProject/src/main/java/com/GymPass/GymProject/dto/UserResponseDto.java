package com.GymPass.GymProject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String name;
    private String email;
    private BigDecimal balance;
}
