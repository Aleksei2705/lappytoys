<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

Admin::sendHeaders();

if (Auth::user() !== null) {
    Admin::redirect('/admin/');
}

$token = (string) ($_GET['token'] ?? $_POST['token'] ?? '');
$error = '';
$valid = false;

try {
    $valid = PasswordReset::userIdForToken($token) !== null;
    if (Admin::isPost()) {
        Admin::verifyPost();
        $password = (string) ($_POST['password'] ?? '');
        $repeat = (string) ($_POST['password_repeat'] ?? '');
        if (strlen($password) < 8 || strlen($password) > 72) {
            $error = 'Пароль должен быть от 8 до 72 символов.';
        } elseif (!hash_equals($password, $repeat)) {
            $error = 'Пароли не совпадают.';
        } elseif (!PasswordReset::complete($token, $password)) {
            $valid = false;
        } else {
            Admin::flash('success', 'Пароль обновлён. Войдите с новым паролем.');
            Admin::redirect('/admin/login.php');
        }
    }
} catch (RuntimeException) {
    $error = 'База данных недоступна. Попробуйте позже.';
    $valid = false;
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Новый пароль — Lappy Art</title>
    <link rel="icon" href="/favicon-32.png" sizes="32x32">
    <link rel="stylesheet" href="<?= e(asset('assets/app.css')) ?>">
</head>
<body class="is-admin flex min-h-screen items-center justify-center bg-cream px-4 text-warm-900">
<div class="card-soft w-full max-w-sm space-y-5 p-7 shadow-lg">
    <div class="text-center">
        <p class="font-heading text-2xl font-bold text-brand-700">Lappy Art</p>
        <p class="mt-1 text-sm text-warm-500">Новый пароль</p>
    </div>
    <?php if (!$valid): ?>
        <p class="text-sm text-red-600" role="alert"><?= $error !== '' ? e($error) : 'Ссылка недействительна или устарела. Запросите новую.' ?></p>
        <p class="text-center text-sm"><a href="/admin/forgot.php" class="text-brand-700 underline">Запросить ссылку</a></p>
    <?php else: ?>
        <form method="post" class="space-y-5">
            <?= Security::csrfField() ?>
            <input type="hidden" name="token" value="<?= e($token) ?>">
            <div>
                <label for="password" class="mb-2 block text-sm font-medium text-warm-700">Новый пароль</label>
                <div class="flex gap-2">
                    <input id="password" name="password" type="password" required minlength="8" maxlength="72" autocomplete="new-password" class="input-field" autofocus>
                    <button type="button" class="btn-secondary" data-password-toggle="password" aria-pressed="false" aria-label="Показать пароль">
                        <span data-eye-show><?= icon('eye', 'size-5') ?></span>
                        <span data-eye-hide hidden><?= icon('eye-off', 'size-5') ?></span>
                    </button>
                </div>
            </div>
            <div>
                <label for="password_repeat" class="mb-2 block text-sm font-medium text-warm-700">Пароль ещё раз</label>
                <div class="flex gap-2">
                    <input id="password_repeat" name="password_repeat" type="password" required minlength="8" maxlength="72" autocomplete="new-password" class="input-field">
                    <button type="button" class="btn-secondary" data-password-toggle="password_repeat" aria-pressed="false" aria-label="Показать пароль">
                        <span data-eye-show><?= icon('eye', 'size-5') ?></span>
                        <span data-eye-hide hidden><?= icon('eye-off', 'size-5') ?></span>
                    </button>
                </div>
            </div>
            <?php if ($error !== ''): ?>
                <p class="text-sm text-red-600" role="alert"><?= e($error) ?></p>
            <?php endif; ?>
            <button type="submit" class="btn-primary h-11 w-full">Сохранить пароль</button>
        </form>
        <script src="<?= e(asset('assets/admin.js')) ?>" defer></script>
    <?php endif; ?>
</div>
</body>
</html>
