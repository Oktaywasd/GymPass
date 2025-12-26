package com.GymPass.GymProject.util;

import java.time.Duration;
import java.time.LocalDateTime;

public class TimeUtil {

    public static long calculateMinutes(LocalDateTime start, LocalDateTime end) {
        return Duration.between(start, end).toMinutes();
    }
}
