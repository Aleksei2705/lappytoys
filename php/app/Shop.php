<?php
declare(strict_types=1);

/** Paid online lessons. Preview files are public; the purchased file is not. */
final class Shop
{
    public const KINDS = [
        'master_class' => 'Мастер-класс',
        'lesson' => 'Видеоурок',
    ];

    public static function ensureTables(): void
    {
        Database::execute(
            'CREATE TABLE IF NOT EXISTS shop_products (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                slug VARCHAR(80) NOT NULL,
                kind ENUM(\'master_class\',\'lesson\') NOT NULL DEFAULT \'lesson\',
                title_ru VARCHAR(160) NOT NULL,
                title_kk VARCHAR(160) NULL,
                description_ru VARCHAR(800) NOT NULL,
                description_kk VARCHAR(800) NULL,
                price_kzt INT UNSIGNED NOT NULL,
                preview_path VARCHAR(255) NULL,
                file_path VARCHAR(255) NULL,
                file_name VARCHAR(180) NULL,
                sort_order INT NOT NULL DEFAULT 0,
                is_published TINYINT(1) NOT NULL DEFAULT 0,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY shop_products_slug (slug)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
        );
        Database::execute(
            'CREATE TABLE IF NOT EXISTS shop_orders (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                product_id INT UNSIGNED NOT NULL,
                token CHAR(32) NOT NULL,
                name VARCHAR(80) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                status ENUM(\'pending\',\'paid\',\'cancelled\') NOT NULL DEFAULT \'pending\',
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                paid_at DATETIME NULL,
                PRIMARY KEY (id),
                UNIQUE KEY shop_orders_token (token),
                KEY shop_orders_status (status, id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
        );
    }

    /** @return list<array<string, mixed>> */
    public static function published(): array
    {
        self::ensureTables();
        return Database::fetchAll(
            'SELECT * FROM shop_products WHERE is_published = 1 AND file_path IS NOT NULL ORDER BY sort_order, id',
        );
    }

    /** @return array<string, mixed>|null */
    public static function findPublished(string $slug): ?array
    {
        self::ensureTables();
        return Database::fetchOne(
            'SELECT * FROM shop_products WHERE slug = ? AND is_published = 1 AND file_path IS NOT NULL',
            [$slug],
        );
    }

    public static function slugTaken(string $slug, int $exceptId): bool
    {
        self::ensureTables();
        $row = Database::fetchOne('SELECT id FROM shop_products WHERE slug = ? AND id <> ?', [$slug, $exceptId]);
        return $row !== null;
    }

    /** @return array<string, mixed>|null */
    public static function find(int $id): ?array
    {
        self::ensureTables();
        return $id > 0 ? Database::fetchOne('SELECT * FROM shop_products WHERE id = ?', [$id]) : null;
    }

    /** @return list<array<string, mixed>> */
    public static function all(): array
    {
        self::ensureTables();
        return Database::fetchAll('SELECT * FROM shop_products ORDER BY sort_order, id DESC');
    }

    /** @param array<string, mixed> $data */
    public static function save(array $data): int
    {
        self::ensureTables();
        $id = (int) ($data['id'] ?? 0);
        $params = [
            $data['slug'],
            $data['kind'],
            $data['title_ru'],
            $data['title_kk'],
            $data['description_ru'],
            $data['description_kk'],
            $data['price_kzt'],
            $data['preview_path'],
            $data['file_path'],
            $data['file_name'],
            $data['sort_order'],
            $data['is_published'],
        ];
        if ($id > 0) {
            Database::execute(
                'UPDATE shop_products SET slug = ?, kind = ?, title_ru = ?, title_kk = ?, description_ru = ?, description_kk = ?,
                 price_kzt = ?, preview_path = ?, file_path = ?, file_name = ?, sort_order = ?, is_published = ? WHERE id = ?',
                [...$params, $id],
            );
            return $id;
        }
        Database::execute(
            'INSERT INTO shop_products (slug, kind, title_ru, title_kk, description_ru, description_kk, price_kzt, preview_path, file_path, file_name, sort_order, is_published)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            $params,
        );
        return Database::lastInsertId();
    }

    public static function delete(int $id): void
    {
        $product = self::find($id);
        if ($product === null) {
            return;
        }
        Database::execute('DELETE FROM shop_orders WHERE product_id = ?', [$id]);
        Database::execute('DELETE FROM shop_products WHERE id = ?', [$id]);
        self::deletePreview((string) ($product['preview_path'] ?? ''));
        self::deleteFile((string) ($product['file_path'] ?? ''));
    }

    /** @param array<string, mixed> $file */
    public static function storePreview(array $file): string
    {
        return self::store($file, APP_ROOT . '/public/uploads/shop-preview', '/uploads/shop-preview/', [
            'video/mp4' => 'mp4',
            'video/webm' => 'webm',
        ], 80 * 1024 * 1024);
    }

    /** @param array<string, mixed> $file @return array{path: string, name: string} */
    public static function storeFile(array $file): array
    {
        $original = (string) ($file['name'] ?? '');
        $safeName = preg_replace('/[^\p{L}\p{N}._-]+/u', '-', $original) ?? 'file';
        $safeName = trim($safeName, '-');
        if ($safeName === '') {
            $safeName = 'file';
        }
        $path = self::store($file, APP_ROOT . '/storage/shop', '', [
            'video/mp4' => 'mp4',
            'video/webm' => 'webm',
            'application/pdf' => 'pdf',
            'application/zip' => 'zip',
            'application/x-zip-compressed' => 'zip',
        ], 200 * 1024 * 1024);
        return ['path' => $path, 'name' => mb_substr($safeName, 0, 180)];
    }

    public static function deletePreview(string $path): void
    {
        if (preg_match('#^/uploads/shop-preview/[a-f0-9]{16}\.(mp4|webm)$#', $path) !== 1) {
            return;
        }
        $file = APP_ROOT . '/public' . $path;
        if (is_file($file)) {
            @unlink($file);
        }
    }

    public static function deleteFile(string $path): void
    {
        if (preg_match('#^[a-f0-9]{16}\.(mp4|webm|pdf|zip)$#', $path) !== 1) {
            return;
        }
        $file = APP_ROOT . '/storage/shop/' . $path;
        if (is_file($file)) {
            @unlink($file);
        }
    }

    /** @param array<string, string> $buyer @return array{id: int, token: string} */
    public static function order(int $productId, array $buyer): array
    {
        self::ensureTables();
        $token = bin2hex(random_bytes(16));
        Database::execute(
            'INSERT INTO shop_orders (product_id, token, name, phone) VALUES (?, ?, ?, ?)',
            [$productId, $token, $buyer['name'], $buyer['phone']],
        );
        return ['id' => Database::lastInsertId(), 'token' => $token];
    }

    /** @return array<string, mixed>|null */
    public static function findOrder(int $id): ?array
    {
        self::ensureTables();
        return $id > 0
            ? Database::fetchOne(
                'SELECT o.*, p.slug, p.title_ru FROM shop_orders o JOIN shop_products p ON p.id = o.product_id WHERE o.id = ?',
                [$id],
            )
            : null;
    }

    /** @return array<string, mixed>|null */
    public static function orderByToken(string $token): ?array
    {
        if (preg_match('/^[a-f0-9]{32}$/', $token) !== 1) {
            return null;
        }
        self::ensureTables();
        return Database::fetchOne(
            'SELECT o.*, p.slug, p.title_ru, p.file_path, p.file_name
             FROM shop_orders o
             JOIN shop_products p ON p.id = o.product_id
             WHERE o.token = ?',
            [$token],
        );
    }

    public static function markPaid(int $id): void
    {
        self::ensureTables();
        Database::execute(
            'UPDATE shop_orders SET status = \'paid\', paid_at = NOW() WHERE id = ? AND status = \'pending\'',
            [$id],
        );
    }

    public static function cancel(int $id): void
    {
        self::ensureTables();
        Database::execute('UPDATE shop_orders SET status = \'cancelled\' WHERE id = ? AND status = \'pending\'', [$id]);
    }

    /** @return list<array<string, mixed>> */
    public static function orders(): array
    {
        self::ensureTables();
        return Database::fetchAll(
            'SELECT o.*, p.title_ru, p.slug FROM shop_orders o
             JOIN shop_products p ON p.id = o.product_id
             ORDER BY FIELD(o.status, \'pending\', \'paid\', \'cancelled\'), o.id DESC
             LIMIT 200',
        );
    }

    public static function price(int $amount): string
    {
        return number_format($amount, 0, '', ' ') . ' тг';
    }

    /**
     * @param array<string, mixed> $file
     * @param array<string, string> $extensions
     */
    private static function store(array $file, string $directory, string $publicPrefix, array $extensions, int $maxBytes): string
    {
        $error = $file['error'] ?? UPLOAD_ERR_NO_FILE;
        if ($error === UPLOAD_ERR_INI_SIZE || $error === UPLOAD_ERR_FORM_SIZE) {
            throw new InvalidArgumentException('Файл больше лимита сервера. Уменьшите его или напишите, поднимем лимит.');
        }
        if ($error !== UPLOAD_ERR_OK || !is_uploaded_file((string) $file['tmp_name'])) {
            throw new InvalidArgumentException('Не удалось загрузить файл.');
        }
        if ((int) $file['size'] > $maxBytes) {
            throw new InvalidArgumentException('Файл слишком большой.');
        }
        $mime = mime_content_type((string) $file['tmp_name']);
        if (!is_string($mime) || $mime === 'application/octet-stream') {
            $ext = strtolower(pathinfo((string) ($file['name'] ?? ''), PATHINFO_EXTENSION));
            $matched = array_search($ext, $extensions, true);
            $mime = is_string($matched) ? $matched : '';
        }
        if (!is_string($mime) || !isset($extensions[$mime])) {
            throw new InvalidArgumentException('Допустимы видео MP4 или WebM, а для файла покупателя ещё PDF и ZIP.');
        }
        if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) {
            throw new InvalidArgumentException('Не удалось создать папку для файлов.');
        }
        $name = bin2hex(random_bytes(8)) . '.' . $extensions[$mime];
        if (!move_uploaded_file((string) $file['tmp_name'], $directory . '/' . $name)) {
            throw new InvalidArgumentException('Не удалось сохранить файл.');
        }
        return $publicPrefix . $name;
    }
}
