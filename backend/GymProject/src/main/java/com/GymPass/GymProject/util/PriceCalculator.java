package com.GymPass.GymProject.util;

import java.math.BigDecimal;

public class PriceCalculator {

    public static BigDecimal calculatePrice(long minutes, BigDecimal pricePerMinute) {
        return pricePerMinute.multiply(BigDecimal.valueOf(minutes));
    }
}
