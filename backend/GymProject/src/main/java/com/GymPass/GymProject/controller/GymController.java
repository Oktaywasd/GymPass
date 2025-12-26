package com.GymPass.GymProject.controller;

import com.GymPass.GymProject.Service.GymService;
import com.GymPass.GymProject.dto.GymCreateRequestDto;
import com.GymPass.GymProject.dto.GymResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gyms")
@RequiredArgsConstructor
public class GymController {

    private final GymService gymService;

    @PostMapping
    public ResponseEntity<GymResponseDto> createGym(
            @RequestBody GymCreateRequestDto dto
    ) {
        return ResponseEntity.ok(gymService.createGym(dto));
    }

    @GetMapping
    public ResponseEntity<List<GymResponseDto>> getAllGyms() {
        return ResponseEntity.ok(gymService.getAllGyms());
    }
}
