<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

Admin::sendHeaders();

if (Admin::isPost()) {
    Admin::verifyPost();
    Auth::logout();
}
Admin::redirect('/admin/login.php');
