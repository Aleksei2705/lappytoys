<?php
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo '{}';
    exit;
}

$payload = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($payload) || !Security::verifyCsrf($payload['_csrf'] ?? null)) {
    http_response_code(419);
    echo '{}';
    exit;
}

$messages = is_array($payload['messages'] ?? null) ? $payload['messages'] : [];
try {
    Assistant::remember((string) ($payload['id'] ?? ''), $messages);
} catch (Throwable $exception) {
    error_log('[assistant] ' . $exception->getMessage());
    http_response_code(503);
    echo '{}';
    exit;
}

echo '{}';
