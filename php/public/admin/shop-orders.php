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
        }
        Admin::redirect('/admin/shop-orders.php');
    }
    $orders = Shop::orders();
} catch (RuntimeException) {
    Admin::flash('error', 'Ошибка базы данных. Подробности в логе сервера.');
}

require APP_ROOT . '/templates/admin/header.php';
?>
<p class="mb-4"><a href="/admin/shop.php" class="text-sm text-brand-700 underline">К товарам</a></p>
<?php if (!Telegram::isConfigured()): ?>
    <p class="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Telegram не настроен на сервере (<code class="text-xs">TELEGRAM_BOT_TOKEN</code> и <code class="text-xs">TELEGRAM_CHAT_ID</code> в <code class="text-xs">.env</code>).
        Заявки здесь сохраняются, но сообщения в Telegram не уходят — те же переменные, что для формы «Записаться».
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
                <p class="text-warm-500">#<?= (int) $order['id'] ?> · <?= e(Admin::dt((string) $order['created_at'])) ?> · <?= e($labels[(string) $order['status']] ?? '') ?></p>
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
                </div>
            <?php endif; ?>
        </article>
    <?php endforeach; ?>
</div>
<?php require APP_ROOT . '/templates/admin/footer.php';
