-- UGC: фото готовых работ + более развёрнутый текст отзыва
ALTER TABLE reviews
  ADD COLUMN photo_path VARCHAR(255) NULL AFTER avatar_url,
  MODIFY text VARCHAR(1200) NOT NULL,
  MODIFY text_kk VARCHAR(1200) NULL;
