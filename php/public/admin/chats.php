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

$guestColors = ['#2563eb', '#0f766e', '#b45309', '#7c3aed', '#be123c', '#0369a1', '#4d7c0f', '#c2410c', '#6d28d9', '#0e7490'];

$chatLines = static function (string $transcript): array {
    $lines = [];
    foreach (preg_split("/\n\n(?=Мила: |Гость: )/u", $transcript) ?: [] as $part) {
        $part = trim($part);
        if (str_starts_with($part, 'Мила: ')) {
            $lines[] = ['role' => 'mila', 'text' => substr($part, strlen('Мила: '))];
        } elseif (str_starts_with($part, 'Гость: ')) {
            $lines[] = ['role' => 'guest', 'text' => substr($part, strlen('Гость: '))];
        } elseif ($part !== '') {
            $lines[] = ['role' => 'guest', 'text' => $part];
        }
    }
    return $lines;
};
?>
<?php if ($chats === []): ?>
    <p class="card-soft p-6 text-sm text-warm-500">Разговоров пока нет.</p>
<?php endif; ?>
<div class="space-y-3">
    <?php foreach ($chats as $chat): ?>
        <article class="card-soft p-4 text-sm">
            <p class="text-warm-500">#<?= (int) $chat['id'] ?> · <?= e(Admin::dt((string) $chat['updated_at'])) ?></p>
            <?php
            $guestColor = $guestColors[abs(crc32((string) $chat['public_id'])) % count($guestColors)];
            foreach ($chatLines((string) $chat['transcript']) as $line):
            ?>
                <div class="chat-line">
                    <?php if ($line['role'] === 'mila'): ?>
                        <img class="chat-avatar" src="/images/assistant-avatar.jpg" alt="" width="36" height="36">
                        <p class="chat-mila"><?= e($line['text']) ?></p>
                    <?php else: ?>
                        <span class="chat-avatar chat-guest-avatar" style="background: <?= e($guestColor) ?>" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><circle cx="12" cy="9" r="3.2"/><path d="M6.5 18.5a5.5 5.5 0 0 1 11 0"/></svg>
                        </span>
                        <p class="chat-guest"><?= e($line['text']) ?></p>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
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
