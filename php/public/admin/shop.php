<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

$adminUser = Admin::guard();
$adminTitle = 'Онлайн';
$adminSection = 'shop';
$products = [];

try {
    if (Admin::isPost()) {
        Admin::verifyPost();
        $id = Admin::intParam($_POST, 'id');
        if (Admin::text($_POST, 'action') === 'delete' && $id > 0) {
            Shop::delete($id);
            Admin::flash('success', 'Товар удалён.');
            Admin::redirect('/admin/shop.php');
        }
    }
    $products = Shop::all();
} catch (RuntimeException) {
    Admin::flash('error', 'Ошибка базы данных. Подробности в логе сервера.');
}

require APP_ROOT . '/templates/admin/header.php';
?>
<div class="mb-5 flex flex-wrap gap-3">
    <a href="/admin/shop-edit.php" class="btn-primary h-11 px-5">+ Товар</a>
    <a href="/admin/shop-orders.php" class="btn-secondary h-11 px-5">Оплаты</a>
</div>
<?php if ($products === []): ?>
    <p class="card-soft p-6 text-sm text-warm-500">Пока нет мастер-классов и видеоуроков. Добавленные и опубликованные появятся на сайте в блоке «Онлайн».</p>
<?php endif; ?>
<div class="space-y-3">
    <?php foreach ($products as $product): ?>
        <article class="card-soft flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
                <p class="font-semibold"><?= e((string) $product['title_ru']) ?></p>
                <p class="text-sm text-warm-500">
                    <?= e(Shop::KINDS[(string) $product['kind']] ?? '') ?>
                    · <?= e(Shop::price((int) $product['price_kzt'])) ?>
                    · <?= (int) $product['is_published'] === 1 ? 'на сайте' : 'скрыт' ?>
                    <?php if (!empty($product['channel_id'])): ?> · канал<?php endif; ?>
                    <?= empty($product['file_path']) && empty($product['channel_id']) ? '· нет доступа' : '' ?>
                </p>
            </div>
            <div class="flex gap-3">
                <a class="btn-ghost !px-3 !py-1.5" href="/admin/shop-edit.php?id=<?= (int) $product['id'] ?>">Изменить</a>
                <form method="post">
                    <?= Security::csrfField() ?>
                    <input type="hidden" name="id" value="<?= (int) $product['id'] ?>">
                    <input type="hidden" name="action" value="delete">
                    <button type="submit" class="text-sm text-red-600 underline">Удалить</button>
                </form>
            </div>
        </article>
    <?php endforeach; ?>
</div>
<?php require APP_ROOT . '/templates/admin/footer.php';
