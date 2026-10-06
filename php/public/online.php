<?php
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';

$slug = (string) ($_GET['slug'] ?? '');
if (preg_match('/^[a-z0-9-]{1,80}$/', $slug) !== 1) {
    showErrorPage(404, 'page.notFound', 'page.notFoundText');
    exit;
}

try {
    $product = Shop::findPublished($slug);
} catch (RuntimeException) {
    showErrorPage(503, 'page.unavailable', 'page.unavailableText');
    exit;
}

if ($product === null) {
    showErrorPage(404, 'page.notFound', 'page.notFoundText');
    exit;
}

$token = (string) ($_GET['order'] ?? '');
$error = '';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    if (!Security::verifyCsrf($_POST['_csrf'] ?? null)) {
        $error = t('online.csrf');
    } else {
        $name = trim((string) ($_POST['name'] ?? ''));
        $phone = preg_replace('/[^\d+]/', '', (string) ($_POST['phone'] ?? '')) ?? '';
        if ($name === '' || mb_strlen($name) > 80 || preg_match('/^\+?[0-9]{10,15}$/', $phone) !== 1) {
            $error = t('online.formError');
        } else {
            $now = time();
            $hits = array_values(array_filter(
                $_SESSION['shop_hits'] ?? [],
                static fn ($at): bool => is_int($at) && $at > $now - 3600,
            ));
            $existingPending = Shop::pendingOrderForPhone((int) $product['id'], $phone);
            if ($existingPending !== null) {
                header(
                    'Location: /online/' . rawurlencode((string) $product['slug']) . '/?order=' . $existingPending['token'],
                    true,
                    303,
                );
                exit;
            }
            if (count($hits) >= 12) {
                $error = t('online.busy');
            } else {
                try {
                    $placed = Shop::order((int) $product['id'], ['name' => $name, 'phone' => $phone]);
                    $token = $placed['token'];
                    $hits[] = $now;
                    $_SESSION['shop_hits'] = $hits;
                    $link = Shop::orderUrl(['slug' => (string) $product['slug'], 'token' => $token]);
                    if (Notifier::shopOrder([
                        'id' => $placed['id'],
                        'name' => $name,
                        'phone' => $phone,
                        'title' => loc($product, 'title'),
                        'link' => $link,
                    ])) {
                        Shop::markTelegramSent($placed['id']);
                    } else {
                        error_log('[online] shop order #' . $token . ': Telegram failed — ' . Telegram::lastError());
                    }
                    header('Location: /online/' . rawurlencode((string) $product['slug']) . '/?order=' . $token, true, 303);
                    exit;
                } catch (RuntimeException) {
                    $error = t('online.formError');
                }
            }
        }
    }
}

$order = $token !== '' ? Shop::orderByToken($token) : null;
if ($order !== null && (int) $order['product_id'] !== (int) $product['id']) {
    $order = null;
}

if (($_GET['watch'] ?? '') === '1') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['status' => is_array($order) ? (string) $order['status'] : 'none'], JSON_UNESCAPED_UNICODE);
    exit;
}

$invite = '';
if (is_array($order) && (string) $order['status'] === 'paid') {
    try {
        $invite = Shop::grantChannel($order);
    } catch (RuntimeException) {
        $invite = '';
    }
}

$title = loc($product, 'title');
$pageTitle = $title;
$pageDescription = loc($product, 'description');
$canonicalPath = '/online/' . $product['slug'] . '/';
$returnPath = $canonicalPath;
$kindKey = 'online.kind.' . (string) $product['kind'];

require APP_ROOT . '/templates/layout/header.php';
?>
<div class="container-main max-w-3xl py-14">
    <a href="/#online" class="mb-10 inline-flex items-center gap-2 text-sm font-medium text-warm-500 transition-colors hover:text-brand-800">
        <?= icon('arrow-left', 'size-4') ?><?= t('online.back') ?>
    </a>

    <p class="eyebrow"><?= t($kindKey) ?></p>
    <h1 class="mt-3 font-heading text-3xl font-bold text-warm-900 sm:text-4xl"><?= e($title) ?></h1>
    <p class="mt-4 font-heading text-2xl font-bold text-brand-700"><?= e(Shop::price((int) $product['price_kzt'])) ?></p>

    <?php $photo = Shop::imagePath($product['image_path'] ?? ''); ?>
    <?php if ($photo !== ''): ?>
        <img src="<?= e($photo) ?>" alt="<?= e($title) ?>" class="mt-8 aspect-[4/3] w-full rounded-3xl object-cover shadow-lg">
    <?php endif; ?>

    <?php if (is_string($product['preview_path']) && preg_match('#^/uploads/shop-preview/[a-f0-9]{16}\.(mp4|webm)$#', $product['preview_path']) === 1): ?>
        <video class="mt-8 w-full overflow-hidden rounded-3xl bg-warm-900 shadow-lg" controls playsinline preload="metadata">
            <source src="<?= e((string) $product['preview_path']) ?>">
        </video>
    <?php endif; ?>

    <p class="mt-8 text-base leading-relaxed text-warm-600"><?= e(loc($product, 'description')) ?></p>

    <?php
    $orderUrl = $order !== null ? Shop::orderUrl($order) : '';
    ?>
    <?php if ($order !== null && $order['status'] === 'paid'): ?>
        <?php $hasFile = preg_match('#^[a-f0-9]{16}\.(mp4|webm|pdf|zip)$#', (string) ($order['file_path'] ?? '')) === 1; ?>
        <div class="card-soft mt-10 p-6 text-center">
            <p class="text-base text-warm-700"><?= t('online.paid') ?></p>
            <?php if (Shop::isInviteLink($invite)): ?>
                <a class="btn-primary mt-4 h-12 px-8" href="<?= e($invite) ?>" target="_blank" rel="noopener noreferrer"><?= t('online.channel') ?></a>
                <p class="mt-3 text-sm text-warm-500"><?= t('online.channelNote') ?></p>
            <?php elseif (trim((string) ($order['channel_id'] ?? '')) !== ''): ?>
                <p class="mt-3 text-sm text-warm-500"><?= t('online.channelWait') ?></p>
            <?php endif; ?>
            <?php if ($hasFile): ?>
                <a class="btn-primary mt-4 h-12 px-8" href="/download.php?token=<?= e((string) $order['token']) ?>"><?= t('online.download') ?></a>
            <?php endif; ?>
            <p class="mt-4 text-sm text-warm-500"><?= t('online.save') ?></p>
            <p class="mt-2 break-all text-sm"><a class="text-brand-700 underline" href="<?= e($orderUrl) ?>"><?= e($orderUrl) ?></a></p>
            <?php $paidBotUrl = Shop::buyerBotUrl((string) $order['token']); ?>
            <?php if ($paidBotUrl !== '' && trim((string) ($order['buyer_chat_id'] ?? '')) === ''): ?>
                <a class="btn-primary mt-4 h-12 px-8" href="<?= e($paidBotUrl) ?>" target="_blank" rel="noopener noreferrer"><?= t('online.telegram') ?></a>
                <p class="mt-3 text-sm text-warm-500"><?= t('online.telegramNote') ?></p>
            <?php endif; ?>
        </div>
    <?php elseif ($order !== null && $order['status'] === 'pending'): ?>
        <div class="card-soft mt-10 p-6" data-order-watch>
            <p class="text-base leading-relaxed text-warm-700"><?= t('online.pending') ?></p>
            <p class="mt-3 text-sm text-warm-500"><?= t('online.save') ?></p>
            <p class="mt-2 break-all text-sm"><a class="text-brand-700 underline" href="<?= e($orderUrl) ?>"><?= e($orderUrl) ?></a></p>
            <?php $botUrl = Shop::buyerBotUrl((string) $order['token']); ?>
            <?php if ($botUrl !== '' && trim((string) ($order['buyer_chat_id'] ?? '')) === ''): ?>
                <a class="btn-primary mt-4 h-12 px-8" href="<?= e($botUrl) ?>" target="_blank" rel="noopener noreferrer"><?= t('online.telegram') ?></a>
                <p class="mt-3 text-sm text-warm-500"><?= t('online.telegramNote') ?></p>
            <?php endif; ?>
        </div>
        <script>
            setInterval(function () {
                var watch = location.pathname + location.search + (location.search ? "&" : "?") + "watch=1";
                fetch(watch, { headers: { "Accept": "application/json" } })
                    .then(function (response) { return response.json(); })
                    .then(function (data) { if (data && data.status === "paid") location.reload(); })
                    .catch(function () {});
            }, 8000);
        </script>
    <?php else: ?>
        <?php if ($error !== ''): ?>
            <p class="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><?= e($error) ?></p>
        <?php endif; ?>
        <form method="post" class="card-soft mt-10 grid gap-4 p-6 sm:grid-cols-2">
            <?= Security::csrfField() ?>
            <div>
                <label class="mb-2 block text-sm font-medium" for="shop-name"><?= t('online.name') ?></label>
                <input id="shop-name" name="name" required maxlength="80" class="input-field" value="<?= e((string) ($_POST['name'] ?? '')) ?>">
            </div>
            <div>
                <label class="mb-2 block text-sm font-medium" for="shop-phone"><?= t('online.phone') ?></label>
                <?php render('partials/phone-field', ['id' => 'shop-phone', 'value' => (string) ($_POST['phone'] ?? '')]); ?>
            </div>
            <div class="sm:col-span-2">
                <button type="submit" class="btn-primary h-12 px-8"><?= t('online.buy') ?></button>
                <p class="mt-3 text-sm leading-relaxed text-warm-500"><?= t('online.note') ?></p>
            </div>
        </form>
    <?php endif; ?>
</div>
<?php
require APP_ROOT . '/templates/layout/footer.php';
