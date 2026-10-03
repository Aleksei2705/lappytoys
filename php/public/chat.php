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

$now = time();
$hits = array_values(array_filter(
    $_SESSION['assistant_hits'] ?? [],
    static fn ($at): bool => is_int($at) && $at > $now - 3600,
));
if (count($hits) >= 20) {
    http_response_code(429);
    echo '{}';
    exit;
}
$hits[] = $now;
$_SESSION['assistant_hits'] = $hits;

$question = trim((string) ($payload['q'] ?? $payload['message'] ?? ''));
if ($question === '' || mb_strlen($question) > 240) {
    http_response_code(422);
    echo '{}';
    exit;
}

$history = is_array($payload['history'] ?? null) ? $payload['history'] : [];
$aside = max(0, (int) ($payload['aside'] ?? 0));
$question .= "\n[Посторонних вопросов до этого: {$aside}. Если это число уже 2 или больше и вопрос не про студию, не отвечай по существу.]";
$answer = Assistant::answer($question, $history);
if ($answer === null) {
    http_response_code(503);
    echo '{}';
    exit;
}

echo json_encode($answer, JSON_UNESCAPED_UNICODE);
