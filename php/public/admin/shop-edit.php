<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

$adminUser = Admin::guard();
$adminTitle = 'Онлайн-товар';
$adminSection = 'shop';
$errors = [];
$id = Admin::intParam($_GET, 'id');
$form = [
    'id' => $id,
    'slug' => '',
    'kind' => 'lesson',
    'title_ru' => '',
    'title_kk' => '',
    'description_ru' => '',
    'description_kk' => '',
    'price_kzt' => '',
    'preview_path' => '',
    'file_path' => '',
    'file_name' => '',
    'channel_id' => '',
    'sort_order' => '0',
    'is_published' => 0,
];

try {
    Shop::ensureTables();
    if ($id > 0 && !Admin::isPost()) {
        $existing = Shop::find($id);
        if ($existing === null) {
            Admin::redirect('/admin/shop.php');
        }
        $form = array_merge($form, $existing);
    }

    if (Admin::isPost()) {
        Admin::verifyPost();
        $id = Admin::intParam($_POST, 'id');
        $form['id'] = $id;
        $existing = $id > 0 ? Shop::find($id) : null;
        foreach (['slug', 'kind', 'title_ru', 'title_kk', 'description_ru', 'description_kk', 'price_kzt', 'sort_order', 'channel_id'] as $field) {
            $form[$field] = Admin::text($_POST, $field);
        }
        $form['is_published'] = isset($_POST['is_published']) ? 1 : 0;
        $form['preview_path'] = (string) ($existing['preview_path'] ?? '');
        $form['file_path'] = (string) ($existing['file_path'] ?? '');
        $form['file_name'] = (string) ($existing['file_name'] ?? '');

        if (preg_match('/^[a-z0-9-]{1,80}$/', $form['slug']) !== 1) {
            $errors[] = 'Адрес: латиница, цифры и дефис, до 80 знаков.';
        }
        if (!isset(Shop::KINDS[$form['kind']])) {
            $errors[] = 'Выберите тип.';
        }
        if ($form['title_ru'] === '' || $form['description_ru'] === '') {
            $errors[] = 'Нужны название и описание на русском.';
        }
        $price = ctype_digit($form['price_kzt']) ? (int) $form['price_kzt'] : 0;
        if ($price < 1 || $price > 2000000) {
            $errors[] = 'Цена в тенге: от 1 до 2 000 000.';
        }
        if ($errors === [] && Shop::slugTaken($form['slug'], $id)) {
            $errors[] = 'Такой адрес страницы уже занят.';
        }

        $dropPreview = '';
        $dropFile = '';
        $preview = $_FILES['preview'] ?? null;
        if (is_array($preview) && (int) ($preview['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
            $form['preview_path'] = Shop::storePreview($preview);
            $dropPreview = (string) ($existing['preview_path'] ?? '');
        }
        $paid = $_FILES['file'] ?? null;
        if (is_array($paid) && (int) ($paid['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
            $stored = Shop::storeFile($paid);
            $dropFile = (string) ($existing['file_path'] ?? '');
            $form['file_path'] = $stored['path'];
            $form['file_name'] = $stored['name'];
        }
        $form['channel_id'] = trim($form['channel_id']);
        if ($form['channel_id'] !== '' && preg_match('/^-\d{5,20}$/', $form['channel_id']) !== 1) {
            $errors[] = 'ID канала — число вида -100…. Его присылает @lappyart_orders_bot, когда его добавляют в канал.';
        }
        if ($form['is_published'] === 1 && $form['file_path'] === '' && $form['channel_id'] === '') {
            $errors[] = 'Чтобы показать товар, загрузите файл или укажите закрытый канал.';
        }

        if ($errors === []) {
            Shop::save([
                'id' => $id,
                'slug' => $form['slug'],
                'kind' => $form['kind'],
                'title_ru' => mb_substr($form['title_ru'], 0, 160),
                'title_kk' => mb_substr($form['title_kk'], 0, 160),
                'description_ru' => mb_substr($form['description_ru'], 0, 800),
                'description_kk' => mb_substr($form['description_kk'], 0, 800),
                'price_kzt' => $price,
                'preview_path' => $form['preview_path'] !== '' ? $form['preview_path'] : null,
                'file_path' => $form['file_path'] !== '' ? $form['file_path'] : null,
                'file_name' => $form['file_name'] !== '' ? $form['file_name'] : null,
                'channel_id' => $form['channel_id'] !== '' ? $form['channel_id'] : null,
                'sort_order' => (int) $form['sort_order'],
                'is_published' => $form['is_published'],
            ]);
            if ($dropPreview !== '' && $dropPreview !== (string) $form['preview_path']) {
                Shop::deletePreview($dropPreview);
            }
            if ($dropFile !== '' && $dropFile !== (string) $form['file_path']) {
                Shop::deleteFile($dropFile);
            }
            Admin::flash('success', 'Товар сохранён.');
            Admin::redirect('/admin/shop.php');
        }
    }
} catch (InvalidArgumentException $exception) {
    $errors[] = $exception->getMessage();
} catch (RuntimeException) {
    $errors[] = 'Ошибка базы данных. Подробности в логе сервера.';
}

require APP_ROOT . '/templates/admin/header.php';
?>
<?php if ($errors !== []): ?>
    <ul class="mb-6 list-disc rounded-xl border border-red-200 bg-red-50 py-3 pl-8 pr-4 text-sm text-red-700">
        <?php foreach ($errors as $error): ?><li><?= e($error) ?></li><?php endforeach; ?>
    </ul>
<?php endif; ?>
<form method="post" enctype="multipart/form-data" class="card-soft grid gap-4 p-4 sm:grid-cols-2">
    <?= Security::csrfField() ?>
    <input type="hidden" name="id" value="<?= (int) ($form['id'] ?? 0) ?>">
    <div>
        <label class="mb-2 block text-sm font-medium" for="kind">Тип</label>
        <select id="kind" name="kind" class="input-field">
            <?php foreach (Shop::KINDS as $key => $label): ?>
                <option value="<?= e($key) ?>" <?= ($form['kind'] ?? '') === $key ? 'selected' : '' ?>><?= e($label) ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div>
        <label class="mb-2 block text-sm font-medium" for="slug">Адрес страницы</label>
        <input id="slug" name="slug" required maxlength="80" value="<?= e((string) $form['slug']) ?>" placeholder="owl-macrame" class="input-field">
    </div>
    <div>
        <label class="mb-2 block text-sm font-medium" for="title_ru">Название</label>
        <input id="title_ru" name="title_ru" required maxlength="160" value="<?= e((string) $form['title_ru']) ?>" class="input-field">
    </div>
    <div>
        <label class="mb-2 block text-sm font-medium" for="title_kk">Атауы</label>
        <input id="title_kk" name="title_kk" maxlength="160" value="<?= e((string) $form['title_kk']) ?>" class="input-field">
    </div>
    <div class="sm:col-span-2">
        <label class="mb-2 block text-sm font-medium" for="description_ru">Описание</label>
        <textarea id="description_ru" name="description_ru" required maxlength="800" rows="4" class="textarea-field"><?= e((string) $form['description_ru']) ?></textarea>
    </div>
    <div class="sm:col-span-2">
        <label class="mb-2 block text-sm font-medium" for="description_kk">Сипаттама</label>
        <textarea id="description_kk" name="description_kk" maxlength="800" rows="4" class="textarea-field"><?= e((string) $form['description_kk']) ?></textarea>
    </div>
    <div>
        <label class="mb-2 block text-sm font-medium" for="price_kzt">Цена, тенге</label>
        <input id="price_kzt" name="price_kzt" required inputmode="numeric" value="<?= e((string) $form['price_kzt']) ?>" placeholder="2000" class="input-field">
    </div>
    <div>
        <label class="mb-2 block text-sm font-medium" for="sort_order">Порядок</label>
        <input id="sort_order" name="sort_order" value="<?= e((string) $form['sort_order']) ?>" class="input-field">
    </div>
    <div>
        <label class="mb-2 block text-sm font-medium" for="preview">Превью, MP4 или WebM</label>
        <input id="preview" name="preview" type="file" accept="video/mp4,video/webm" class="block text-sm">
        <?php if (!empty($form['preview_path'])): ?><p class="mt-2 text-xs text-warm-500">Видео уже загружено.</p><?php endif; ?>
    </div>
    <div>
        <label class="mb-2 block text-sm font-medium" for="file">Файл после оплаты: MP4, WebM, PDF или ZIP</label>
        <input id="file" name="file" type="file" accept="video/mp4,video/webm,application/pdf,application/zip" class="block text-sm">
        <?php if (!empty($form['file_name'])): ?><p class="mt-2 text-xs text-warm-500">Сейчас: <?= e((string) $form['file_name']) ?></p><?php endif; ?>
    </div>
    <div class="sm:col-span-2">
        <label class="mb-2 block text-sm font-medium" for="channel_id">Закрытый канал Telegram</label>
        <input id="channel_id" name="channel_id" maxlength="22" value="<?= e((string) ($form['channel_id'] ?? '')) ?>" placeholder="-1001234567890" class="input-field">
        <p class="mt-2 text-xs leading-relaxed text-warm-500">После кнопки «Оплачено» бот создаст одноразовую ссылку в этот канал и отправит её покупателю. Добавьте @lappyart_orders_bot администратором с правом приглашать и публиковать сообщения, затем напишите в канале /id. Число ID придёт в этот канал и в чат с ботом, оно начинается с -100.</p>
    </div>
    <label class="flex items-center gap-2 text-sm sm:col-span-2">
        <input type="checkbox" name="is_published" value="1" <?= (int) ($form['is_published'] ?? 0) === 1 ? 'checked' : '' ?>>
        Показать на сайте
    </label>
    <div class="flex gap-3 sm:col-span-2">
        <button type="submit" class="btn-primary h-11 px-8">Сохранить</button>
        <a href="/admin/shop.php" class="btn-secondary h-11 px-6">К списку</a>
    </div>
</form>
<?php require APP_ROOT . '/templates/admin/footer.php';
