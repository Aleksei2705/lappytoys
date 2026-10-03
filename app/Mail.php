<?php
declare(strict_types=1);

final class Mail
{
    public static function send(string $to, string $subject, string $text): bool
    {
        if (filter_var($to, FILTER_VALIDATE_EMAIL) === false) {
            return false;
        }

        $from = Config::get('MAIL_FROM', 'noreply@lappytoys.kz');
        if (filter_var($from, FILTER_VALIDATE_EMAIL) === false) {
            $from = 'noreply@lappytoys.kz';
        }

        $headers = implode("\r\n", [
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            'From: Lappy Art <' . $from . '>',
        ]);
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $sent = mail($to, $encodedSubject, $text, $headers, '-f' . $from);
        if ($sent !== true) {
            error_log('[mail] send failed');
        }
        return $sent === true;
    }
}
