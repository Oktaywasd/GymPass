package com.GymPass.GymProject.dto;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String email;
    private String password;
}
