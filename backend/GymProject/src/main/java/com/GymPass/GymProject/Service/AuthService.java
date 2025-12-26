package com.GymPass.GymProject.Service;

import com.GymPass.GymProject.dto.LoginRequestDto;
import com.GymPass.GymProject.dto.RegisterRequestDto;
import com.GymPass.GymProject.dto.UserResponseDto;
import com.GymPass.GymProject.entity.User;
import com.GymPass.GymProject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    // REGISTER
    public UserResponseDto register(RegisterRequestDto dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Bu email zaten kayıtlı");
        }

        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword()) // ⚠️ ŞİMDİLİK DÜZ TEXT
                .balance(BigDecimal.ZERO)
                .build();

        User savedUser = userRepository.save(user);

        return new UserResponseDto(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getBalance()
        );
    }

    // LOGIN
    public UserResponseDto login(LoginRequestDto dto) {

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        if (!user.getPassword().equals(dto.getPassword())) {
            throw new RuntimeException("Şifre hatalı");
        }

        return new UserResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getBalance()
        );
    }
}
