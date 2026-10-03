<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

$adminUser = Admin::guard();
$adminSection = 'reviews';

$id = Admin::intParam($_GET, 'id');
$statuses = ['pending' => 'На модерации', 'approved' => 'Опубликован', 'rejected' => 'Отклонён'];
$errors = [];
$existing = null;
$form = [];
$classes = [];

try {
    $existing = $id > 0 ? Database::fetchOne('SELECT * FROM reviews WHERE id = ?', [$id]) : null;
    if ($id > 0 && $existing === null) {
        Admin::flash('error', 'Отзыв не найден.');
        Admin::redirect('/admin/reviews.php');
    }
    $classes = Database::fetchAll('SELECT id, title_ru FROM classes ORDER BY kind, sort_order, id');

    $form = $existing ?? [
        'name' => '', 'course' => '', 'course_kk' => '', 'text' => '', 'text_kk' => '', 'rating' => 5,
        'reply_text' => '', 'reply_text_kk' => '', 'show_date' => 1, 'status' => 'approved', 'class_id' => null,
    ];

    if (Admin::isPost()) {
        Admin::verifyPost();

        $form = [
            'name' => Admin::text($_POST, 'name'),
            'course' => Admin::text($_POST, 'course'),
            'course_kk' => Admin::text($_POST, 'course_kk'),
            'text' => Admin::text($_POST, 'text'),
            'text_kk' => Admin::text($_POST, 'text_kk'),
            'rating' => Admin::intParam($_POST, 'rating'),
            'reply_text' => Admin::text($_POST, 'reply_text'),
            'reply_text_kk' => Admin::text($_POST, 'reply_text_kk'),
            'show_date' => isset($_POST['show_date']) ? 1 : 0,
            'status' => Admin::text($_POST, 'status'),
            'class_id' => Admin::intParam($_POST, 'class_id') ?: null,
        ];

        $limits = ['name' => [2, 60, 'Имя'], 'course' => [1, 80, 'Курс'], 'text' => [5, 600, 'Текст отзыва']];
        foreach ($limits as $field => [$min, $max, $label]) {
            $length = mb_strlen($form[$field]);
            if ($length < $min || $length > $max) {
                $errors[] = "{$label}: от {$min} до {$max} символов.";
            }
        }
        foreach (['course_kk' => 80, 'text_kk' => 600, 'reply_text' => 600, 'reply_text_kk' => 600] as $field => $max) {
            if (mb_strlen($form[$field]) > $max) {
                $errors[] = "Поле {$field}: максимум {$max} символов.";
            }
        }
        if ($form['rating'] < 1 || $form['rating'] > 5) {
            $errors[] = 'Оценка должна быть от 1 до 5.';
        }
        if (!isset($statuses[$form['status']])) {
            $errors[] = 'Некорректный статус.';
        }
        if ($form['class_id'] !== null && !in_array($form['class_id'], array_map(static fn (array $c): int => (int) $c['id'], $classes), true)) {
            $errors[] = 'Выбранный курс не найден.';
        }

        if ($errors === []) {
            $nullable = static fn (string $value): ?string => $value === '' ? null : $value;
            $now = date('Y-m-d H:i:s');
            $replyChanged = $form['reply_text'] !== (string) ($existing['reply_text'] ?? '')
                || $form['reply_text_kk'] !== (string) ($existing['reply_text_kk'] ?? '');
            $hasReply = $form['reply_text'] !== '' || $form['reply_text_kk'] !== '';
            $replyAt = $hasReply ? ($replyChanged || empty($existing['reply_at']) ? $now : $existing['reply_at']) : null;

            $values = [
                $form['class_id'], $form['name'], $form['course'], $nullable($form['course_kk']),
                $form['text'], $nullable($form['text_kk']), $form['rating'],
                $nullable($form['reply_text']), $nullable($form['reply_text_kk']), $replyAt,
                $form['show_date'], $form['status'],
            ];

            if ($existing === null) {
                Database::execute(
                    'INSERT INTO reviews (class_id, name, course, course_kk, text, text_kk, rating, reply_text, reply_text_kk, reply_at, show_date, status, moderated_at, created_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [...$values, $now, $now],
                );
            } else {
                Database::execute(
                    'UPDATE reviews SET class_id = ?, name = ?, course = ?, course_kk = ?, text = ?, text_kk = ?, rating = ?,
                        reply_text = ?, reply_text_kk = ?, reply_at = ?, show_date = ?, status = ?, moderated_at = ? WHERE id = ?',
                    [...$values, $form['status'] !== $existing['status'] ? $now : $existing['moderated_at'], $id],
                );
            }
            Admin::flash('success', 'Отзыв сохранён.');
            Admin::redirect('/admin/reviews.php');
        }
    }
} catch (RuntimeException) {
    $errors[] = 'Ошибка базы данных. Подробности в логе сервера.';
}

$adminTitle = $existing === null ? 'Новый отзыв' : 'Отзыв #' . $id;
require APP_ROOT . '/templates/admin/header.php';
?>
<?php if ($errors !== []): ?>
    <ul class="mb-6 list-disc rounded-xl border border-red-200 bg-red-50 py-3 pl-8 pr-4 text-sm text-red-700">
        <?php foreach ($errors as $error): ?><li><?= e($error) ?></li><?php endforeach; ?>
    </ul>
<?php endif; ?>

<form method="post" class="card-soft max-w-3xl space-y-5 p-6">
    <?= Security::csrfField() ?>
    <div class="grid gap-5 sm:grid-cols-2">
        <div>
            <label for="name" class="mb-2 block text-sm font-medium">Имя автора</label>
            <input id="name" name="name" required maxlength="60" value="<?= e((string) ($form['name'] ?? '')) ?>" class="input-field">
        </div>
        <div>
            <label for="rating" class="mb-2 block text-sm font-medium">Оценка</label>
            <select id="rating" name="rating" class="input-field">
                <?php for ($i = 5; $i >= 1; $i--): ?>
                    <option value="<?= $i ?>" <?= (int) ($form['rating'] ?? 5) === $i ? 'selected' : '' ?>><?= $i ?></option>
                <?php endfor; ?>
            </select>
        </div>
        <div>
            <label for="course" class="mb-2 block text-sm font-medium">Курс (рус.)</label>
            <input id="course" name="course" required maxlength="80" value="<?= e((string) ($form['course'] ?? '')) ?>" class="input-field">
        </div>
        <div>
            <label for="course_kk" class="mb-2 block text-sm font-medium">Курс (қаз.)</label>
            <input id="course_kk" name="course_kk" maxlength="80" value="<?= e((string) ($form['course_kk'] ?? '')) ?>" class="input-field">
        </div>
        <div>
            <label for="class_id" class="mb-2 block text-sm font-medium">Связанный курс / МК</label>
            <select id="class_id" name="class_id" class="input-field">
                <option value="">— не выбран —</option>
                <?php foreach ($classes as $class): ?>
                    <option value="<?= (int) $class['id'] ?>" <?= (int) ($form['class_id'] ?? 0) === (int) $class['id'] ? 'selected' : '' ?>><?= e((string) $class['title_ru']) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div>
            <label for="status" class="mb-2 block text-sm font-medium">Статус</label>
            <select id="status" name="status" class="input-field">
                <?php foreach ($statuses as $key => $label): ?>
                    <option value="<?= e($key) ?>" <?= ($form['status'] ?? '') === $key ? 'selected' : '' ?>><?= e($label) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
    </div>
    <div>
        <label for="text" class="mb-2 block text-sm font-medium">Текст (рус.)</label>
        <textarea id="text" name="text" required maxlength="600" rows="4" class="textarea-field"><?= e((string) ($form['text'] ?? '')) ?></textarea>
    </div>
    <div>
        <label for="text_kk" class="mb-2 block text-sm font-medium">Текст (қаз.)</label>
        <textarea id="text_kk" name="text_kk" maxlength="600" rows="4" class="textarea-field"><?= e((string) ($form['text_kk'] ?? '')) ?></textarea>
    </div>
    <div>
        <label for="reply_text" class="mb-2 block text-sm font-medium">Ответ студии (рус.)</label>
        <textarea id="reply_text" name="reply_text" maxlength="600" rows="3" class="textarea-field"><?= e((string) ($form['reply_text'] ?? '')) ?></textarea>
    </div>
    <div>
        <label for="reply_text_kk" class="mb-2 block text-sm font-medium">Ответ студии (қаз.)</label>
        <textarea id="reply_text_kk" name="reply_text_kk" maxlength="600" rows="3" class="textarea-field"><?= e((string) ($form['reply_text_kk'] ?? '')) ?></textarea>
    </div>
    <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" name="show_date" value="1" <?= !empty($form['show_date']) ? 'checked' : '' ?>> Показывать дату на сайте
    </label>
    <div class="flex gap-3">
        <button type="submit" class="btn-primary h-11 px-8">Сохранить</button>
        <a href="/admin/reviews.php" class="btn-secondary h-11 px-6">Отмена</a>
    </div>
</form>
<?php require APP_ROOT . '/templates/admin/footer.php';
