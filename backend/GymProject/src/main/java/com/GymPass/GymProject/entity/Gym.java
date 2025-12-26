package com.GymPass.GymProject.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "gyms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gym {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // Örn: "Kadıköy / İstanbul"
    @Column(nullable = false)
    private String location;

    // Dakika başı ücret
    @Column(nullable = false)
    private BigDecimal pricePerMinute;
}
