-- Миграция для уже созданной БД: казахские версии отзывов и флаг показа даты.
ALTER TABLE reviews
  ADD COLUMN course_kk     VARCHAR(80)  NULL AFTER course,
  ADD COLUMN text_kk       VARCHAR(600) NULL AFTER text,
  ADD COLUMN reply_text_kk VARCHAR(600) NULL AFTER reply_text,
  ADD COLUMN show_date     TINYINT(1) NOT NULL DEFAULT 1 AFTER reply_at;
