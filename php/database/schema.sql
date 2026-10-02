-- Импорт: phpMyAdmin -> база lappytoy_db -> Импорт. MySQL 8+ / MariaDB 10.5+
SET NAMES utf8mb4;

CREATE TABLE users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email         VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(80)  NOT NULL DEFAULT '',
  role          ENUM('admin','editor') NOT NULL DEFAULT 'admin',
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE login_attempts (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ip           VARCHAR(45)  NOT NULL,
  email        VARCHAR(190) NOT NULL DEFAULT '',
  attempted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_login_ip_time (ip, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categories (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug       VARCHAR(60)  NOT NULL,
  title_ru   VARCHAR(120) NOT NULL,
  title_kk   VARCHAR(120) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE classes (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug           VARCHAR(80)  NOT NULL,
  kind           ENUM('course','master_class') NOT NULL DEFAULT 'master_class',
  category_id    INT UNSIGNED NULL,

  title_ru       VARCHAR(160) NOT NULL,
  title_kk       VARCHAR(160) NULL,
  description_ru VARCHAR(500) NOT NULL,
  description_kk VARCHAR(500) NULL,
  intro_ru       TEXT NULL,
  intro_kk       TEXT NULL,
  details_ru     JSON NULL,
  details_kk     JSON NULL,
  learn_ru       JSON NULL,
  learn_kk       JSON NULL,
  for_whom_ru    JSON NULL,
  for_whom_kk    JSON NULL,

  badge_ru       VARCHAR(40) NULL,
  badge_kk       VARCHAR(40) NULL,
  price_label    VARCHAR(60) NOT NULL DEFAULT '',
  duration_ru    VARCHAR(60) NULL,
  duration_kk    VARCHAR(60) NULL,
  level_ru       VARCHAR(60) NULL,
  level_kk       VARCHAR(60) NULL,

  image_path     VARCHAR(255) NULL,
  emoji          VARCHAR(16)  NULL,
  accent         VARCHAR(80)  NOT NULL DEFAULT 'from-brand-50 to-accent-100',

  sort_order     INT NOT NULL DEFAULT 0,
  is_published   TINYINT(1) NOT NULL DEFAULT 1,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_classes_slug (slug),
  KEY idx_classes_list (is_published, kind, sort_order),
  CONSTRAINT fk_classes_category FOREIGN KEY (category_id)
    REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reviews (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  class_id     INT UNSIGNED NULL,
  name         VARCHAR(60)  NOT NULL,
  course       VARCHAR(80)  NOT NULL,
  course_kk    VARCHAR(80)  NULL,
  text         VARCHAR(600) NOT NULL,
  text_kk      VARCHAR(600) NULL,
  rating       TINYINT UNSIGNED NOT NULL DEFAULT 5,
  avatar_url   VARCHAR(255) NULL,
  reply_text   VARCHAR(600) NULL,
  reply_text_kk VARCHAR(600) NULL,
  reply_at     DATETIME NULL,
  show_date    TINYINT(1) NOT NULL DEFAULT 1,
  status       ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  ip_hash      CHAR(64) NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  moderated_at DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_reviews_public (status, created_at),
  KEY idx_reviews_ip (ip_hash, created_at),
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT fk_reviews_class FOREIGN KEY (class_id)
    REFERENCES classes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE bookings (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  class_id       INT UNSIGNED NULL,
  name           VARCHAR(80)  NOT NULL,
  phone          VARCHAR(20)  NOT NULL,
  direction      VARCHAR(160) NOT NULL,
  preferred_date DATE NULL,
  message        VARCHAR(1000) NULL,
  status         ENUM('new','contacted','done','cancelled') NOT NULL DEFAULT 'new',
  telegram_sent  TINYINT(1) NOT NULL DEFAULT 0,
  ip_hash        CHAR(64) NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_bookings_status (status, created_at),
  CONSTRAINT fk_bookings_class FOREIGN KEY (class_id)
    REFERENCES classes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE password_resets (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  ip_hash    CHAR(64) NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_password_resets_token (token_hash),
  KEY idx_password_resets_user (user_id, created_at),
  CONSTRAINT fk_password_resets_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE site_blocks (
  block_key  VARCHAR(40) NOT NULL,
  payload    LONGTEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (block_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
