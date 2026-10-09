<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

$adminUser = Admin::guard();
$adminTitle = 'Работы учеников';
$adminSection = 'works';
$works = [];
$videos = [];
$errors = [];

/** @param array<string, mixed> $files */
function galleryUpload(array $files, int $index): ?string
{
    $error = $files['error'][$index] ?? UPLOAD_ERR_NO_FILE;
    if ($error === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    return Admin::storeImage([
        'name' => $files['name'][$index] ?? '',
        'type' => $files['type'][$index] ?? '',
        'tmp_name' => $files['tmp_name'][$index] ?? '',
        'error' => $error,
        'size' => $files['size'][$index] ?? 0,
    ], 'works');
}

try {
    SiteContent::ensureTable();
    if (Admin::isPost()) {
        Admin::verifyPost();
        $images = $_POST['image'] ?? [];
        $titlesRu = $_POST['title_ru'] ?? [];
        $titlesKk = $_POST['title_kk'] ?? [];
        $categoriesRu = $_POST['category_ru'] ?? [];
        $categoriesKk = $_POST['category_kk'] ?? [];
        $count = is_array($titlesRu) ? count($titlesRu) : 0;
        $uploads = $_FILES['upload'] ?? [];
        $rows = [];
        $fresh = [];
        for ($i = 0; $i < $count && count($rows) < 24; $i++) {
            $titleRu = is_array($titlesRu) ? Admin::text($titlesRu, (string) $i) : '';
            $titleKk = is_array($titlesKk) ? Admin::text($titlesKk, (string) $i) : '';
            $hasFile = is_array($uploads['error'] ?? null)
                && (int) ($uploads['error'][$i] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE;
            if ($titleRu === '' && $titleKk === '') {
                if ($hasFile) {
                    $errors[] = 'Укажите название работы рядом с новым фото.';
                }
                continue;
            }
            $current = is_array($images) ? Admin::text($images, (string) $i) : '';
            if (preg_match('#^/(images/works/[a-z0-9._-]+|uploads/works/[a-f0-9]{16}\.(jpg|png|webp))$#', $current) !== 1) {
                $current = '';
            }
            try {
                $uploaded = is_array($uploads['error'] ?? null) ? galleryUpload($uploads, $i) : null;
            } catch (InvalidArgumentException $exception) {
                $errors[] = $exception->getMessage();
                $uploaded = null;
            }
            if ($uploaded !== null) {
                $fresh[] = $uploaded;
                $current = $uploaded;
            }
            if ($current === '') {
                $errors[] = 'У работы «' . ($titleRu !== '' ? $titleRu : $titleKk) . '» нет фото.';
                continue;
            }
            $categoryRu = is_array($categoriesRu) ? Admin::text($categoriesRu, (string) $i) : '';
            $rows[] = [
                'image' => $current,
                'title_ru' => mb_substr($titleRu, 0, 80),
                'title_kk' => mb_substr($titleKk, 0, 80),
                'category_ru' => mb_substr($categoryRu, 0, 80),
                'category_kk' => mb_substr(is_array($categoriesKk) ? Admin::text($categoriesKk, (string) $i) : '', 0, 80),
                'alt_ru' => mb_substr($titleRu !== '' ? $titleRu : $titleKk, 0, 180),
                'alt_kk' => mb_substr($titleKk !== '' ? $titleKk : $titleRu, 0, 180),
            ];
        }

        $videoIds = $_POST['youtube_id'] ?? [];
        $videoRu = $_POST['video_title_ru'] ?? [];
        $videoKk = $_POST['video_title_kk'] ?? [];
        $videoRows = [];
        $videoCount = is_array($videoIds) ? count($videoIds) : 0;
        for ($i = 0; $i < $videoCount && count($videoRows) < 12; $i++) {
            $youtubeId = is_array($videoIds) ? Admin::text($videoIds, (string) $i) : '';
            if ($youtubeId === '') {
                continue;
            }
            if (preg_match('/^[A-Za-z0-9_-]{6,20}$/', $youtubeId) !== 1) {
                $errors[] = 'Некорректный код YouTube: ' . $youtubeId;
                continue;
            }
            $videoRows[] = [
                'youtube_id' => $youtubeId,
                'title_ru' => mb_substr(is_array($videoRu) ? Admin::text($videoRu, (string) $i) : '', 0, 80),
                'title_kk' => mb_substr(is_array($videoKk) ? Admin::text($videoKk, (string) $i) : '', 0, 80),
            ];
        }

        if ($errors === []) {
            SiteContent::saveWorks($rows);
            SiteContent::saveVideos($videoRows);
            Admin::flash('success', 'Галерея сохранена и уже на сайте.');
            Admin::redirect('/admin/gallery.php');
        }
        foreach ($fresh as $path) {
            Admin::deleteUploadedImage($path);
        }
        $works = $rows;
        $videos = $videoRows;
    }
    if ($works === [] && $errors === []) {
        $works = SiteContent::workRows();
        $videos = SiteContent::videoRows();
    }
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

<form method="post" enctype="multipart/form-data" class="space-y-8">
    <?= Security::csrfField() ?>
    <section>
        <h2 class="mb-3 font-heading text-xl font-bold">Работы учеников</h2>
        <div id="work-rows" class="space-y-3">
            <?php foreach ($works as $work): ?>
                <div class="card-soft grid gap-4 p-4 sm:grid-cols-[5.5rem_1fr_auto]" data-row>
                    <img src="<?= e((string) ($work['image'] ?? '')) ?>" alt="" class="size-20 rounded-xl object-cover">
                    <input type="hidden" name="image[]" value="<?= e((string) ($work['image'] ?? '')) ?>">
                    <div class="grid gap-3 sm:grid-cols-2">
                        <input name="title_ru[]" maxlength="80" value="<?= e((string) ($work['title_ru'] ?? '')) ?>" placeholder="Название (рус.)" class="input-field">
                        <input name="title_kk[]" maxlength="80" value="<?= e((string) ($work['title_kk'] ?? '')) ?>" placeholder="Атауы (қаз.)" class="input-field">
                        <input name="category_ru[]" maxlength="80" value="<?= e((string) ($work['category_ru'] ?? '')) ?>" placeholder="Категория (рус.)" class="input-field">
                        <input name="category_kk[]" maxlength="80" value="<?= e((string) ($work['category_kk'] ?? '')) ?>" placeholder="Санат (қаз.)" class="input-field">
                        <input type="file" name="upload[]" accept="image/jpeg,image/png,image/webp" class="block text-sm sm:col-span-2">
                    </div>
                    <div class="flex items-start gap-2">
                        <button type="button" class="btn-ghost !px-2 !py-1.5" data-move="up" aria-label="Выше">↑</button>
                        <button type="button" class="btn-ghost !px-2 !py-1.5" data-move="down" aria-label="Ниже">↓</button>
                        <button type="button" class="text-sm text-red-600 underline" data-remove-row>Убрать</button>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        <button type="button" class="btn-secondary mt-3 !px-4 !py-2" data-add-row="#work-rows" data-add-template="#work-template">+ Работа</button>
    </section>

    <section>
        <h2 class="mb-3 font-heading text-xl font-bold">Видео уроков</h2>
        <p class="mb-3 text-sm text-warm-500">Код из адреса YouTube, например <span class="font-medium">hYk7mVuqDrk</span>.</p>
        <div id="video-rows" class="space-y-3">
            <?php foreach ($videos as $video): ?>
                <div class="card-soft grid gap-3 p-4 sm:grid-cols-[12rem_1fr_1fr_auto]" data-row>
                    <input name="youtube_id[]" maxlength="20" value="<?= e((string) ($video['youtube_id'] ?? '')) ?>" placeholder="Код YouTube" class="input-field">
                    <input name="video_title_ru[]" maxlength="80" value="<?= e((string) ($video['title_ru'] ?? '')) ?>" placeholder="Название (рус.)" class="input-field">
                    <input name="video_title_kk[]" maxlength="80" value="<?= e((string) ($video['title_kk'] ?? '')) ?>" placeholder="Атауы (қаз.)" class="input-field">
                    <button type="button" class="text-sm text-red-600 underline" data-remove-row>Убрать</button>
                </div>
            <?php endforeach; ?>
        </div>
        <button type="button" class="btn-secondary mt-3 !px-4 !py-2" data-add-row="#video-rows" data-add-template="#video-template">+ Видео</button>
    </section>

    <button type="submit" class="btn-primary h-11 px-8">Сохранить</button>
</form>

<template id="work-template">
    <div class="card-soft grid gap-4 p-4 sm:grid-cols-[5.5rem_1fr_auto]" data-row>
        <span class="flex size-20 items-center justify-center rounded-xl bg-brand-50 text-xs text-warm-500">фото</span>
        <input type="hidden" name="image[]" value="">
        <div class="grid gap-3 sm:grid-cols-2">
            <input name="title_ru[]" maxlength="80" placeholder="Название (рус.)" class="input-field">
            <input name="title_kk[]" maxlength="80" placeholder="Атауы (қаз.)" class="input-field">
            <input name="category_ru[]" maxlength="80" placeholder="Категория (рус.)" class="input-field">
            <input name="category_kk[]" maxlength="80" placeholder="Санат (қаз.)" class="input-field">
            <input type="file" name="upload[]" accept="image/jpeg,image/png,image/webp" class="block text-sm sm:col-span-2">
        </div>
        <div class="flex items-start gap-2">
            <button type="button" class="btn-ghost !px-2 !py-1.5" data-move="up" aria-label="Выше">↑</button>
            <button type="button" class="btn-ghost !px-2 !py-1.5" data-move="down" aria-label="Ниже">↓</button>
            <button type="button" class="text-sm text-red-600 underline" data-remove-row>Убрать</button>
        </div>
    </div>
</template>
<template id="video-template">
    <div class="card-soft grid gap-3 p-4 sm:grid-cols-[12rem_1fr_1fr_auto]" data-row>
        <input name="youtube_id[]" maxlength="20" placeholder="Код YouTube" class="input-field">
        <input name="video_title_ru[]" maxlength="80" placeholder="Название (рус.)" class="input-field">
        <input name="video_title_kk[]" maxlength="80" placeholder="Атауы (қаз.)" class="input-field">
        <button type="button" class="text-sm text-red-600 underline" data-remove-row>Убрать</button>
    </div>
</template>
<?php require APP_ROOT . '/templates/admin/footer.php';
