-- DDL BETİĞİ: V1_1__create_gyms_table.sql
-- Spor Salonları (gyms) tablosu oluşturuluyor
-- -----------------------------------------------------

CREATE TABLE gyms (
    gym_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    city VARCHAR(50),
    phone VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
