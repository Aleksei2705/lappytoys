<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

Admin::sendHeaders();

if (Auth::user() !== null) {
    Admin::redirect('/admin/');
}

$error = '';
$notice = '';
$flash = Admin::takeFlash();
if ($flash !== null) {
    if ($flash['type'] === 'success') {
        $notice = $flash['message'];
    } else {
        $error = $flash['message'];
    }
}

try {
    if (Admin::isPost()) {
        Admin::verifyPost();
        $email = Admin::text($_POST, 'email');
        $sent = PasswordReset::request($email);
        if ($sent) {
            Admin::flash('success', 'Если этот адрес есть в админке, на него отправлена ссылка для нового пароля. Письмо действует 1 час.');
        } else {
            Admin::flash('error', 'Не удалось отправить письмо. Попробуйте позже.');
        }
        Admin::redirect('/admin/forgot.php');
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
    <title>Новый пароль — Lappy Art</title>
    <link rel="icon" href="/favicon-32.png" sizes="32x32">
    <link rel="stylesheet" href="<?= e(asset('assets/app.css')) ?>">
</head>
<body class="flex min-h-screen items-center justify-center bg-cream px-4 text-warm-900">
<form method="post" class="card-soft w-full max-w-sm space-y-5 p-7 shadow-lg">
    <div class="text-center">
        <p class="font-heading text-2xl font-bold text-brand-700">Lappy Art</p>
        <p class="mt-1 text-sm text-warm-500">Ссылка для нового пароля придёт на почту администратора</p>
    </div>
    <?= Security::csrfField() ?>
    <div>
        <label for="email" class="mb-2 block text-sm font-medium text-warm-700">E-mail</label>
        <input id="email" name="email" type="email" required autocomplete="username" maxlength="190" class="input-field" autofocus>
    </div>
    <?php if ($notice !== ''): ?>
        <p class="text-sm text-green-700" role="status"><?= e($notice) ?></p>
    <?php endif; ?>
    <?php if ($error !== ''): ?>
        <p class="text-sm text-red-600" role="alert"><?= e($error) ?></p>
    <?php endif; ?>
    <button type="submit" class="btn-primary h-11 w-full">Отправить ссылку</button>
    <p class="text-center text-sm"><a href="/admin/login.php" class="text-brand-700 underline">Вернуться ко входу</a></p>
</form>
</body>
</html>
