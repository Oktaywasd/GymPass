-- DDL BETİĞİ: V1_2__create_reviews_table.sql
-- Yorumlar (reviews) tablosu oluşturuluyor
-- -----------------------------------------------------

CREATE TABLE reviews (
    review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    gym_id BIGINT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5), -- 1-5 arası puan
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- İlişkiler (Foreign Keys)
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (gym_id) REFERENCES gyms(gym_id) ON DELETE CASCADE,

    -- Benzersizlik Kısıtlaması (Unique Constraint)
    -- Bir kullanıcının aynı salona birden fazla yorum yapmasını engeller
    UNIQUE KEY uk_user_gym_review (user_id, gym_id) 
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
