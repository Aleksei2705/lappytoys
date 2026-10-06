<?php
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo '{}';
    exit;
}

$payload = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($payload) || !Security::verifyCsrf($payload['_csrf'] ?? null)) {
    http_response_code(419);
    echo json_encode(['error' => 'csrf'], JSON_UNESCAPED_UNICODE);
    exit;
}

$action = (string) ($payload['action'] ?? '');
$phone = (string) ($payload['phone'] ?? '');

try {
    if ($action === 'send') {
        $started = PhoneVerify::begin($phone);
        if ($started === null) {
            http_response_code(422);
            echo json_encode(['error' => 'send'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        echo json_encode(['ok' => true, 'botUrl' => $started['botUrl']], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'confirm') {
        $code = preg_replace('/\D/', '', (string) ($payload['code'] ?? '')) ?? '';
        if (!PhoneVerify::confirm($phone, $code)) {
            http_response_code(422);
            echo json_encode(['error' => 'code'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'status') {
        echo json_encode(['verified' => PhoneVerify::isVerified($phone)], JSON_UNESCAPED_UNICODE);
        exit;
    }
} catch (RuntimeException $exception) {
    error_log('[phone-verify] ' . $exception->getMessage());
    http_response_code(503);
    echo json_encode(['error' => 'busy'], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(422);
echo json_encode(['error' => 'action'], JSON_UNESCAPED_UNICODE);
