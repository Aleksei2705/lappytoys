<?php
declare(strict_types=1);

/** Handles Telegram bot updates (shop order buttons). */
final class TelegramWebhook
{
    /** @param array<string, mixed> $update */
    public static function handle(array $update): void
    {
        $membership = $update['my_chat_member'] ?? null;
        if (is_array($membership)) {
            self::reportChatId($membership);
            return;
        }

        $callback = $update['callback_query'] ?? null;
        if (!is_array($callback)) {
            return;
        }

        $from = $callback['from'] ?? null;
        $userId = is_array($from) ? (int) ($from['id'] ?? 0) : 0;
        if ($userId < 1 || !self::isAllowedOperator($userId)) {
            self::answer($callback, 'Нет доступа.', true);
            return;
        }

        $data = (string) ($callback['data'] ?? '');
        if (preg_match('/^shop_(paid|cancel):(\d+)$/', $data, $matches) !== 1) {
            return;
        }

        $action = $matches[1];
        $orderId = (int) $matches[2];
        try {
            $order = Shop::findOrder($orderId);
        } catch (RuntimeException) {
            self::answer($callback, 'Ошибка базы данных.', true);
            return;
        }

        if ($order === null) {
            self::answer($callback, 'Заявка не найдена.', true);
            return;
        }

        $status = (string) ($order['status'] ?? '');
        if ($action === 'paid') {
            if ($status === 'paid') {
                self::answer($callback, 'Уже отмечено как оплачено.');
                return;
            }
            if ($status !== 'pending') {
                self::answer($callback, 'Заявка закрыта.', true);
                return;
            }
            if (!Shop::markPaid($orderId)) {
                self::answer($callback, 'Уже отмечено как оплачено.');
                return;
            }
            self::answer($callback, 'Оплата подтверждена. Следующее сообщение — ссылка в канал и на сайт.', true);
            self::markMessageHandled($callback, '✅ Оплачено');
            Notifier::confirmPaid($order);
            return;
        }

        if ($status === 'cancelled') {
            self::answer($callback, 'Уже отменено.');
            return;
        }
        if ($status !== 'pending') {
            self::answer($callback, 'Нельзя отменить.', true);
            return;
        }
        Shop::cancel($orderId);
        self::answer($callback, 'Заявка отменена.');
        self::markMessageHandled($callback, '❌ Отменено');
    }

    /** @param array<string, mixed> $membership */
    private static function reportChatId(array $membership): void
    {
        $chat = $membership['chat'] ?? null;
        $next = $membership['new_chat_member'] ?? null;
        if (!is_array($chat) || !is_array($next)) {
            return;
        }
        $status = (string) ($next['status'] ?? '');
        if (!in_array($status, ['member', 'administrator'], true)) {
            return;
        }
        $chatId = (string) ($chat['id'] ?? '');
        if (preg_match('/^-\d{5,20}$/', $chatId) !== 1) {
            return;
        }
        $title = trim((string) ($chat['title'] ?? ''));
        if ($title === '') {
            $title = 'без названия';
        }
        Telegram::send(
            "Канал подключён: <b>" . htmlspecialchars($title, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "</b>\n"
            . "ID: <code>{$chatId}</code>\n"
            . "Вставьте это число в товар, в поле «Закрытый канал Telegram».",
        );
    }

    private static function isAllowedOperator(int $userId): bool
    {
        $list = Config::get('TELEGRAM_ADMIN_USER_IDS');
        if ($list !== '') {
            foreach (preg_split('/\s*,\s*/', $list) ?: [] as $part) {
                if ($part !== '' && (int) $part === $userId) {
                    return true;
                }
            }
        }

        $chatId = Config::get('TELEGRAM_CHAT_ID');
        return $chatId !== '' && !str_starts_with($chatId, '-') && (string) $userId === $chatId;
    }

    /** @param array<string, mixed> $callback */
    private static function answer(array $callback, string $text, bool $alert = false): void
    {
        $id = (string) ($callback['id'] ?? '');
        if ($id === '') {
            return;
        }
        Telegram::call('answerCallbackQuery', [
            'callback_query_id' => $id,
            'text' => $text,
            'show_alert' => $alert,
        ]);
    }

    /** @param array<string, mixed> $callback */
    private static function markMessageHandled(array $callback, string $statusLine): void
    {
        $message = $callback['message'] ?? null;
        if (!is_array($message)) {
            return;
        }
        $chatId = $message['chat']['id'] ?? null;
        $messageId = $message['message_id'] ?? null;
        $text = (string) ($message['text'] ?? '');
        if ($chatId === null || $messageId === null || $text === '') {
            return;
        }

        Telegram::call('editMessageText', [
            'chat_id' => $chatId,
            'message_id' => (int) $messageId,
            'text' => $text . "\n\n" . $statusLine,
            'disable_web_page_preview' => true,
            'reply_markup' => ['inline_keyboard' => []],
        ]);
    }
}
