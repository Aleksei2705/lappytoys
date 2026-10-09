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
        $action = Admin::text($_POST, 'action');
        $ids = array_values(array_unique(array_filter(
            array_map(static fn ($value): int => (int) $value, (array) ($_POST['ids'] ?? [])),
            static fn (int $id): bool => $id > 0,
        )));
        if ($action === 'delete' && $ids !== []) {
            $placeholders = implode(', ', array_fill(0, count($ids), '?'));
            Database::execute('DELETE FROM assistant_chats WHERE id IN (' . $placeholders . ')', $ids);
            Admin::flash('success', 'Удалено разговоров: ' . count($ids) . '.');
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
<?php if ($chats !== [] && $adminUser['role'] === 'admin'): ?>
<form method="post" action="/admin/chats.php" data-chat-bulk>
    <?= Security::csrfField() ?>
    <input type="hidden" name="action" value="delete">
    <div class="mb-4 flex flex-wrap items-center gap-4 text-sm">
        <label class="inline-flex items-center gap-2">
            <input type="checkbox" data-chat-all>
            Выбрать все
        </label>
        <button type="submit" class="text-sm text-red-600 underline" data-chat-delete disabled>Удалить выбранные</button>
    </div>
<?php endif; ?>
<div class="space-y-3">
    <?php foreach ($chats as $chat): ?>
        <?php $lines = $chatLines((string) $chat['transcript']); ?>
        <article class="card-soft p-4 text-sm">
            <div class="flex items-center gap-3">
                <?php if ($adminUser['role'] === 'admin'): ?>
                    <input type="checkbox" name="ids[]" value="<?= (int) $chat['id'] ?>" data-chat-pick aria-label="Выбрать разговор #<?= (int) $chat['id'] ?>">
                <?php endif; ?>
                <p class="text-warm-500">#<?= (int) $chat['id'] ?> · <?= e(Admin::dt((string) $chat['updated_at'])) ?></p>
            </div>
            <?php
            $guestColor = $guestColors[abs(crc32((string) $chat['public_id'])) % count($guestColors)];
            $renderLine = static function (array $line) use ($guestColor): void {
                ?>
                <div class="chat-line">
                    <?php if ($line['role'] === 'mila'): ?>
                        <img class="chat-avatar" src="/images/assistant-avatar.jpg?v=2" alt="" width="36" height="36">
                        <p class="chat-mila"><?= e($line['text']) ?></p>
                    <?php else: ?>
                        <span class="chat-avatar chat-guest-avatar" style="background: <?= e($guestColor) ?>" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><circle cx="12" cy="9" r="3.2"/><path d="M6.5 18.5a5.5 5.5 0 0 1 11 0"/></svg>
                        </span>
                        <p class="chat-guest"><?= e($line['text']) ?></p>
                    <?php endif; ?>
                </div>
                <?php
            };
            foreach (array_slice($lines, 0, 4) as $line) {
                $renderLine($line);
            }
            $rest = array_slice($lines, 4);
            if ($rest !== []):
            ?>
                <details class="chat-fold">
                    <summary>Показать весь разговор (<?= count($lines) ?>)</summary>
                    <?php foreach ($rest as $line) {
                        $renderLine($line);
                    } ?>
                </details>
            <?php endif; ?>
        </article>
    <?php endforeach; ?>
</div>
<?php if ($chats !== [] && $adminUser['role'] === 'admin'): ?>
</form>
<?php endif; ?>
<?php require APP_ROOT . '/templates/admin/footer.php';
