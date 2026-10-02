<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

Admin::sendHeaders();

$error = '';
$email = '';
$notice = '';
$flash = Admin::takeFlash();
if ($flash !== null && $flash['type'] === 'success') {
    $notice = $flash['message'];
}

try {
    if (Auth::user() !== null) {
        Admin::redirect('/admin/');
    }

    if (Admin::isPost()) {
        Admin::verifyPost();
        $email = Admin::text($_POST, 'email');
        $password = (string) ($_POST['password'] ?? '');

        $result = $email !== '' && $password !== '' && strlen($password) <= 1024
            ? Auth::attempt($email, $password)
            : Auth::RESULT_INVALID;

        if ($result === Auth::RESULT_OK) {
            Admin::redirect('/admin/');
        }
        $error = $result === Auth::RESULT_LOCKED
            ? 'Слишком много неудачных попыток. Подождите 15 минут и попробуйте снова.'
            : 'Неверный e-mail или пароль.';
    }
} catch (RuntimeException) {
    $error = 'База данных недоступна. Попробуйте позже.';
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Вход — Lappy Art</title>
    <link rel="icon" href="/favicon-32.png" sizes="32x32">
    <link rel="stylesheet" href="<?= e(asset('assets/app.css')) ?>">
</head>
<body class="is-admin flex min-h-screen items-center justify-center bg-cream px-4 text-warm-900">
<form method="post" action="/admin/login.php" autocomplete="on" class="card-soft w-full max-w-sm space-y-5 p-7 shadow-lg">
    <div class="text-center">
        <p class="font-heading text-2xl font-bold text-brand-700">Lappy Art</p>
        <p class="mt-1 text-sm text-warm-500">Вход в админку</p>
    </div>
    <?= Security::csrfField() ?>
    <div>
        <label for="email" class="mb-2 block text-sm font-medium text-warm-700">E-mail</label>
        <input id="email" name="email" type="email" required autocomplete="username" inputmode="email"
               autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="190"
               value="<?= e($email) ?>" class="input-field" autofocus>
    </div>
    <div>
        <label for="password" class="mb-2 block text-sm font-medium text-warm-700">Пароль</label>
        <div class="flex gap-2">
            <input id="password" name="password" type="password" required autocomplete="current-password" class="input-field min-w-0 flex-1">
            <button type="button" class="btn-secondary" data-password-toggle="password" aria-pressed="false" aria-label="Показать пароль">
                <span data-eye-show><?= icon('eye', 'size-5') ?></span>
                <span data-eye-hide hidden><?= icon('eye-off', 'size-5') ?></span>
            </button>
        </div>
    </div>
    <?php if ($notice !== ''): ?>
        <p class="text-sm text-green-700" role="status"><?= e($notice) ?></p>
    <?php endif; ?>
    <?php if ($error !== ''): ?>
        <p class="text-sm text-red-600" role="alert"><?= e($error) ?></p>
    <?php endif; ?>
    <button type="submit" class="btn-primary h-11 w-full">Войти</button>
    <p class="text-center text-sm"><a href="/admin/forgot.php" class="text-brand-700 underline">Забыли пароль?</a></p>
</form>
<script src="<?= e(asset('assets/admin.js')) ?>" defer></script>
</body>
</html>
