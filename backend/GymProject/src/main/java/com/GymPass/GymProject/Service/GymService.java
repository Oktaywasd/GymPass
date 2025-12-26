package com.GymPass.GymProject.Service;

import com.GymPass.GymProject.dto.GymCreateRequestDto;
import com.GymPass.GymProject.dto.GymResponseDto;
import com.GymPass.GymProject.entity.Gym;
import com.GymPass.GymProject.repository.GymRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GymService {

    private final GymRepository gymRepository;

    public GymResponseDto createGym(GymCreateRequestDto dto) {

        Gym gym = Gym.builder()
                .name(dto.name())
                .location(dto.location())
                .pricePerMinute(dto.pricePerMinute())
                .build();

        Gym savedGym = gymRepository.save(gym);

        return new GymResponseDto(
                savedGym.getId(),
                savedGym.getName(),
                savedGym.getLocation(),
                savedGym.getPricePerMinute()
        );
    }

    public List<GymResponseDto> getAllGyms() {
        return gymRepository.findAll()
                .stream()
                .map(gym -> new GymResponseDto(
                        gym.getId(),
                        gym.getName(),
                        gym.getLocation(),
                        gym.getPricePerMinute()
                ))
                .toList();
    }
}
