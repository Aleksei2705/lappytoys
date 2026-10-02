<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

$adminUser = Admin::guard();
$kind = (string) ($_GET['kind'] ?? $_POST['list_kind'] ?? 'course');
if ($kind !== 'master_class') {
    $kind = 'course';
}
$adminTitle = $kind === 'course' ? 'Виды занятий' : 'Мастер-классы';
$adminSection = $kind === 'course' ? 'courses' : 'master';

try {
    if (Admin::isPost()) {
        Admin::verifyPost();
        $id = Admin::intParam($_POST, 'id');
        $action = Admin::text($_POST, 'action');

        if ($id > 0 && $action === 'toggle') {
            Database::execute('UPDATE classes SET is_published = 1 - is_published WHERE id = ?', [$id]);
            Admin::flash('success', 'Видимость на сайте изменена.');
        } elseif ($id > 0 && $action === 'delete') {
            Admin::guard('admin');
            $class = Database::fetchOne('SELECT image_path FROM classes WHERE id = ?', [$id]);
            Database::execute('DELETE FROM classes WHERE id = ?', [$id]);
            Admin::deleteUploadedImage($class['image_path'] ?? null);
            Admin::flash('success', 'Запись удалена.');
        }
        Admin::redirect('/admin/classes.php?kind=' . $kind);
    }

    $classes = Database::fetchAll(
        'SELECT c.id, c.slug, c.kind, c.title_ru, c.price_label, c.sort_order, c.is_published, c.image_path, c.emoji, cat.title_ru AS category
         FROM classes c LEFT JOIN categories cat ON cat.id = c.category_id
         WHERE c.kind = ?
         ORDER BY c.sort_order, c.id',
        [$kind],
    );
} catch (RuntimeException) {
    Admin::flash('error', 'Ошибка базы данных. Подробности в логе сервера.');
    $classes = [];
}

require APP_ROOT . '/templates/admin/header.php';
?>
<div class="mb-5">
    <a href="/admin/class-edit.php?kind=<?= e($kind) ?>" class="btn-primary !px-4 !py-2"><?= $kind === 'course' ? '+ Занятие' : '+ Мастер-класс' ?></a>
</div>

<div class="space-y-2">
        <?php foreach ($classes as $class): ?>
            <div class="card-soft flex flex-wrap items-center gap-x-4 gap-y-2 p-3 text-sm <?= (int) $class['is_published'] ? '' : 'opacity-60' ?>">
                <?php if (!empty($class['image_path'])): ?>
                    <img src="<?= e((string) $class['image_path']) ?>" alt="" class="size-14 shrink-0 rounded-xl object-cover">
                <?php else: ?>
                    <span class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-2xl"><?= e((string) ($class['emoji'] ?: '✦')) ?></span>
                <?php endif; ?>
                <div class="min-w-0 flex-1">
                    <p class="font-semibold"><?= e((string) $class['title_ru']) ?></p>
                    <p class="text-warm-500">
                        <?= e((string) ($class['category'] ?? 'без категории')) ?> · <?= priceText((string) $class['price_label']) ?>
                        <?php if (!(int) $class['is_published']): ?> · скрыт<?php endif; ?>
                    </p>
                </div>
                <form method="post">
                    <?= Security::csrfField() ?>
                    <input type="hidden" name="list_kind" value="<?= e($kind) ?>">
                    <input type="hidden" name="id" value="<?= (int) $class['id'] ?>">
                    <button type="submit" name="action" value="toggle" class="btn-ghost !px-3 !py-1.5">
                        <?= (int) $class['is_published'] ? 'Скрыть' : 'Опубликовать' ?>
                    </button>
                </form>
                <a href="/admin/class-edit.php?id=<?= (int) $class['id'] ?>" class="btn-secondary !px-3 !py-1.5">Изменить</a>
                <?php if ($adminUser['role'] === 'admin'): ?>
                    <form method="post" data-confirm="Удалить «<?= e((string) $class['title_ru']) ?>» безвозвратно?">
                        <?= Security::csrfField() ?>
                        <input type="hidden" name="list_kind" value="<?= e($kind) ?>">
                        <input type="hidden" name="id" value="<?= (int) $class['id'] ?>">
                        <button type="submit" name="action" value="delete" class="text-red-600 underline">Удалить</button>
                    </form>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
</div>
<?php require APP_ROOT . '/templates/admin/footer.php';
