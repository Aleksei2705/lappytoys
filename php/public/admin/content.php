<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

$adminUser = Admin::guard();
$adminTitle = 'Тексты сайта';
$adminSection = 'content';
$errors = [];

function contentHttps(string $value): bool
{
    return preg_match('#^https://[^\s"\'<>]{8,500}$#', $value) === 1;
}

/** @return array<string, string> */
function contactFormValues(): array
{
    $stored = SiteContent::contactSettings();
    $keys = [
        'phone', 'phone_display', 'telegram', 'telegram_handle', 'telegram_group', 'whatsapp',
        'instagram', 'instagram_handle', 'tiktok', 'tiktok_handle',
        'map_2gis', 'map_google', 'map_link', 'map_embed_url',
    ];
    $values = [];
    foreach ($keys as $key) {
        $values[$key] = $stored[$key] ?? (string) site($key);
    }
    $values['address_ru'] = $stored['address_ru'] ?? I18n::translateIn('ru', 'contacts.address');
    $values['address_kk'] = $stored['address_kk'] ?? I18n::translateIn('kk', 'contacts.address');
    return $values;
}

try {
    SiteContent::ensureTable();
    if (Admin::isPost()) {
        Admin::verifyPost();
        $action = Admin::text($_POST, 'block');

        if ($action === 'faq') {
            $questionsRu = $_POST['q_ru'] ?? [];
            $questionsKk = $_POST['q_kk'] ?? [];
            $answersRu = $_POST['a_ru'] ?? [];
            $answersKk = $_POST['a_kk'] ?? [];
            $count = is_array($questionsRu) ? count($questionsRu) : 0;
            $rows = [];
            for ($i = 0; $i < $count && count($rows) < 20; $i++) {
                $question = is_array($questionsRu) ? Admin::text($questionsRu, (string) $i) : '';
                $answer = is_array($answersRu) ? Admin::text($answersRu, (string) $i) : '';
                if ($question === '' || $answer === '') {
                    continue;
                }
                $rows[] = [
                    'q_ru' => mb_substr($question, 0, 200),
                    'q_kk' => mb_substr(is_array($questionsKk) ? Admin::text($questionsKk, (string) $i) : '', 0, 200),
                    'a_ru' => mb_substr($answer, 0, 800),
                    'a_kk' => mb_substr(is_array($answersKk) ? Admin::text($answersKk, (string) $i) : '', 0, 800),
                ];
            }
            SiteContent::saveFaq($rows);
            Admin::flash('success', 'Вопросы сохранены.');
            Admin::redirect('/admin/content.php#faq');
        }

        if ($action === 'about') {
            $about = SiteContent::aboutData();
            $photo = (string) ($about['photo'] ?? '/images/room.jpg');
            if (preg_match('#^/(images/room\.jpg|uploads/about/[a-f0-9]{16}\.(jpg|png|webp))$#', $photo) !== 1) {
                $photo = '/images/room.jpg';
            }
            if (!empty($_POST['remove_photo'])) {
                Admin::deleteUploadedImage($photo);
                $photo = '/images/room.jpg';
            }
            $file = $_FILES['photo'] ?? null;
            if (is_array($file) && (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
                $photo = Admin::storeImage($file, 'about');
            }
            $ru = $_POST['paragraph_ru'] ?? [];
            $kk = $_POST['paragraph_kk'] ?? [];
            $count = is_array($ru) ? count($ru) : 0;
            $paragraphs = [];
            for ($i = 0; $i < $count && count($paragraphs) < 12; $i++) {
                $textRu = is_array($ru) ? Admin::text($ru, (string) $i) : '';
                $textKk = is_array($kk) ? Admin::text($kk, (string) $i) : '';
                if ($textRu === '' && $textKk === '') {
                    continue;
                }
                $paragraphs[] = ['ru' => mb_substr($textRu, 0, 2000), 'kk' => mb_substr($textKk, 0, 2000)];
            }
            SiteContent::saveAbout([
                'name' => mb_substr(Admin::text($_POST, 'name'), 0, 80),
                'role_ru' => mb_substr(Admin::text($_POST, 'role_ru'), 0, 120),
                'role_kk' => mb_substr(Admin::text($_POST, 'role_kk'), 0, 120),
                'photo' => $photo,
                'alt_ru' => mb_substr(Admin::text($_POST, 'alt_ru'), 0, 180),
                'alt_kk' => mb_substr(Admin::text($_POST, 'alt_kk'), 0, 180),
                'paragraphs' => $paragraphs,
            ]);
            Admin::flash('success', 'Блок «Обо мне» сохранён.');
            Admin::redirect('/admin/content.php#about');
        }

        if ($action === 'contacts') {
            $phone = Admin::text($_POST, 'phone');
            $embed = Admin::text($_POST, 'map_embed_url');
            if (preg_match('/^\+?[0-9]{10,15}$/', $phone) !== 1) {
                $errors[] = 'Телефон для ссылки: только + и цифры, от 10 до 15.';
            }
            if (!contentHttps($embed) || !preg_match('#^https://yandex\.(ru|kz)/map-widget/#', $embed)) {
                $errors[] = 'Ссылка карты должна начинаться с https://yandex.ru/map-widget/ или https://yandex.kz/map-widget/.';
            }
            $urls = ['telegram', 'telegram_group', 'whatsapp', 'instagram', 'tiktok', 'map_2gis', 'map_google', 'map_link'];
            $settings = [
                'phone' => $phone,
                'phone_display' => mb_substr(Admin::text($_POST, 'phone_display'), 0, 40),
                'telegram_handle' => mb_substr(Admin::text($_POST, 'telegram_handle'), 0, 40),
                'instagram_handle' => mb_substr(Admin::text($_POST, 'instagram_handle'), 0, 40),
                'tiktok_handle' => mb_substr(Admin::text($_POST, 'tiktok_handle'), 0, 40),
                'address_ru' => mb_substr(Admin::text($_POST, 'address_ru'), 0, 180),
                'address_kk' => mb_substr(Admin::text($_POST, 'address_kk'), 0, 180),
                'map_embed_url' => $embed,
            ];
            foreach ($urls as $key) {
                $value = Admin::text($_POST, $key);
                if (!contentHttps($value)) {
                    $errors[] = 'Ссылка должна начинаться с https://';
                    break;
                }
                $settings[$key] = $value;
            }
            if ($errors === []) {
                SiteContent::saveContacts($settings);
                Admin::flash('success', 'Контакты сохранены.');
                Admin::redirect('/admin/content.php#contacts');
            }
        }
    }

    $faq = SiteContent::faqRows();
    $about = SiteContent::aboutData();
    $contacts = contactFormValues();
    $paragraphs = is_array($about['paragraphs'] ?? null) ? $about['paragraphs'] : [];
} catch (InvalidArgumentException $exception) {
    $errors[] = $exception->getMessage();
    $faq = SiteContent::faqRows();
    $about = SiteContent::aboutData();
    $contacts = contactFormValues();
    $paragraphs = is_array($about['paragraphs'] ?? null) ? $about['paragraphs'] : [];
} catch (RuntimeException) {
    $errors[] = 'Ошибка базы данных. Подробности в логе сервера.';
    $faq = [];
    $about = [];
    $contacts = [];
    $paragraphs = [];
}

if ($errors !== [] && Admin::isPost() && Admin::text($_POST, 'block') === 'contacts') {
    foreach (array_keys($contacts) as $key) {
        $contacts[$key] = Admin::text($_POST, $key);
    }
}

require APP_ROOT . '/templates/admin/header.php';
?>
<?php if ($errors !== []): ?>
    <ul class="mb-6 list-disc rounded-xl border border-red-200 bg-red-50 py-3 pl-8 pr-4 text-sm text-red-700">
        <?php foreach ($errors as $error): ?><li><?= e($error) ?></li><?php endforeach; ?>
    </ul>
<?php endif; ?>

<section id="faq" class="mb-10">
    <h2 class="mb-3 font-heading text-xl font-bold">Вопросы и ответы</h2>
    <form method="post" class="space-y-3">
        <?= Security::csrfField() ?>
        <input type="hidden" name="block" value="faq">
        <div id="faq-rows" class="space-y-3">
            <?php foreach ($faq as $item): ?>
                <div class="card-soft grid gap-3 p-4" data-row>
                    <input name="q_ru[]" maxlength="200" value="<?= e((string) ($item['q_ru'] ?? '')) ?>" placeholder="Вопрос (рус.)" class="input-field">
                    <input name="q_kk[]" maxlength="200" value="<?= e((string) ($item['q_kk'] ?? '')) ?>" placeholder="Сұрақ (қаз.)" class="input-field">
                    <textarea name="a_ru[]" maxlength="800" rows="2" placeholder="Ответ (рус.)" class="textarea-field"><?= e((string) ($item['a_ru'] ?? '')) ?></textarea>
                    <textarea name="a_kk[]" maxlength="800" rows="2" placeholder="Жауап (қаз.)" class="textarea-field"><?= e((string) ($item['a_kk'] ?? '')) ?></textarea>
                    <div class="flex gap-2">
                        <button type="button" class="btn-ghost !px-2 !py-1.5" data-move="up" aria-label="Выше">↑</button>
                        <button type="button" class="btn-ghost !px-2 !py-1.5" data-move="down" aria-label="Ниже">↓</button>
                        <button type="button" class="text-sm text-red-600 underline" data-remove-row>Убрать</button>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        <div class="flex flex-wrap gap-3">
            <button type="button" class="btn-secondary !px-4 !py-2" data-add-row="#faq-rows" data-add-template="#faq-template">+ Вопрос</button>
            <button type="submit" class="btn-primary h-11 px-8">Сохранить вопросы</button>
        </div>
    </form>
</section>

<section id="about" class="mb-10">
    <h2 class="mb-3 font-heading text-xl font-bold">Обо мне</h2>
    <form method="post" enctype="multipart/form-data" class="card-soft space-y-4 p-4">
        <?= Security::csrfField() ?>
        <input type="hidden" name="block" value="about">
        <div class="grid gap-4 sm:grid-cols-[7rem_1fr]">
            <img src="<?= e((string) ($about['photo'] ?? '/images/room.jpg')) ?>" alt="" class="size-28 rounded-2xl object-cover">
            <div class="space-y-3">
                <input name="name" maxlength="80" value="<?= e((string) ($about['name'] ?? '')) ?>" placeholder="Имя" class="input-field">
                <input name="role_ru" maxlength="120" value="<?= e((string) ($about['role_ru'] ?? '')) ?>" placeholder="Подпись (рус.)" class="input-field">
                <input name="role_kk" maxlength="120" value="<?= e((string) ($about['role_kk'] ?? '')) ?>" placeholder="Қолтаңба (қаз.)" class="input-field">
                <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" class="block text-sm">
                <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="remove_photo" value="1"> Вернуть исходное фото</label>
            </div>
        </div>
        <div id="about-rows" class="space-y-3">
            <?php foreach ($paragraphs as $paragraph): ?>
                <?php if (!is_array($paragraph)) continue; ?>
                <div class="grid gap-3 sm:grid-cols-2" data-row>
                    <textarea name="paragraph_ru[]" maxlength="2000" rows="3" placeholder="Абзац (рус.)" class="textarea-field"><?= e((string) ($paragraph['ru'] ?? '')) ?></textarea>
                    <textarea name="paragraph_kk[]" maxlength="2000" rows="3" placeholder="Абзац (қаз.)" class="textarea-field"><?= e((string) ($paragraph['kk'] ?? '')) ?></textarea>
                    <button type="button" class="text-left text-sm text-red-600 underline" data-remove-row>Убрать абзац</button>
                </div>
            <?php endforeach; ?>
        </div>
        <div class="flex flex-wrap gap-3">
            <button type="button" class="btn-secondary !px-4 !py-2" data-add-row="#about-rows" data-add-template="#about-template">+ Абзац</button>
            <button type="submit" class="btn-primary h-11 px-8">Сохранить «Обо мне»</button>
        </div>
    </form>
</section>

<section id="contacts">
    <h2 class="mb-3 font-heading text-xl font-bold">Контакты</h2>
    <form method="post" class="card-soft grid gap-4 p-4 sm:grid-cols-2">
        <?= Security::csrfField() ?>
        <input type="hidden" name="block" value="contacts">
        <?php
        $contactFields = [
            'phone' => 'Телефон для ссылки, например +77058553873',
            'phone_display' => 'Телефон на сайте',
            'telegram_handle' => 'Telegram, имя',
            'telegram' => 'Telegram, ссылка',
            'telegram_group' => 'Чат студии, ссылка',
            'whatsapp' => 'WhatsApp, ссылка',
            'instagram_handle' => 'Instagram, имя',
            'instagram' => 'Instagram, ссылка',
            'tiktok_handle' => 'TikTok, имя',
            'tiktok' => 'TikTok, ссылка',
            'address_ru' => 'Адрес (рус.)',
            'address_kk' => 'Мекенжай (қаз.)',
            'map_2gis' => '2ГИС, ссылка',
            'map_google' => 'Google Карты, ссылка',
            'map_link' => 'Яндекс Карты, ссылка',
            'map_embed_url' => 'Виджет карты, ссылка',
        ];
        foreach ($contactFields as $name => $label): ?>
            <div class="<?= str_starts_with($name, 'address') || $name === 'map_embed_url' ? 'sm:col-span-2' : '' ?>">
                <label for="contact-<?= e($name) ?>" class="mb-2 block text-sm font-medium"><?= e($label) ?></label>
                <input id="contact-<?= e($name) ?>" name="<?= e($name) ?>" value="<?= e((string) ($contacts[$name] ?? '')) ?>" class="input-field">
            </div>
        <?php endforeach; ?>
        <div class="sm:col-span-2">
            <button type="submit" class="btn-primary h-11 px-8">Сохранить контакты</button>
        </div>
    </form>
</section>

<template id="faq-template">
    <div class="card-soft grid gap-3 p-4" data-row>
        <input name="q_ru[]" maxlength="200" placeholder="Вопрос (рус.)" class="input-field">
        <input name="q_kk[]" maxlength="200" placeholder="Сұрақ (қаз.)" class="input-field">
        <textarea name="a_ru[]" maxlength="800" rows="2" placeholder="Ответ (рус.)" class="textarea-field"></textarea>
        <textarea name="a_kk[]" maxlength="800" rows="2" placeholder="Жауап (қаз.)" class="textarea-field"></textarea>
        <div class="flex gap-2">
            <button type="button" class="btn-ghost !px-2 !py-1.5" data-move="up" aria-label="Выше">↑</button>
            <button type="button" class="btn-ghost !px-2 !py-1.5" data-move="down" aria-label="Ниже">↓</button>
            <button type="button" class="text-sm text-red-600 underline" data-remove-row>Убрать</button>
        </div>
    </div>
</template>
<template id="about-template">
    <div class="grid gap-3 sm:grid-cols-2" data-row>
        <textarea name="paragraph_ru[]" maxlength="2000" rows="3" placeholder="Абзац (рус.)" class="textarea-field"></textarea>
        <textarea name="paragraph_kk[]" maxlength="2000" rows="3" placeholder="Абзац (қаз.)" class="textarea-field"></textarea>
        <button type="button" class="text-left text-sm text-red-600 underline" data-remove-row>Убрать абзац</button>
    </div>
</template>
<?php require APP_ROOT . '/templates/admin/footer.php';
