<?php
declare(strict_types=1);

final class Admin
{
    private const FLASH_KEY = 'admin_flash';

    /**
     * Requires an authenticated user; "admin" role is needed for destructive actions.
     *
     * @return array{id: int, email: string, name: string, role: string}
     */
    public static function guard(string $role = 'editor'): array
    {
        self::sendHeaders();

        try {
            $user = Auth::user();
        } catch (RuntimeException) {
            showErrorPage(503, 'page.unavailable', 'page.unavailableText');
            exit;
        }

        if ($user === null) {
            self::redirect('/admin/login.php');
        }
        if ($role === 'admin' && $user['role'] !== 'admin') {
            http_response_code(403);
            exit('Недостаточно прав.');
        }
        return $user;
    }

    public static function sendHeaders(): void
    {
        header('Cache-Control: no-store');
        header('X-Robots-Tag: noindex, nofollow');
        header("Content-Security-Policy: default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'none'");
    }

    public static function isPost(): bool
    {
        return $_SERVER['REQUEST_METHOD'] === 'POST';
    }

    /** Aborts the request unless the POST carries a valid CSRF token. */
    public static function verifyPost(): void
    {
        if (!Security::verifyCsrf($_POST['_csrf'] ?? null)) {
            http_response_code(419);
            exit('Сессия устарела. Вернитесь назад, обновите страницу и повторите.');
        }
    }

    public static function flash(string $type, string $message): void
    {
        $_SESSION[self::FLASH_KEY] = ['type' => $type, 'message' => $message];
    }

    /** @return array{type: string, message: string}|null */
    public static function takeFlash(): ?array
    {
        $flash = $_SESSION[self::FLASH_KEY] ?? null;
        unset($_SESSION[self::FLASH_KEY]);
        return is_array($flash) ? $flash : null;
    }

    public static function redirect(string $path): void
    {
        header('Location: ' . $path, true, 303);
        exit;
    }

    public static function dt(?string $mysqlDate): string
    {
        $timestamp = $mysqlDate !== null && $mysqlDate !== '' ? strtotime($mysqlDate) : false;
        return $timestamp === false ? '' : date('d.m.Y H:i', $timestamp);
    }

    /** Positive integer from POST/GET or 0. */
    public static function intParam(array $source, string $key): int
    {
        $value = $source[$key] ?? '';
        return is_string($value) && ctype_digit($value) ? (int) $value : 0;
    }

    public static function text(array $source, string $key): string
    {
        $value = $source[$key] ?? '';
        return is_string($value) ? trim($value) : '';
    }

    public static function textOrNull(array $source, string $key): ?string
    {
        $value = self::text($source, $key);
        return $value === '' ? null : $value;
    }

    /** One item per non-empty line, stored as a JSON array (or NULL when empty). */
    public static function linesToJson(string $text): ?string
    {
        $lines = array_values(array_filter(array_map('trim', preg_split('/\R/u', $text) ?: []), static fn (string $line): bool => $line !== ''));
        return $lines === [] ? null : json_encode($lines, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    }

    public static function jsonToLines(?string $json): string
    {
        $decoded = json_decode((string) $json, true);
        return is_array($decoded) ? implode("\n", array_map('strval', $decoded)) : '';
    }

    /**
     * Saves an uploaded image under public/uploads/{folder}. The type is detected from the file
     * content (never from the client-supplied name). Returns the public path.
     *
     * @throws InvalidArgumentException with a user-facing message
     */
    public static function storeImage(array $file, string $folder): string
    {
        $error = $file['error'] ?? UPLOAD_ERR_NO_FILE;
        if ($error === UPLOAD_ERR_INI_SIZE || $error === UPLOAD_ERR_FORM_SIZE) {
            throw new InvalidArgumentException('Файл слишком большой (максимум 3 МБ).');
        }
        if ($error !== UPLOAD_ERR_OK || !is_uploaded_file((string) $file['tmp_name'])) {
            throw new InvalidArgumentException('Не удалось загрузить файл.');
        }
        if ((int) $file['size'] > 3 * 1024 * 1024) {
            throw new InvalidArgumentException('Файл слишком большой (максимум 3 МБ).');
        }

        $info = @getimagesize((string) $file['tmp_name']);
        $extensions = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
        if ($info === false || !isset($extensions[$info[2]])) {
            throw new InvalidArgumentException('Допустимы только изображения JPG, PNG или WebP.');
        }

        $directory = APP_ROOT . '/public/uploads/' . $folder;
        if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) {
            throw new InvalidArgumentException('Не удалось создать папку для изображений.');
        }

        $name = bin2hex(random_bytes(8)) . '.' . $extensions[$info[2]];
        if (!move_uploaded_file((string) $file['tmp_name'], $directory . '/' . $name)) {
            throw new InvalidArgumentException('Не удалось сохранить файл.');
        }
        return '/uploads/' . $folder . '/' . $name;
    }

    /** Deletes a file previously saved by storeImage() (ignores anything outside /uploads/). */
    public static function deleteUploadedImage(?string $path): void
    {
        if ($path === null || preg_match('#^/uploads/[a-z0-9_-]+/[a-f0-9]{16}\.(jpg|png|webp)$#', $path) !== 1) {
            return;
        }
        $file = APP_ROOT . '/public' . $path;
        if (is_file($file)) {
            @unlink($file);
        }
    }
}
