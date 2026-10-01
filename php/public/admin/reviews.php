<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

const REVIEW_STATUSES = ['pending' => 'На модерации', 'approved' => 'Опубликован', 'rejected' => 'Отклонён'];

$adminUser = Admin::guard();
$adminTitle = 'Отзывы';
$adminSection = 'reviews';

$filter = Admin::text($_GET, 'status');
if (!isset(REVIEW_STATUSES[$filter])) {
    $filter = '';
}
$listUrl = '/admin/reviews.php' . ($filter !== '' ? '?status=' . $filter : '');

try {
    if (Admin::isPost()) {
        Admin::verifyPost();
        $id = Admin::intParam($_POST, 'id');
        $action = Admin::text($_POST, 'action');

        if ($id > 0 && ($action === 'approved' || $action === 'rejected')) {
            Database::execute('UPDATE reviews SET status = ?, moderated_at = ? WHERE id = ?', [$action, date('Y-m-d H:i:s'), $id]);
            Admin::flash('success', $action === 'approved' ? 'Отзыв опубликован.' : 'Отзыв отклонён.');
        } elseif ($id > 0 && $action === 'delete') {
            Admin::guard('admin');
            Database::execute('DELETE FROM reviews WHERE id = ?', [$id]);
            Admin::flash('success', 'Отзыв удалён.');
        }
        Admin::redirect($listUrl);
    }

    $where = $filter !== '' ? 'WHERE status = ?' : '';
    $reviews = Database::fetchAll(
        "SELECT * FROM reviews {$where} ORDER BY (status = 'pending') DESC, id DESC LIMIT 200",
        $filter !== '' ? [$filter] : [],
    );
} catch (RuntimeException) {
    Admin::flash('error', 'Ошибка базы данных. Подробности в логе сервера.');
    $reviews = [];
}

$statusClasses = [
    'pending' => 'bg-amber-100 text-amber-800',
    'approved' => 'bg-green-100 text-green-800',
    'rejected' => 'bg-red-100 text-red-700',
];

require APP_ROOT . '/templates/admin/header.php';
?>
<div class="mb-5 flex flex-wrap items-center gap-2 text-sm">
    <a href="/admin/reviews.php" class="<?= $filter === '' ? 'btn-primary' : 'btn-ghost' ?> !px-3 !py-1.5">Все</a>
    <?php foreach (REVIEW_STATUSES as $key => $label): ?>
        <a href="/admin/reviews.php?status=<?= e($key) ?>" class="<?= $filter === $key ? 'btn-primary' : 'btn-ghost' ?> !px-3 !py-1.5"><?= e($label) ?></a>
    <?php endforeach; ?>
    <a href="/admin/review-edit.php" class="btn-secondary ml-auto !px-3 !py-1.5">+ Добавить отзыв</a>
</div>

<?php if ($reviews === []): ?>
    <p class="card-soft p-6 text-sm text-warm-500">Отзывов нет.</p>
<?php endif; ?>

<div class="space-y-3">
    <?php foreach ($reviews as $review): ?>
        <article class="card-soft p-4 text-sm">
            <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="text-base font-semibold">
                    <?= e((string) $review['name']) ?>
                    <span class="font-normal text-warm-500">· <?= e((string) $review['course']) ?> · <?= (int) $review['rating'] ?>/5</span>
                </p>
                <p class="text-warm-500">
                    <?= e(Admin::dt((string) $review['created_at'])) ?>
                    <span class="ml-1 rounded px-1.5 py-0.5 text-xs <?= $statusClasses[$review['status']] ?? '' ?>"><?= e(REVIEW_STATUSES[$review['status']] ?? (string) $review['status']) ?></span>
                </p>
            </div>
            <p class="mt-2 whitespace-pre-line"><?= e((string) $review['text']) ?></p>
            <?php if (!empty($review['reply_text'])): ?>
                <p class="mt-2 rounded-lg bg-brand-50 p-2 text-warm-700"><span class="font-medium">Ответ:</span> <?= e((string) $review['reply_text']) ?></p>
            <?php endif; ?>
            <div class="mt-3 flex flex-wrap items-center gap-3">
                <?php foreach (['approved' => ['Опубликовать', 'btn-primary'], 'rejected' => ['Отклонить', 'btn-secondary']] as $action => [$label, $class]): ?>
                    <?php if ($review['status'] !== $action): ?>
                        <form method="post" action="<?= e($listUrl) ?>">
                            <?= Security::csrfField() ?>
                            <input type="hidden" name="id" value="<?= (int) $review['id'] ?>">
                            <button type="submit" name="action" value="<?= e($action) ?>" class="<?= $class ?> !px-4 !py-1.5"><?= e($label) ?></button>
                        </form>
                    <?php endif; ?>
                <?php endforeach; ?>
                <a href="/admin/review-edit.php?id=<?= (int) $review['id'] ?>" class="text-brand-700 underline">Редактировать / ответить</a>
                <?php if ($adminUser['role'] === 'admin'): ?>
                    <form method="post" action="<?= e($listUrl) ?>" data-confirm="Удалить отзыв безвозвратно?" class="ml-auto">
                        <?= Security::csrfField() ?>
                        <input type="hidden" name="id" value="<?= (int) $review['id'] ?>">
                        <button type="submit" name="action" value="delete" class="text-red-600 underline">Удалить</button>
                    </form>
                <?php endif; ?>
            </div>
        </article>
    <?php endforeach; ?>
</div>
<?php require APP_ROOT . '/templates/admin/footer.php';
