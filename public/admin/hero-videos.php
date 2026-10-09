<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

$adminUser = Admin::guard();
$adminTitle = 'Видео на главной';
$adminSection = 'hero';
$videos = [];
$feature = null;
$errors = [];

try {
    SiteContent::ensureTable();
    if (Admin::isPost()) {
        Admin::verifyPost();
        $section = (string) ($_POST['section'] ?? 'reel');
        if ($section === 'feature') {
            if (isset($_POST['remove_feature'])) {
                SiteContent::saveHeroFeature(null, null);
                Admin::flash('success', 'Видео справа убрано с главной.');
                Admin::redirect('/admin/hero-videos.php');
            }
            $newVideo = null;
            $newPoster = null;
            try {
                $videoFile = $_FILES['feature_video'] ?? null;
                if (is_array($videoFile) && (int) ($videoFile['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
                    $newVideo = SiteContent::storeHeroVideo($videoFile);
                }
                $posterFile = $_FILES['feature_poster'] ?? null;
                if (is_array($posterFile) && (int) ($posterFile['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
                    $newPoster = Admin::storeImage($posterFile, 'hero');
                }
                $currentFeature = SiteContent::heroFeature();
                $video = $newVideo ?? (string) ($currentFeature['video'] ?? '');
                $poster = $newPoster ?? (string) ($currentFeature['poster'] ?? '');
                if ($video === '' || $poster === '') {
                    throw new InvalidArgumentException('Нужны и видео, и фото-заставка.');
                }
                SiteContent::saveHeroFeature($video, $poster);
                Admin::flash('success', 'Видео справа обновлено.');
                Admin::redirect('/admin/hero-videos.php');
            } catch (InvalidArgumentException $exception) {
                if (is_string($newVideo)) {
                    SiteContent::deleteHeroVideo($newVideo);
                }
                if (is_string($newPoster)) {
                    Admin::deleteUploadedImage($newPoster);
                }
                $errors[] = $exception->getMessage();
            }
        } else {
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
        }
    }
    $videos = SiteContent::heroVideoRows();
    $feature = SiteContent::heroFeature();
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

<h2 class="mb-2 font-heading text-xl font-bold">Лента под шапкой</h2>
<p class="mb-5 max-w-2xl text-sm leading-relaxed text-warm-500">Короткие ролики показываются под шапкой главной и сами сменяются слева направо. Формат MP4 или WebM, до 30 МБ, не больше 12 штук. Звук на сайте выключен.</p>

<form method="post" enctype="multipart/form-data" class="space-y-5">
    <?= Security::csrfField() ?>
    <input type="hidden" name="section" value="reel">
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

<h2 class="mb-2 mt-12 font-heading text-xl font-bold">Видео справа</h2>
<p class="mb-5 max-w-2xl text-sm leading-relaxed text-warm-500">Заполняет пустое место справа от текста на первом экране. На сайте видна только фото-заставка: ролик начинается после нажатия и открывается на весь экран. Нужны и видео (MP4 или WebM, до 30 МБ), и фото (JPG, PNG или WebP, до 3 МБ).</p>

<form method="post" enctype="multipart/form-data" class="space-y-5">
    <?= Security::csrfField() ?>
    <input type="hidden" name="section" value="feature">
    <?php if ($feature === null): ?>
        <p class="card-soft p-4 text-sm text-warm-500">Пока пусто — справа на главной остаётся фон.</p>
    <?php else: ?>
        <div class="card-soft grid gap-4 p-3 sm:grid-cols-2">
            <img src="<?= e($feature['poster']) ?>" alt="" class="aspect-[3/4] w-full rounded-xl object-cover">
            <video src="<?= e($feature['video']) ?>" controls playsinline preload="metadata" class="aspect-[3/4] w-full rounded-xl bg-warm-900 object-cover"></video>
        </div>
        <label class="flex items-center gap-2 text-sm text-warm-700">
            <input type="checkbox" name="remove_feature" value="1">
            Убрать с главной
        </label>
    <?php endif; ?>
    <div>
        <label for="feature-poster" class="mb-2 block text-sm font-medium">Фото-заставка</label>
        <input id="feature-poster" name="feature_poster" type="file" accept="image/jpeg,image/png,image/webp" class="block w-full text-sm">
    </div>
    <div>
        <label for="feature-video" class="mb-2 block text-sm font-medium">Видео</label>
        <input id="feature-video" name="feature_video" type="file" accept="video/mp4,video/webm" class="block w-full text-sm">
    </div>
    <button type="submit" class="btn-primary h-11 px-8">Сохранить</button>
</form>
<?php require APP_ROOT . '/templates/admin/footer.php';