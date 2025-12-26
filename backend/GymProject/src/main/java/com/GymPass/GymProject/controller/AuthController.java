package com.GymPass.GymProject.controller;

import com.GymPass.GymProject.dto.LoginRequestDto;
import com.GymPass.GymProject.dto.RegisterRequestDto;
import com.GymPass.GymProject.dto.UserResponseDto;
import com.GymPass.GymProject.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public UserResponseDto register(@RequestBody RegisterRequestDto dto) {
        return authService.register(dto);
    }

    @PostMapping("/login")
    public UserResponseDto login(@RequestBody LoginRequestDto dto) {
        return authService.login(dto);
    }
}
