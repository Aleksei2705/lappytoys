<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

$adminUser = Admin::guard();
$adminTitle = 'Оплаты онлайн';
$adminSection = 'shop';
$orders = [];
$labels = ['pending' => 'Ждёт оплаты', 'paid' => 'Оплачено', 'cancelled' => 'Отменено'];

try {
    if (Admin::isPost()) {
        Admin::verifyPost();
        $id = Admin::intParam($_POST, 'id');
        $action = Admin::text($_POST, 'action');
        if ($id > 0 && $action === 'paid') {
            Shop::markPaid($id);
            Admin::flash('success', 'Оплата отмечена. Ссылка на скачивание открыта.');
        } elseif ($id > 0 && $action === 'cancel') {
            Shop::cancel($id);
            Admin::flash('success', 'Заявка отменена.');
        } elseif ($action === 'telegram_webhook') {
            $result = Telegram::registerWebhook();
            Admin::flash(
                $result['ok'] ? 'success' : 'error',
                $result['ok']
                    ? 'Кнопки «Оплачено» и «Отменить» включены. Нажмите их под сообщением о покупке в Telegram.'
                    : 'Кнопки не включились: ' . $result['detail'],
            );
        } elseif ($action === 'telegram_test') {
            $sent = Telegram::send('🧪 Тест: уведомления онлайн-магазина lappytoys.kz');
            $detail = Telegram::lastError();
            Admin::flash(
                $sent ? 'success' : 'error',
                $sent
                    ? 'Тест отправлен в чат ' . Config::get('TELEGRAM_CHAT_ID') . '. Откройте Telegram (не SMS).'
                    : 'Telegram: ' . ($detail !== '' ? $detail : 'не удалось отправить. Проверьте .env на сервере.'),
            );
        } elseif ($id > 0 && $action === 'telegram_resend') {
            $order = Shop::findOrder($id);
            if ($order === null) {
                Admin::flash('error', 'Заявка не найдена.');
            } else {
                $link = site('url') . '/online/' . $order['slug'] . '/?order=' . $order['token'];
                $sent = Notifier::shopOrder([
                    'id' => $id,
                    'name' => (string) $order['name'],
                    'phone' => (string) $order['phone'],
                    'title' => (string) $order['title_ru'],
                    'link' => $link,
                ]);
                if ($sent) {
                    Shop::markTelegramSent($id);
                    Admin::flash('success', 'Сообщение отправлено в Telegram.');
                } else {
                    Admin::flash('error', 'Telegram: ' . Telegram::lastError());
                }
            }
        }
        Admin::redirect('/admin/shop-orders.php');
    }
    $orders = Shop::orders();
} catch (RuntimeException) {
    Admin::flash('error', 'Ошибка базы данных. Подробности в логе сервера.');
}

require APP_ROOT . '/templates/admin/header.php';
?>
<div class="mb-4 flex flex-wrap items-center gap-3">
    <a href="/admin/shop.php" class="text-sm text-brand-700 underline">К товарам</a>
    <form method="post" class="inline">
        <?= Security::csrfField() ?>
        <input type="hidden" name="action" value="telegram_test">
        <button type="submit" class="text-sm text-brand-700 underline">Проверить Telegram</button>
    </form>
    <?php if (Telegram::isConfigured()): ?>
        <form method="post" class="inline">
            <?= Security::csrfField() ?>
            <input type="hidden" name="action" value="telegram_webhook">
            <button type="submit" class="text-sm text-brand-700 underline">Включить кнопки</button>
        </form>
    <?php endif; ?>
</div>
<p class="mb-4 text-sm text-warm-500">Сообщения о покупках приходят в Telegram-чат из .env (TELEGRAM_CHAT_ID), не SMS на телефон покупателя.</p>
<?php if (!Telegram::isConfigured()): ?>
    <p class="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Telegram не настроен на сервере (<code class="text-xs">TELEGRAM_BOT_TOKEN</code> и <code class="text-xs">TELEGRAM_CHAT_ID</code> в <code class="text-xs">.env</code>).
        Заявки здесь сохраняются, но сообщения в Telegram не уходят — те же переменные, что для формы «Записаться».
    </p>
<?php elseif (($chatIssue = Telegram::chatIdIssue()) !== null): ?>
    <p class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><?= e($chatIssue) ?></p>
<?php elseif (!is_readable(APP_ROOT . '/storage/telegram-webhook.url')): ?>
    <p class="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Сообщения уже приходят, но кнопки «Оплачено» и «Отменить» под ними ещё не включены. Нажмите «Включить кнопки» выше.
    </p>
<?php endif; ?>
<?php if ($orders === []): ?>
    <p class="card-soft p-6 text-sm text-warm-500">Заявок пока нет.</p>
<?php endif; ?>
<div class="space-y-3">
    <?php foreach ($orders as $order): ?>
        <article class="card-soft p-4 text-sm <?= $order['status'] === 'pending' ? 'ring-2 ring-brand-300' : '' ?>">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p class="text-base font-semibold"><?= e((string) $order['name']) ?></p>
                    <p><a class="text-brand-700 underline" href="tel:<?= e((string) $order['phone']) ?>"><?= e((string) $order['phone']) ?></a></p>
                    <p class="mt-1"><?= e((string) $order['title_ru']) ?></p>
                </div>
                <p class="text-warm-500">
                    #<?= (int) $order['id'] ?> · <?= e(Admin::dt((string) $order['created_at'])) ?> · <?= e($labels[(string) $order['status']] ?? '') ?>
                    <?php if (!(int) ($order['telegram_sent'] ?? 0)): ?>
                        <span class="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800" title="В Telegram не ушло">без Telegram</span>
                    <?php endif; ?>
                </p>
            </div>
            <p class="mt-2 break-all text-warm-500"><?= e(site('url') . '/online/' . $order['slug'] . '/?order=' . $order['token']) ?></p>
            <?php if ($order['status'] === 'pending'): ?>
                <div class="mt-3 flex gap-3">
                    <form method="post">
                        <?= Security::csrfField() ?>
                        <input type="hidden" name="id" value="<?= (int) $order['id'] ?>">
                        <input type="hidden" name="action" value="paid">
                        <button type="submit" class="btn-primary !px-4 !py-2">Оплачено</button>
                    </form>
                    <form method="post">
                        <?= Security::csrfField() ?>
                        <input type="hidden" name="id" value="<?= (int) $order['id'] ?>">
                        <input type="hidden" name="action" value="cancel">
                        <button type="submit" class="text-sm text-red-600 underline">Отменить</button>
                    </form>
                    <?php if (!(int) ($order['telegram_sent'] ?? 0)): ?>
                        <form method="post">
                            <?= Security::csrfField() ?>
                            <input type="hidden" name="id" value="<?= (int) $order['id'] ?>">
                            <input type="hidden" name="action" value="telegram_resend">
                            <button type="submit" class="text-sm text-brand-700 underline">Отправить в Telegram</button>
                        </form>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </article>
    <?php endforeach; ?>
</div>
<?php require APP_ROOT . '/templates/admin/footer.php';
