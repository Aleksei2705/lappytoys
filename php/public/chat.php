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

$audio = (string) ($payload['audio'] ?? '');
$mime = (string) ($payload['mime'] ?? '');
if ($audio !== '') {
    if (strlen($audio) > 600000 || !in_array($mime, ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/mpeg'], true)) {
        http_response_code(422);
        echo '{}';
        exit;
    }
    $aside = max(0, (int) ($payload['aside'] ?? 0));
    $answer = Assistant::answerFromAudio($audio, $mime, $aside);
    if ($answer === null) {
        $busy = str_starts_with(Assistant::lastError(), '429');
        http_response_code($busy ? 429 : 422);
        echo json_encode(['error' => $busy ? 'busy' : 'unheard'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    echo json_encode($answer, JSON_UNESCAPED_UNICODE);
    exit;
}

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
    $busy = str_starts_with(Assistant::lastError(), '429');
    http_response_code($busy ? 429 : 503);
    echo json_encode(['error' => $busy ? 'busy' : Assistant::lastError()], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode($answer, JSON_UNESCAPED_UNICODE);
