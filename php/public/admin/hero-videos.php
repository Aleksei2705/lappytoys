<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

$adminUser = Admin::guard();
$adminTitle = 'Видео на главной';
$adminSection = 'hero';
$videos = [];
$errors = [];

try {
    SiteContent::ensureTable();
    if (Admin::isPost()) {
        Admin::verifyPost();
        $current = SiteContent::heroVideoRows();
        $remove = $_POST['remove'] ?? [];
        $remove = is_array($remove) ? array_map('strval', $remove) : [];
        $kept = [];
        foreach ($current as $video) {
            if (!in_array($video['path'], $remove, true)) {
                $kept[] = $video;
            }
        }

        $uploads = $_FILES['videos'] ?? [];
        $count = is_array($uploads['error'] ?? null) ? count($uploads['error']) : 0;
        for ($i = 0; $i < $count && count($kept) < 12; $i++) {
            $error = (int) ($uploads['error'][$i] ?? UPLOAD_ERR_NO_FILE);
            if ($error === UPLOAD_ERR_NO_FILE) {
                continue;
            }
            try {
                $kept[] = ['path' => SiteContent::storeHeroVideo([
                    'name' => $uploads['name'][$i] ?? '',
                    'type' => $uploads['type'][$i] ?? '',
                    'tmp_name' => $uploads['tmp_name'][$i] ?? '',
                    'error' => $error,
                    'size' => $uploads['size'][$i] ?? 0,
                ])];
            } catch (InvalidArgumentException $exception) {
                $errors[] = $exception->getMessage();
            }
        }
        SiteContent::saveHeroVideos($kept);
        if ($errors === []) {
            Admin::flash('success', 'Видео на главной обновлены.');
            Admin::redirect('/admin/hero-videos.php');
        }
        $videos = SiteContent::heroVideoRows();
    } else {
        $videos = SiteContent::heroVideoRows();
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

<p class="mb-5 max-w-2xl text-sm leading-relaxed text-warm-500">Короткие ролики показываются под шапкой главной и сами сменяются слева направо. Формат MP4 или WebM, до 30 МБ, не больше 12 штук. Звук на сайте выключен.</p>

<form method="post" enctype="multipart/form-data" class="space-y-5">
    <?= Security::csrfField() ?>
    <?php if ($videos === []): ?>
        <p class="card-soft p-4 text-sm text-warm-500">Пока нет роликов — лента на главной скрыта.</p>
    <?php else: ?>
        <div class="grid gap-4 sm:grid-cols-2">
            <?php foreach ($videos as $video): ?>
                <label class="card-soft flex items-start gap-3 p-3">
                    <input type="checkbox" name="remove[]" value="<?= e($video['path']) ?>" class="mt-1">
                    <span class="min-w-0">
                        <video src="<?= e($video['path']) ?>" muted playsinline preload="metadata" class="aspect-video w-full rounded-xl bg-warm-900 object-cover"></video>
                        <span class="mt-2 block text-sm text-warm-500">Отметьте, чтобы удалить</span>
                    </span>
                </label>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
    <div>
        <label for="hero-videos" class="mb-2 block text-sm font-medium">Добавить видео</label>
        <input id="hero-videos" name="videos[]" type="file" accept="video/mp4,video/webm" multiple class="block w-full text-sm">
    </div>
    <button type="submit" class="btn-primary h-11 px-8">Сохранить</button>
</form>
<?php require APP_ROOT . '/templates/admin/footer.php';