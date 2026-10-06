<?php
declare(strict_types=1);

final class Notifier
{
    /** @param array{name: string, phone: string, direction: string, preferred_date: ?string, message: ?string} $booking */
    public static function booking(array $booking): bool
    {
        $lines = [
            '🆕 <b>Новая заявка</b> — lappytoys.kz',
            '',
            'Имя: ' . self::h($booking['name']),
            'Телефон: ' . self::h($booking['phone']),
            'Направление: ' . self::h($booking['direction']),
        ];
        if ($booking['preferred_date'] !== null) {
            $lines[] = 'Желаемая дата: ' . self::h(date('d.m.Y', (int) strtotime($booking['preferred_date'])));
        }
        if ($booking['message'] !== null && $booking['message'] !== '') {
            $lines[] = '';
            $lines[] = self::h($booking['message']);
        }
        $lines[] = '';
        $lines[] = '🕒 ' . date('d.m.Y H:i');

        return Telegram::send(implode("\n", $lines));
    }

    /** @param array{name: string, phone: string, direction: string, preferred_date: ?string, message: ?string} $booking */
    public static function bookingEmail(array $booking): bool
    {
        $lines = [
            'Новая заявка — lappytoys.kz',
            '',
            'Имя: ' . $booking['name'],
            'Телефон: ' . $booking['phone'],
            'Направление: ' . $booking['direction'],
        ];
        if ($booking['preferred_date'] !== null) {
            $lines[] = 'Желаемая дата: ' . date('d.m.Y', (int) strtotime($booking['preferred_date']));
        }
        if ($booking['message'] !== null && $booking['message'] !== '') {
            $lines[] = '';
            $lines[] = $booking['message'];
        }
        $lines[] = '';
        $lines[] = date('d.m.Y H:i');

        return Mail::send((string) site('notify_email'), 'Новая заявка — ' . $booking['name'], implode("\n", $lines));
    }

    /** @param array{id: int, name: string, phone: string, title: string, link: string} $order */
    public static function shopOrder(array $order): bool
    {
        $lines = [
            '🛒 <b>Онлайн-покупка</b> — lappytoys.kz',
            '',
            'Имя: ' . self::h($order['name']),
            'Телефон: ' . self::h($order['phone']),
            'Товар: ' . self::h($order['title']),
            '',
            'Ссылка для покупателя:',
            self::h($order['link']),
            '',
            'Выставьте счёт в Kaspi по телефону. Когда оплата пришла — нажмите «Оплачено».',
            '',
            '🕒 ' . date('d.m.Y H:i'),
        ];

        $keyboard = [
            'inline_keyboard' => [[
                ['text' => '✅ Оплачено', 'callback_data' => 'shop_paid:' . $order['id']],
                ['text' => 'Отменить', 'callback_data' => 'shop_cancel:' . $order['id']],
            ]],
        ];

        $text = implode("\n", $lines);
        Telegram::ensureWebhook();
        if (Telegram::send($text, $keyboard)) {
            return true;
        }
        error_log('[shop-order] telegram with buttons failed, retrying plain message');
        return Telegram::send($text);
    }

    /** @param array<string, mixed> $order */
    public static function confirmPaid(array $order): bool
    {
        $invite = Shop::grantChannel($order);
        $channelId = trim((string) ($order['channel_id'] ?? ''));
        $error = '';
        if ($invite === '' && preg_match('/^-\d{5,20}$/', $channelId) === 1) {
            $error = Telegram::lastError();
            if ($error === '') {
                $error = 'Telegram не вернул ссылку приглашения.';
            }
        }
        return self::shopPaid([
            'name' => (string) $order['name'],
            'phone' => (string) $order['phone'],
            'title' => (string) ($order['title_ru'] ?? ''),
            'link' => Shop::orderUrl($order),
            'invite' => $invite,
            'invite_error' => $error,
        ]);
    }

    /**
     * After payment: the closed-channel invite and the site page, ready to forward to the buyer.
     *
     * @param array{name: string, phone: string, title: string, link: string, invite?: string, invite_error?: string} $order
     */
    public static function shopPaid(array $order): bool
    {
        $invite = (string) ($order['invite'] ?? '');
        $buyerLines = ['Оплата подтверждена.'];
        if (Shop::isInviteLink($invite)) {
            $buyerLines[] = 'Закрытый канал. Ссылка одноразовая — откройте её один раз:';
            $buyerLines[] = $invite;
        }
        $buyerLines[] = 'Страница на сайте, если закроете это сообщение:';
        $buyerLines[] = $order['link'];
        $buyerText = implode("\n", $buyerLines);
        $lines = [
            '✅ <b>Ссылка покупателю открыта</b>',
            '',
            self::h($order['name']) . ' · ' . self::h($order['phone']),
            self::h($order['title']),
            '',
            self::h($buyerText),
        ];
        $inviteError = trim((string) ($order['invite_error'] ?? ''));
        if ($inviteError !== '') {
            $lines[] = '';
            $lines[] = 'Канал не открылся: ' . self::h($inviteError);
            $lines[] = 'Добавьте бота администратором канала с правом приглашать.';
        }
        $lines[] = '';
        $lines[] = 'Кнопка ниже откроет WhatsApp покупателя с этим текстом. Нажмите «Отправить».';
        $text = implode("\n", $lines);
        $keyboard = [];
        if (Shop::isInviteLink($invite)) {
            $keyboard[] = [['text' => 'Открыть канал', 'url' => $invite]];
        }
        $whatsapp = self::whatsappToBuyer((string) $order['phone'], $buyerText);
        if ($whatsapp !== null) {
            $keyboard[] = [['text' => 'Отправить покупателю в WhatsApp', 'url' => $whatsapp]];
        }
        if ($keyboard !== [] && Telegram::send($text, ['inline_keyboard' => $keyboard])) {
            return true;
        }
        return Telegram::send($text);
    }

    private static function whatsappToBuyer(string $phone, string $text): ?string
    {
        $digits = preg_replace('/\D/', '', $phone) ?? '';
        if (strlen($digits) < 10 || strlen($digits) > 15) {
            return null;
        }
        $url = 'https://wa.me/' . $digits . '?text=' . rawurlencode($text);
        return strlen($url) <= 2048 ? $url : null;
    }

    /** @param array{name: string, course: string, rating: int, text: string} $review */
    public static function review(array $review): bool
    {
        $lines = [
            '⭐ <b>Новый отзыв на модерации</b> — lappytoys.kz',
            '',
            'Имя: ' . self::h($review['name']),
            'Курс: ' . self::h($review['course']),
            'Оценка: ' . $review['rating'] . '/5',
            '',
            self::h($review['text']),
            '',
            '🕒 ' . date('d.m.Y H:i'),
        ];

        return Telegram::send(implode("\n", $lines));
    }

    private static function h(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}
