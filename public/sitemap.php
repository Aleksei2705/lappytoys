<?php
declare(strict_types=1);

define('LAPPY_NO_SESSION', true);

require dirname(__DIR__) . '/app/bootstrap.php';

header_remove('Set-Cookie');
header_remove('Expires');
header_remove('Pragma');
header('Content-Type: application/xml; charset=UTF-8');
header('Cache-Control: public, max-age=3600');

$baseUrl = rtrim((string) site('url'), '/');
$urls = [
    ['loc' => $baseUrl . '/', 'lastmod' => null, 'priority' => '1.0'],
    ['loc' => $baseUrl . '/privacy/', 'lastmod' => null, 'priority' => '0.3'],
];

try {
    $classes = Database::fetchAll(
        'SELECT slug, updated_at FROM classes WHERE is_published = 1 ORDER BY id',
    );
    foreach ($classes as $class) {
        $urls[] = [
            'loc' => $baseUrl . '/courses/' . rawurlencode((string) $class['slug']) . '/',
            'lastmod' => !empty($class['updated_at']) ? date('Y-m-d', (int) strtotime((string) $class['updated_at'])) : null,
            'priority' => '0.8',
        ];
    }
} catch (RuntimeException $exception) {
    error_log('[sitemap] ' . $exception->getMessage());
}

$xml = static fn (string $value): string => htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
echo '<?xml version="1.0" encoding="UTF-8"?>', "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<?php foreach ($urls as $url): ?>
  <url>
    <loc><?= $xml($url['loc']) ?></loc>
<?php if ($url['lastmod'] !== null): ?>
    <lastmod><?= $xml($url['lastmod']) ?></lastmod>
<?php endif; ?>
    <priority><?= $url['priority'] ?></priority>
  </url>
<?php endforeach; ?>
</urlset>
