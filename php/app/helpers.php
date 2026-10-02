<?php
declare(strict_types=1);

/** @return mixed */
function site(string $key)
{
    static $site = null;
    $site ??= require APP_ROOT . '/config/site.php';
    static $contactKeys = [
        'phone' => true, 'phone_display' => true, 'telegram' => true, 'telegram_handle' => true,
        'telegram_group' => true, 'whatsapp' => true, 'instagram' => true, 'instagram_handle' => true,
        'tiktok' => true, 'tiktok_handle' => true, 'map_2gis' => true, 'map_google' => true,
        'map_link' => true, 'map_embed_url' => true,
    ];
    if (isset($contactKeys[$key])) {
        $override = SiteContent::contactValue($key);
        if ($override !== null) {
            return $override;
        }
    }
    return $site[$key] ?? null;
}

/** Translate and escape: <?= t('nav./#about') ?> */
function t(string $key): string
{
    return Security::escape(I18n::translate($key));
}

/** Localized column: `{base}_kk` for Kazakh (when filled), otherwise `{base}_ru` or plain `{base}`. */
function loc(array $row, string $base): string
{
    if (I18n::locale() === 'kk') {
        $kazakh = trim((string) ($row[$base . '_kk'] ?? ''));
        if ($kazakh !== '') {
            return $kazakh;
        }
    }
    return (string) ($row[$base . '_ru'] ?? $row[$base] ?? '');
}

/** @return list<string> */
function locList(array $row, string $base): array
{
    $json = I18n::locale() === 'kk' && !empty($row[$base . '_kk']) ? $row[$base . '_kk'] : ($row[$base . '_ru'] ?? '');
    $decoded = json_decode((string) $json, true);
    return is_array($decoded) ? array_values(array_map('strval', $decoded)) : [];
}

/** The ₸ glyph is missing on many Android fonts, so prices always use «тг». */
function priceText(?string $value): string
{
    return Security::escape(str_replace('₸', 'тг', (string) $value));
}

function formatDateTime(?string $mysqlDate): string
{
    $timestamp = $mysqlDate ? strtotime($mysqlDate) : false;
    if ($timestamp === false) {
        return '';
    }

    $months = I18n::locale() === 'kk'
        ? ['қаң.', 'ақп.', 'нау.', 'сәу.', 'мам.', 'мау.', 'шіл.', 'там.', 'қыр.', 'қаз.', 'қар.', 'жел.']
        : ['янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'];

    return sprintf('%d %s %s, %s', (int) date('j', $timestamp), $months[(int) date('n', $timestamp) - 1], date('Y', $timestamp), date('H:i', $timestamp));
}

function asset(string $path): string
{
    $file = APP_ROOT . '/public/' . ltrim($path, '/');
    $version = is_file($file) ? (string) filemtime($file) : '1';
    return '/' . ltrim($path, '/') . '?v=' . $version;
}

/** Link to the booking widget (Calendly later); falls back to the on-page signup form. */
function bookingUrl(): string
{
    $calendly = Config::get('CALENDLY_URL');
    return $calendly !== '' ? $calendly : '/#signup';
}

function icon(string $name, string $class = 'size-5'): string
{
    $paths = [
        'menu' => '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
        'x' => '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
        'chevron-left' => '<path d="m15 18-6-6 6-6"/>',
        'chevron-right' => '<path d="m9 18 6-6-6-6"/>',
        'arrow-up' => '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
        'calendar-check' => '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>',
        'eye' => '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
        'eye-off' => '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
        'users' => '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
        'pointer' => '<path d="M14 4.1 12 6"/><path d="m5.1 8-2.9-.8"/><path d="m6 12-1.9 2"/><path d="M7.2 2.2 8 5.1"/><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"/>',
        'gift' => '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
        'map-pin' => '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
        'book-open' => '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
        'sparkles' => '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
        'heart' => '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
        'clock' => '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        'calendar-days' => '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
        'chevron-down' => '<path d="m6 9 6 6 6-6"/>',
        'chevron-up' => '<path d="m18 15-6-6-6 6"/>',
        'play' => '<path d="m6 3 14 9-14 9z"/>',
        'arrow-up-right' => '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
        'arrow-left' => '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
        'share' => '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.42" x2="8.59" y1="6.51" y2="10.49"/>',
        'star' => '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
        'send' => '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
        'check-circle' => '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    ];

    return sprintf(
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%s" aria-hidden="true">%s</svg>',
        Security::escape($class),
        $paths[$name] ?? '',
    );
}

/** Opens a block that fades in when scrolled into view (see site.js). Close with </div>. */
function revealStart(int $delayMs = 0, string $class = ''): string
{
    $style = $delayMs > 0 ? ' style="transition-delay:' . $delayMs . 'ms"' : '';
    return '<div class="reveal-block ' . Security::escape($class) . '" data-reveal' . $style . '>';
}

/** Render a template from templates/ with extracted variables. */
function render(string $template, array $vars = []): void
{
    extract($vars, EXTR_SKIP);
    require APP_ROOT . '/templates/' . $template . '.php';
}

/** Full error page inside the site layout: e.g. showErrorPage(404, 'page.notFound', 'page.notFoundText'). */
function showErrorPage(int $status, string $titleKey, string $textKey): void
{
    http_response_code($status);
    $pageTitle = I18n::translate($titleKey);
    $returnPath = '/';
    require APP_ROOT . '/templates/layout/header.php';
    ?>
    <section class="page-section">
        <div class="container-main max-w-xl text-center">
            <p class="eyebrow"><?= $status ?></p>
            <h1 class="mt-3 font-heading text-3xl font-bold text-warm-900 sm:text-4xl"><?= t($titleKey) ?></h1>
            <p class="mt-4 text-base leading-relaxed text-warm-500"><?= t($textKey) ?></p>
            <a href="/" class="btn-primary mt-8 h-11 px-6"><?= t('page.toHome') ?></a>
        </div>
    </section>
    <?php
    require APP_ROOT . '/templates/layout/footer.php';
}

/** Only local paths are allowed as redirect targets. */
function safeLocalPath(?string $path, string $fallback = '/'): string
{
    if ($path === null || $path === '' || $path[0] !== '/' || str_starts_with($path, '//') || str_contains($path, '\\')) {
        return $fallback;
    }
    return $path;
}
