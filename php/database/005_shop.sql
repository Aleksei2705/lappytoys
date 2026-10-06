-- Tables are also created automatically on the first shop page view.
CREATE TABLE IF NOT EXISTS shop_products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(80) NOT NULL,
  kind ENUM('master_class','lesson') NOT NULL DEFAULT 'lesson',
  title_ru VARCHAR(160) NOT NULL,
  title_kk VARCHAR(160) NULL,
  description_ru VARCHAR(800) NOT NULL,
  description_kk VARCHAR(800) NULL,
  price_kzt INT UNSIGNED NOT NULL,
  preview_path VARCHAR(255) NULL,
  image_path VARCHAR(255) NULL,
  file_path VARCHAR(255) NULL,
  file_name VARCHAR(180) NULL,
  channel_id VARCHAR(22) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY shop_products_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS shop_orders (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id INT UNSIGNED NOT NULL,
  token CHAR(32) NOT NULL,
  name VARCHAR(80) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  status ENUM('pending','paid','cancelled') NOT NULL DEFAULT 'pending',
  telegram_sent TINYINT(1) NOT NULL DEFAULT 0,
  invite_link VARCHAR(255) NULL,
  buyer_chat_id VARCHAR(20) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY shop_orders_token (token),
  KEY shop_orders_status (status, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
