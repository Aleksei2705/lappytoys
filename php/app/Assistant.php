<?php
declare(strict_types=1);

/** Answers visitor questions from studio facts via a configured chat model. */
final class Assistant
{
    private static string $lastError = '';

    public static function lastError(): string
    {
        return self::$lastError;
    }
    public static function enabled(): bool
    {
        return Config::get('ASSISTANT_API_KEY') !== '';
    }

    public static function answer(string $question, array $history): ?array
    {
        if (!self::enabled()) {
            return null;
        }

        $payload = [
            'model' => Config::get('ASSISTANT_MODEL', 'gpt-4o-mini'),
            'temperature' => 0.8,
            'response_format' => ['type' => 'json_object'],
            'messages' => [
                ['role' => 'system', 'content' => self::instructions()],
                ...self::historyMessages($history),
                ['role' => 'user', 'content' => $question],
            ],
        ];

        $raw = self::request($payload);
        if ($raw === null) {
            return null;
        }

        $decoded = json_decode($raw, true);
        $content = $decoded['choices'][0]['message']['content']
            ?? $decoded['candidates'][0]['content']['parts'][0]['text']
            ?? '';
        $answer = is_string($content) ? json_decode(self::jsonText($content), true) : null;
        if (!is_array($answer)) {
            self::$lastError = self::$lastError !== '' ? self::$lastError : 'model-format';
            return null;
        }

        $text = trim((string) ($answer['text'] ?? ''));
        if ($text === '') {
            return null;
        }

        $href = self::allowedLink((string) ($answer['href'] ?? ''));
        return [
            'text' => mb_substr($text, 0, 700),
            'href' => $href,
            'link' => $href === '' ? '' : self::linkLabel($href),
        ];
    }

    private static function instructions(): string
    {
        return "Ты Мила, вежливый консультант творческой студии Lappy Art в Семее. Ольга сейчас не на связи, ты отвечаешь вместо неё. "
            . "Пиши тепло, коротко, от первого лица, на языке вопроса, как живой человек в переписке. "
            . "Каждый ответ формулируй заново: не повторяй прошлые фразы и не начинай одинаково. "
            . "Можно лёгкую улыбку и мягкий юмор, без сарказма, без шуток над гостем и в рамках спокойного офисного разговора. "
            . "Про студию используй только факты ниже. Не выдумывай цены, скидки, даты и формат занятий. "
            . "Если вопрос не про студию, можно коротко и вежливо ответить с лёгким юмором, но не больше двух таких ответов за весь разговор. "
            . "В конце такого ответа мягко верни гостя к занятиям. Третий посторонний вопрос уже не развивай: вежливо скажи, что дальше ты про студию. "
            . "Не обсуждай политику, медицину, интимные темы и всё, что неуместно на работе. "
            . "Если факта о студии нет, вежливо скажи, что это уточнит Ольга, и верни href \"/#signup\". "
            . "Верни JSON {\"text\":\"ответ\",\"href\":\"\"}. href можно оставить пустым или взять одно значение: "
            . "/#signup, /#schedule, /#courses, /#online, /#faq, /#contacts, telegram, whatsapp, map.\n\n"
            . self::facts();
    }

    private static function facts(): string
    {
        $lines = [
            'Студия: ' . site('name') . ', ' . t('contacts.address'),
            'Телефон: ' . site('phone_display'),
            'Telegram Ольги: ' . site('telegram'),
            'Группа: ' . site('telegram_group'),
            'WhatsApp: ' . site('whatsapp'),
            t('assistant.a.signup'),
            t('assistant.a.age'),
            t('assistant.a.materials'),
            t('assistant.a.duration'),
            t('assistant.a.price'),
            t('assistant.a.group'),
        ];

        $slots = [];
        foreach (SiteContent::scheduleForPage() as $slot) {
            $note = trim((string) $slot['note']);
            $slots[] = $slot['weekday'] . ' ' . $slot['time'] . ($note !== '' ? ' — ' . $note : '');
        }
        if ($slots !== []) {
            $lines[] = 'Расписание: ' . implode('; ', $slots) . '. Точную дату подтверждают при записи.';
        }

        foreach (['course', 'master_class'] as $kind) {
            foreach (ClassRepository::published($kind) as $item) {
                $lines[] = ($kind === 'course' ? 'Занятие в студии' : 'Мастер-класс в студии')
                    . ': ' . loc($item, 'title')
                    . ', цена: ' . (string) ($item['price_label'] ?? '')
                    . ', ' . loc($item, 'duration')
                    . ', уровень: ' . loc($item, 'level')
                    . '. ' . loc($item, 'description');
            }
        }

        $lines[] = t('assistant.a.onlineIntro');
        try {
            $shopProducts = Shop::published();
        } catch (RuntimeException) {
            $shopProducts = [];
        }
        foreach ($shopProducts as $product) {
            $kind = (string) ($product['kind'] ?? 'lesson');
            $kindLabel = $kind === 'master_class' ? 'Онлайн мастер-класс (купить)' : 'Онлайн видеоурок (купить)';
            $slug = (string) ($product['slug'] ?? '');
            $lines[] = $kindLabel
                . ': ' . loc($product, 'title')
                . ', цена: ' . Shop::price((int) ($product['price_kzt'] ?? 0))
                . '. ' . loc($product, 'description')
                . ($slug !== '' ? ' Страница покупки: /online/' . $slug . '/' : '');
        }

        for ($i = 0; $i < (int) site('faq_count'); $i++) {
            $lines[] = 'Вопрос: ' . t('faq.' . $i . '.q') . ' Ответ: ' . t('faq.' . $i . '.a');
        }

        return implode("\n", $lines);
    }

    /** @param list<array<string, string>> $history */
    private static function historyMessages(array $history): array
    {
        $messages = [];
        foreach (array_slice($history, -6) as $item) {
            $role = ($item['role'] ?? '') === 'user' ? 'user' : 'assistant';
            $text = trim((string) ($item['text'] ?? ''));
            if ($text === '') {
                continue;
            }
            $messages[] = ['role' => $role, 'content' => mb_substr($text, 0, 500)];
        }
        return $messages;
    }

    private static function allowedLink(string $href): string
    {
        $map = [
            '/#signup' => bookingUrl(),
            '/#schedule' => '/#schedule',
            '/#courses' => '/#courses',
            '/#online' => '/#online',
            '/#faq' => '/#faq',
            '/#contacts' => '/#contacts',
            'telegram' => (string) site('telegram'),
            'whatsapp' => (string) site('whatsapp'),
            'map' => (string) site('map_link'),
        ];
        return $map[$href] ?? '';
    }

    private static function linkLabel(string $href): string
    {
        if (str_contains($href, '#signup') || $href === bookingUrl()) {
            return t('assistant.link.signup');
        }
        if (str_contains($href, '#schedule')) {
            return t('assistant.link.schedule');
        }
        if (str_contains($href, '#courses')) {
            return t('assistant.link.courses');
        }
        if (str_contains($href, '#online')) {
            return t('assistant.link.online');
        }
        if (str_contains($href, '/online/')) {
            return t('assistant.link.online');
        }
        if (str_contains($href, 't.me')) {
            return t('assistant.link.telegram');
        }
        if (str_contains($href, 'wa.me')) {
            return t('assistant.link.whatsapp');
        }
        if (str_contains($href, 'map') || str_contains($href, '2gis') || str_contains($href, 'yandex')) {
            return t('assistant.link.map');
        }
        return t('cta.details');
    }

    /** @param list<array{role: string, text: string}> $messages */
    public static function remember(string $publicId, array $messages): void
    {
        if (!preg_match('/^[a-f0-9]{32}$/', $publicId)) {
            return;
        }

        $lines = [];
        foreach (array_slice($messages, -40) as $message) {
            $text = trim((string) ($message['text'] ?? ''));
            if ($text === '') {
                continue;
            }
            $who = ($message['role'] ?? '') === 'user' ? 'Гость' : 'Мила';
            $lines[] = $who . ': ' . mb_substr($text, 0, 700);
        }
        if ($lines === []) {
            return;
        }

        $transcript = implode("\n\n", $lines);
        self::ensureTable();
        Database::execute(
            'INSERT INTO assistant_chats (public_id, transcript, created_at, updated_at)
             VALUES (?, ?, NOW(), NOW())
             ON DUPLICATE KEY UPDATE transcript = VALUES(transcript), updated_at = NOW()',
            [$publicId, $transcript],
        );
    }

    public static function ensureTable(): void
    {
        Database::execute(
            'CREATE TABLE IF NOT EXISTS assistant_chats (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                public_id CHAR(32) NOT NULL,
                transcript LONGTEXT NOT NULL,
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY assistant_chats_public (public_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
        );
    }

    private static function usesOpenRouter(): bool
    {
        $url = Config::get('ASSISTANT_API_URL', '');
        $key = Config::get('ASSISTANT_API_KEY', '');
        return str_contains($url, 'openrouter.ai') || str_starts_with($key, 'sk-or-');
    }

    /** @param array<string, mixed> $payload */
    private static function request(array $payload): ?string
    {
        if (Config::get('ASSISTANT_API_KEY') === '') {
            self::$lastError = '0 no-key';
            return null;
        }
        return self::usesOpenRouter() ? self::openRouter($payload) : self::gemini($payload);
    }

    /** @param array<string, mixed> $payload */
    private static function openRouter(array $payload): ?string
    {
        $headers = [
            'Content-Type: application/json',
            'Authorization: Bearer ' . Config::get('ASSISTANT_API_KEY'),
            'HTTP-Referer: ' . site('url'),
            'X-Title: Lappy Art',
        ];
        $url = 'https://openrouter.ai/api/v1/chat/completions';
        $payload['max_tokens'] = 500;
        foreach (self::openRouterModels() as $model) {
            $payload['model'] = $model;
            $encoded = json_encode($payload, JSON_UNESCAPED_UNICODE);
            $result = self::post($url, $headers, $encoded);
            if ($result === null && str_starts_with(self::$lastError, '400')) {
                unset($payload['response_format']);
                $encoded = json_encode($payload, JSON_UNESCAPED_UNICODE);
                $result = self::post($url, $headers, $encoded);
            }
            if ($result !== null) {
                return $result;
            }
            if (!str_starts_with(self::$lastError, '404') && !str_starts_with(self::$lastError, '503')) {
                break;
            }
        }
        return null;
    }

    /** @return list<string> */
    private static function openRouterModels(): array
    {
        $configured = Config::get('ASSISTANT_MODEL', '');
        $primary = str_contains($configured, '/') ? $configured : 'google/gemini-2.5-flash';
        $models = [$primary];
        foreach (['google/gemini-2.5-flash', 'openai/gpt-4o-mini'] as $model) {
            if (!in_array($model, $models, true)) {
                $models[] = $model;
            }
        }
        return $models;
    }

    /** @param array<string, mixed> $payload */
    private static function gemini(array $payload): ?string
    {
        $headers = [
            'Content-Type: application/json',
            'x-goog-api-key: ' . Config::get('ASSISTANT_API_KEY'),
        ];
        $encoded = json_encode(self::geminiBody($payload), JSON_UNESCAPED_UNICODE);
        foreach (self::geminiUrls(self::endpoint()) as $target) {
            $result = self::post($target, $headers, $encoded);
            if ($result !== null) {
                return $result;
            }
            if (!self::shouldTryNextGeminiModel(self::$lastError)) {
                break;
            }
        }
        return null;
    }

    private static function shouldTryNextGeminiModel(string $error): bool
    {
        return str_starts_with($error, '503')
            || str_starts_with($error, '404');
    }

    /** @return list<string> */
    private static function geminiUrls(string $primary): array
    {
        $urls = [$primary];
        foreach (['gemini-2.5-flash', 'gemini-3-flash', 'gemini-flash-latest'] as $model) {
            $url = 'https://generativelanguage.googleapis.com/v1beta/models/' . $model . ':generateContent';
            if (!in_array($url, $urls, true)) {
                $urls[] = $url;
            }
        }
        return $urls;
    }

    /** @param list<string> $headers */
    private static function post(string $url, array $headers, string $body): ?string
    {
        $handle = curl_init($url);
        if ($handle === false) {
            self::$lastError = '0 no-response';
            return null;
        }
        curl_setopt_array($handle, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 20,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POSTFIELDS => $body,
        ]);
        $response = curl_exec($handle);
        $status = (int) curl_getinfo($handle, CURLINFO_HTTP_CODE);
        $curlError = curl_error($handle);
        curl_close($handle);
        if (is_string($response) && $status >= 200 && $status < 300) {
            self::$lastError = '';
            return $response;
        }
        self::$lastError = self::safeError($status, is_string($response) ? $response : $curlError);
        error_log('[assistant] ' . self::$lastError);
        return null;
    }

    private static function jsonText(string $content): string
    {
        $content = trim($content);
        if (str_starts_with($content, '```')) {
            $content = preg_replace('/^```(?:json)?\s*|\s*```$/', '', $content) ?? $content;
        }
        return trim($content);
    }

    private static function safeError(int $status, string $body): string
    {
        $decoded = json_decode($body, true);
        $message = is_array($decoded) ? (string) ($decoded['error']['message'] ?? '') : '';
        if ($message === '') {
            $message = trim($body) !== '' ? trim($body) : 'no-response';
        }
        $message = preg_replace('/AIza[\w\-]+/', '[key]', $message) ?? $message;
        $message = preg_replace('/sk-or-[\w\-]+/', '[key]', $message) ?? $message;
        $message = preg_replace('/key=[^&\s]+/', 'key=[key]', $message) ?? $message;
        return $status . ' ' . mb_substr($message, 0, 180);
    }

    private static function endpoint(): string
    {
        $retired = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
        $model = 'gemini-3.8-flash';
        $url = Config::get('ASSISTANT_API_URL', '');
        $configured = Config::get('ASSISTANT_MODEL', '');
        if (preg_match('#models/(gemini-[a-z0-9.\-]+):generateContent#', $url, $match) === 1) {
            $configured = $match[1];
        }
        if ($configured !== '' && !in_array($configured, $retired, true) && str_starts_with($configured, 'gemini-')) {
            $model = $configured;
        }
        return 'https://generativelanguage.googleapis.com/v1beta/models/' . $model . ':generateContent';
    }

    /** @param array<string, mixed> $payload */
    private static function geminiBody(array $payload): array
    {
        $system = '';
        $contents = [];
        foreach ($payload['messages'] as $message) {
            $role = (string) ($message['role'] ?? 'user');
            $text = (string) ($message['content'] ?? '');
            if ($role === 'system') {
                $system = $text;
                continue;
            }
            $contents[] = [
                'role' => $role === 'assistant' ? 'model' : 'user',
                'parts' => [['text' => $text]],
            ];
        }
        return [
            'systemInstruction' => ['parts' => [['text' => $system]]],
            'contents' => $contents,
            'generationConfig' => [
                'temperature' => 0.8,
                'responseMimeType' => 'application/json',
            ],
        ];
    }
}
