<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

$adminUser = Admin::guard();
$adminTitle = 'Разговоры';
$adminSection = 'chats';

try {
    Assistant::ensureTable();
    if (Admin::isPost()) {
        Admin::verifyPost();
        Admin::guard('admin');
        $id = Admin::intParam($_POST, 'id');
        if (Admin::text($_POST, 'action') === 'delete' && $id > 0) {
            Database::execute('DELETE FROM assistant_chats WHERE id = ?', [$id]);
            Admin::flash('success', 'Разговор удалён.');
        }
        Admin::redirect('/admin/chats.php');
    }
    $chats = Database::fetchAll('SELECT * FROM assistant_chats ORDER BY updated_at DESC LIMIT 100');
} catch (RuntimeException) {
    Admin::flash('error', 'Ошибка базы данных. Подробности в логе сервера.');
    $chats = [];
}

require APP_ROOT . '/templates/admin/header.php';
?>
<?php if ($chats === []): ?>
    <p class="card-soft p-6 text-sm text-warm-500">Разговоров пока нет.</p>
<?php endif; ?>
<div class="space-y-3">
    <?php foreach ($chats as $chat): ?>
        <article class="card-soft p-4 text-sm">
            <p class="text-warm-500">#<?= (int) $chat['id'] ?> · <?= e(Admin::dt((string) $chat['updated_at'])) ?></p>
            <p class="mt-2 whitespace-pre-line"><?= e((string) $chat['transcript']) ?></p>
            <?php if ($adminUser['role'] === 'admin'): ?>
                <form class="mt-3" method="post" action="/admin/chats.php" data-confirm="Удалить разговор безвозвратно?">
                    <?= Security::csrfField() ?>
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="id" value="<?= (int) $chat['id'] ?>">
                    <button type="submit" class="text-sm text-red-600 underline">Удалить</button>
                </form>
            <?php endif; ?>
        </article>
    <?php endforeach; ?>
</div>
<?php require APP_ROOT . '/templates/admin/footer.php';
