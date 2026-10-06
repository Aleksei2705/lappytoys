<?php
declare(strict_types=1);

/** Editable homepage blocks stored as JSON. Missing rows fall back to config/site.php. */
final class SiteContent
{
    public const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    public static function ensureTable(): void
    {
        Database::execute(
            'CREATE TABLE IF NOT EXISTS site_blocks (
                block_key VARCHAR(40) NOT NULL,
                payload LONGTEXT NOT NULL,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (block_key)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
        );
    }

    /** @return list<array<string, string>> */
    public static function scheduleRows(): array
    {
        return self::stored('schedule') ?? self::defaultSchedule();
    }

    /** @return list<array{weekday: string, time: string, note: string}> */
    public static function scheduleForPage(): array
    {
        $slots = [];
        foreach (self::scheduleRows() as $row) {
            $day = (string) ($row['weekday'] ?? '');
            $time = trim((string) ($row['time'] ?? ''));
            if (!in_array($day, self::WEEKDAYS, true) || $time === '') {
                continue;
            }
            $slots[] = [
                'weekday' => I18n::translate('weekday.' . $day),
                'time' => $time,
                'note' => loc($row, 'note'),
            ];
        }
        return $slots;
    }

    /** @param list<array<string, string>> $rows */
    public static function saveSchedule(array $rows): void
    {
        self::write('schedule', $rows);
    }

    /** @return list<array<string, string>> */
    public static function workRows(): array
    {
        return self::stored('works') ?? self::defaultWorks();
    }

    /** @param list<array<string, string>> $rows */
    public static function saveWorks(array $rows): void
    {
        $previous = self::stored('works') ?? [];
        self::write('works', $rows);
        $kept = array_column($rows, 'image');
        foreach ($previous as $old) {
            $image = (string) ($old['image'] ?? '');
            if ($image !== '' && !in_array($image, $kept, true)) {
                Admin::deleteUploadedImage($image);
            }
        }
    }

    /** @return list<array<string, string>> */
    public static function videoRows(): array
    {
        return self::stored('videos') ?? self::defaultVideos();
    }

    /** @param list<array<string, string>> $rows */
    public static function saveVideos(array $rows): void
    {
        self::write('videos', $rows);
    }

    /** @return list<array{path: string}> */
    public static function heroVideoRows(): array
    {
        $rows = [];
        foreach (self::stored('hero_videos') ?? [] as $row) {
            $path = (string) ($row['path'] ?? '');
            if (self::isHeroVideo($path)) {
                $rows[] = ['path' => $path];
            }
        }
        return $rows;
    }

    /** @param list<array{path: string}> $rows */
    public static function saveHeroVideos(array $rows): void
    {
        $previous = self::heroVideoRows();
        self::write('hero_videos', $rows);
        $kept = array_column($rows, 'path');
        foreach ($previous as $old) {
            if (!in_array($old['path'], $kept, true)) {
                self::deleteHeroVideo($old['path']);
            }
        }
    }

    /** @param array<string, mixed> $file */
    public static function storeHeroVideo(array $file): string
    {
        $error = $file['error'] ?? UPLOAD_ERR_NO_FILE;
        if ($error === UPLOAD_ERR_INI_SIZE || $error === UPLOAD_ERR_FORM_SIZE) {
            throw new InvalidArgumentException('Видео больше лимита сервера. Сожмите ролик или загрузите более короткий.');
        }
        if ($error !== UPLOAD_ERR_OK || !is_uploaded_file((string) $file['tmp_name'])) {
            throw new InvalidArgumentException('Не удалось загрузить видео.');
        }
        if ((int) $file['size'] > 30 * 1024 * 1024) {
            throw new InvalidArgumentException('Видео слишком большое (максимум 30 МБ).');
        }
        $extensions = ['video/mp4' => 'mp4', 'video/webm' => 'webm'];
        $mime = mime_content_type((string) $file['tmp_name']);
        if (!is_string($mime) || !isset($extensions[$mime])) {
            throw new InvalidArgumentException('Допустимы только видео MP4 или WebM.');
        }
        $directory = APP_ROOT . '/public/uploads/hero';
        if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) {
            throw new InvalidArgumentException('Не удалось создать папку для видео.');
        }
        $name = bin2hex(random_bytes(8)) . '.' . $extensions[$mime];
        if (!move_uploaded_file((string) $file['tmp_name'], $directory . '/' . $name)) {
            throw new InvalidArgumentException('Не удалось сохранить видео.');
        }
        return '/uploads/hero/' . $name;
    }

    public static function isHeroVideo(string $path): bool
    {
        return preg_match('#^/uploads/hero/[a-f0-9]{16}\.(mp4|webm)$#', $path) === 1;
    }

    public static function deleteHeroVideo(string $path): void
    {
        if (!self::isHeroVideo($path)) {
            return;
        }
        $file = APP_ROOT . '/public' . $path;
        if (is_file($file)) {
            @unlink($file);
        }
    }

    private static bool $tableReady = false;

    private static function ready(): bool
    {
        if (self::$tableReady) {
            return true;
        }
        try {
            self::ensureTable();
            self::$tableReady = true;
        } catch (RuntimeException) {
            return false;
        }
        return true;
    }

    /** @return list<array<string, string>>|null */
    private static function stored(string $key): ?array
    {
        if (!self::ready()) {
            return null;
        }
        try {
            $row = Database::fetchOne('SELECT payload FROM site_blocks WHERE block_key = ?', [$key]);
        } catch (RuntimeException) {
            return null;
        }
        if ($row === null) {
            return null;
        }
        $decoded = json_decode((string) $row['payload'], true);
        if (!is_array($decoded)) {
            return [];
        }
        $rows = [];
        foreach ($decoded as $item) {
            if (is_array($item)) {
                $rows[] = array_map(static fn ($value): string => is_scalar($value) ? (string) $value : '', $item);
            }
        }
        return $rows;
    }

    /** @param list<array<string, string>> $rows */
    private static function write(string $key, array $rows): void
    {
        self::ensureTable();
        $json = json_encode(array_values($rows), JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        Database::execute(
            'INSERT INTO site_blocks (block_key, payload) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE payload = VALUES(payload)',
            [$key, $json]
        );
    }

    /** @return list<array<string, string>> */
    private static function defaultSchedule(): array
    {
        $rows = [];
        foreach (site('schedule') as $slot) {
            $day = (string) $slot['weekday'];
            $rows[] = [
                'weekday' => str_starts_with($day, 'weekday.') ? substr($day, 8) : $day,
                'time' => (string) $slot['time'],
                'note_ru' => I18n::translateIn('ru', (string) $slot['note']),
                'note_kk' => I18n::translateIn('kk', (string) $slot['note']),
            ];
        }
        return $rows;
    }

    /** @return list<array<string, string>> */
    private static function defaultWorks(): array
    {
        $rows = [];
        foreach (site('works') as $index => $work) {
            $rows[] = [
                'image' => '/images/works/' . $work['file'],
                'title_ru' => I18n::translateIn('ru', 'work.' . $index . '.title'),
                'title_kk' => I18n::translateIn('kk', 'work.' . $index . '.title'),
                'category_ru' => I18n::translateIn('ru', 'work.' . $index . '.category'),
                'category_kk' => I18n::translateIn('kk', 'work.' . $index . '.category'),
                'alt_ru' => (string) $work['alt_ru'],
                'alt_kk' => (string) $work['alt_kk'],
            ];
        }
        return $rows;
    }

    /** @return list<array<string, string>> */
    private static function defaultVideos(): array
    {
        $rows = [];
        foreach (site('videos') as $index => $video) {
            $rows[] = [
                'youtube_id' => (string) $video['youtube_id'],
                'title_ru' => I18n::translateIn('ru', 'lesson.' . $index . '.title'),
                'title_kk' => I18n::translateIn('kk', 'lesson.' . $index . '.title'),
            ];
        }
        return $rows;
    }

    /** @return list<array<string, string>> */
    public static function faqRows(): array
    {
        return self::stored('faq') ?? self::defaultFaq();
    }

    /** @param list<array<string, string>> $rows */
    public static function saveFaq(array $rows): void
    {
        self::write('faq', $rows);
    }

    /** @return list<array{q: string, a: string}> */
    public static function faqForPage(): array
    {
        $items = [];
        foreach (self::faqRows() as $row) {
            $question = loc($row, 'q');
            $answer = loc($row, 'a');
            if ($question !== '' && $answer !== '') {
                $items[] = ['q' => $question, 'a' => $answer];
            }
        }
        return $items;
    }

    /** @return array<string, mixed> */
    public static function aboutData(): array
    {
        $stored = self::object('about');
        if (is_array($stored) && isset($stored['paragraphs']) && is_array($stored['paragraphs'])) {
            return $stored;
        }
        return self::defaultAbout();
    }

    /** @param array<string, mixed> $data */
    public static function saveAbout(array $data): void
    {
        $previous = self::object('about');
        $oldPhoto = is_array($previous) ? (string) ($previous['photo'] ?? '') : '';
        self::saveObject('about', $data);
        $newPhoto = (string) ($data['photo'] ?? '');
        if ($oldPhoto !== '' && $oldPhoto !== $newPhoto) {
            Admin::deleteUploadedImage($oldPhoto);
        }
    }

    /** @return list<array<string, string>> */
    public static function awardRows(): array
    {
        return self::stored('awards') ?? [];
    }

    /** @param list<array<string, string>> $rows */
    public static function saveAwards(array $rows): void
    {
        $previous = self::stored('awards') ?? [];
        self::write('awards', $rows);
        $kept = array_column($rows, 'image');
        foreach ($previous as $old) {
            $image = (string) ($old['image'] ?? '');
            if ($image !== '' && !in_array($image, $kept, true)) {
                Admin::deleteUploadedImage($image);
            }
        }
    }

    /** @return array<string, string> */
    public static function contactSettings(): array
    {
        if (self::$contactCache !== null) {
            return self::$contactCache;
        }
        $stored = self::object('contacts');
        $settings = [];
        if (is_array($stored)) {
            foreach ($stored as $key => $value) {
                if (is_string($key) && is_scalar($value)) {
                    $settings[$key] = (string) $value;
                }
            }
        }
        self::$contactCache = $settings;
        return self::$contactCache;
    }

    public static function contactValue(string $key): ?string
    {
        $value = trim(self::contactSettings()[$key] ?? '');
        return $value === '' ? null : $value;
    }

    public static function address(): string
    {
        $settings = self::contactSettings();
        if ($settings === []) {
            return I18n::translate('contacts.address');
        }
        $text = loc($settings, 'address');
        return $text !== '' ? $text : I18n::translate('contacts.address');
    }

    /** @param array<string, string> $settings */
    public static function saveContacts(array $settings): void
    {
        self::$contactCache = null;
        self::saveObject('contacts', $settings);
    }

    /** @return array<string, mixed>|null */
    private static function object(string $key): ?array
    {
        if (!self::ready()) {
            return null;
        }
        try {
            $row = Database::fetchOne('SELECT payload FROM site_blocks WHERE block_key = ?', [$key]);
        } catch (RuntimeException) {
            return null;
        }
        if ($row === null) {
            return null;
        }
        $decoded = json_decode((string) $row['payload'], true);
        return is_array($decoded) ? $decoded : null;
    }

    /** @param array<string, mixed> $data */
    private static function saveObject(string $key, array $data): void
    {
        self::ensureTable();
        $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        Database::execute(
            'INSERT INTO site_blocks (block_key, payload) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE payload = VALUES(payload)',
            [$key, $json]
        );
    }

    /** @return list<array<string, string>> */
    private static function defaultFaq(): array
    {
        $rows = [];
        for ($i = 0; $i < (int) site('faq_count'); $i++) {
            $rows[] = [
                'q_ru' => I18n::translateIn('ru', 'faq.' . $i . '.q'),
                'q_kk' => I18n::translateIn('kk', 'faq.' . $i . '.q'),
                'a_ru' => I18n::translateIn('ru', 'faq.' . $i . '.a'),
                'a_kk' => I18n::translateIn('kk', 'faq.' . $i . '.a'),
            ];
        }
        return $rows;
    }

    /** @return array<string, mixed> */
    private static function defaultAbout(): array
    {
        $paragraphs = [];
        for ($i = 0; $i < (int) site('about_paragraphs'); $i++) {
            $paragraphs[] = [
                'ru' => I18n::translateIn('ru', 'about.p' . $i),
                'kk' => I18n::translateIn('kk', 'about.p' . $i),
            ];
        }
        return [
            'name' => 'Ольга Лаптева',
            'role_ru' => I18n::translateIn('ru', 'about.role'),
            'role_kk' => I18n::translateIn('kk', 'about.role'),
            'photo' => '/images/room.jpg',
            'alt_ru' => I18n::translateIn('ru', 'about.photoAlt'),
            'alt_kk' => I18n::translateIn('kk', 'about.photoAlt'),
            'paragraphs' => $paragraphs,
        ];
    }

    /** @var array<string, string>|null */
    private static ?array $contactCache = null;
}
