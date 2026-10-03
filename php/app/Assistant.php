<?php
declare(strict_types=1);

/** Answers visitor questions from studio facts via a configured chat model. */
final class Assistant
{
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
            'temperature' => 0.2,
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
        $content = $decoded['choices'][0]['message']['content'] ?? '';
        $answer = is_string($content) ? json_decode($content, true) : null;
        if (!is_array($answer)) {
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
        return "Ты Мила, консультант творческой студии Lappy Art в Семее. Ольга сейчас не на связи, ты отвечаешь вместо неё. Пиши тепло, коротко, от первого лица, на языке вопроса. "
            . "Используй только факты ниже. Не выдумывай цены, скидки, даты и формат занятий. "
            . "Если факта нет, скажи, что это уточнит Ольга, и предложи заявку. "
            . "Верни JSON {\"text\":\"ответ\",\"href\":\"\"}. href можно оставить пустым или взять одно значение: "
            . "/#signup, /#schedule, /#courses, /#faq, /#contacts, telegram, whatsapp, map.\n\n"
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
                $lines[] = ($kind === 'course' ? 'Занятие' : 'Мастер-класс')
                    . ': ' . loc($item, 'title')
                    . ', цена: ' . (string) ($item['price_label'] ?? '')
                    . ', ' . loc($item, 'duration')
                    . ', уровень: ' . loc($item, 'level')
                    . '. ' . loc($item, 'description');
            }
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

    /** @param array<string, mixed> $payload */
    private static function request(array $payload): ?string
    {
        $url = Config::get('ASSISTANT_API_URL', 'https://api.openai.com/v1/chat/completions');
        $handle = curl_init($url);
        if ($handle === false) {
            return null;
        }
        curl_setopt_array($handle, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 20,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . Config::get('ASSISTANT_API_KEY'),
            ],
            CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
        ]);
        $body = curl_exec($handle);
        $status = (int) curl_getinfo($handle, CURLINFO_HTTP_CODE);
        curl_close($handle);
        return is_string($body) && $status >= 200 && $status < 300 ? $body : null;
    }
}
