<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

const BOOKING_STATUSES = ['new' => 'Новая', 'contacted' => 'Связались', 'done' => 'Выполнена', 'cancelled' => 'Отменена'];

$adminUser = Admin::guard();
$adminTitle = 'Заявки';
$adminSection = 'bookings';

$filter = Admin::text($_GET, 'status');
if (!isset(BOOKING_STATUSES[$filter])) {
    $filter = '';
}
$listUrl = '/admin/bookings.php' . ($filter !== '' ? '?status=' . $filter : '');

try {
    if (Admin::isPost()) {
        Admin::verifyPost();
        $id = Admin::intParam($_POST, 'id');
        $action = Admin::text($_POST, 'action');

        if ($action === 'status') {
            $status = Admin::text($_POST, 'status');
            if ($id > 0 && isset(BOOKING_STATUSES[$status])) {
                Database::execute('UPDATE bookings SET status = ? WHERE id = ?', [$status, $id]);
                Admin::flash('success', 'Статус заявки обновлён.');
            }
        } elseif ($action === 'delete') {
            Admin::guard('admin');
            if ($id > 0) {
                Database::execute('DELETE FROM bookings WHERE id = ?', [$id]);
                Admin::flash('success', 'Заявка удалена.');
            }
        }
        Admin::redirect($listUrl);
    }

    $where = $filter !== '' ? 'WHERE status = ?' : '';
    $bookings = Database::fetchAll(
        "SELECT * FROM bookings {$where} ORDER BY id DESC LIMIT 200",
        $filter !== '' ? [$filter] : [],
    );
} catch (RuntimeException) {
    Admin::flash('error', 'Ошибка базы данных. Подробности в логе сервера.');
    $bookings = [];
}

require APP_ROOT . '/templates/admin/header.php';
?>
<div class="mb-5 flex flex-wrap gap-2 text-sm">
    <a href="/admin/bookings.php" class="<?= $filter === '' ? 'btn-primary' : 'btn-ghost' ?> !px-3 !py-1.5">Все</a>
    <?php foreach (BOOKING_STATUSES as $key => $label): ?>
        <a href="/admin/bookings.php?status=<?= e($key) ?>" class="<?= $filter === $key ? 'btn-primary' : 'btn-ghost' ?> !px-3 !py-1.5"><?= e($label) ?></a>
    <?php endforeach; ?>
</div>

<?php if ($bookings === []): ?>
    <p class="card-soft p-6 text-sm text-warm-500">Заявок нет.</p>
<?php endif; ?>

<div class="space-y-3">
    <?php foreach ($bookings as $booking): ?>
        <article class="card-soft p-4 text-sm <?= $booking['status'] === 'new' ? 'ring-2 ring-brand-300' : '' ?>">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p class="text-base font-semibold"><?= e((string) $booking['name']) ?></p>
                    <p><a class="text-brand-700 underline" href="tel:<?= e((string) $booking['phone']) ?>"><?= e((string) $booking['phone']) ?></a></p>
                </div>
                <p class="text-warm-500">
                    #<?= (int) $booking['id'] ?> · <?= e(Admin::dt((string) $booking['created_at'])) ?>
                    <?php if (!(int) $booking['telegram_sent']): ?>
                        <span class="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800" title="Уведомление в Telegram не отправлено">без Telegram</span>
                    <?php endif; ?>
                </p>
            </div>
            <p class="mt-2"><span class="text-warm-500">Направление:</span> <?= e((string) $booking['direction']) ?></p>
            <?php if (!empty($booking['preferred_date'])): ?>
                <p><span class="text-warm-500">Желаемая дата:</span> <?= e(date('d.m.Y', (int) strtotime((string) $booking['preferred_date']))) ?></p>
            <?php endif; ?>
            <?php if (!empty($booking['message'])): ?>
                <p class="mt-1 whitespace-pre-line"><?= e((string) $booking['message']) ?></p>
            <?php endif; ?>
            <div class="mt-3 flex flex-wrap items-center gap-3">
                <form method="post" action="<?= e($listUrl) ?>">
                    <?= Security::csrfField() ?>
                    <input type="hidden" name="action" value="status">
                    <input type="hidden" name="id" value="<?= (int) $booking['id'] ?>">
                    <select name="status" class="input-field !h-9 !w-auto" data-autosubmit aria-label="Статус">
                        <?php foreach (BOOKING_STATUSES as $key => $label): ?>
                            <option value="<?= e($key) ?>" <?= $booking['status'] === $key ? 'selected' : '' ?>><?= e($label) ?></option>
                        <?php endforeach; ?>
                    </select>
                </form>
                <?php if ($adminUser['role'] === 'admin'): ?>
                    <form method="post" action="<?= e($listUrl) ?>" data-confirm="Удалить заявку безвозвратно?">
                        <?= Security::csrfField() ?>
                        <input type="hidden" name="action" value="delete">
                        <input type="hidden" name="id" value="<?= (int) $booking['id'] ?>">
                        <button type="submit" class="text-sm text-red-600 underline">Удалить</button>
                    </form>
                <?php endif; ?>
            </div>
        </article>
    <?php endforeach; ?>
</div>
<?php require APP_ROOT . '/templates/admin/footer.php';
