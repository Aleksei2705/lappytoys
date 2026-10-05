<?php
/**
 * @var string|null $pageTitle
 * @var string|null $pageDescription
 * @var string|null $canonicalPath
 */
$siteName = (string) site('name');
$siteUrl = (string) site('url');
$locale = I18n::locale();

$fullTitle = isset($pageTitle) && $pageTitle !== ''
    ? $pageTitle . ' — ' . $siteName
    : $siteName . ' — творчество, уроки вязания и рукоделия в Семее';
$description = $pageDescription ?? 'Творчество в Семее: творческая студия Lappy Art — уроки вязания крючком и спицами, макраме, вышивка, бисероплетение, шитьё игрушек. Занятия с Ольгой с нуля, пробный урок и мастер-классы.';
$canonical = $siteUrl . ($canonicalPath ?? '/');
$ogImage = $siteUrl . site('og_image');
$returnPath = safeLocalPath($_SERVER['REQUEST_URI'] ?? '/');
$metricaId = (string) site('yandex_metrica_id');
?>
<!DOCTYPE html>
<html lang="<?= $locale === 'kk' ? 'kk' : 'ru' ?>" class="h-full antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title><?= e($fullTitle) ?></title>
    <meta name="description" content="<?= e($description) ?>">
    <meta name="author" content="Ольга Лаптева">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    <meta name="yandex-verification" content="<?= e((string) site('yandex_verification')) ?>">
    <link rel="canonical" href="<?= e($canonical) ?>">

    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
    <link rel="icon" type="image/png" sizes="48x48" href="/icon-48.png">
    <link rel="apple-touch-icon" href="/images/logo.png">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="<?= e($siteName) ?>">
    <meta property="og:locale" content="ru_KZ">
    <meta property="og:url" content="<?= e($siteUrl) ?>">
    <meta property="og:title" content="<?= e($siteName) ?> — творчество и рукоделие в Семее">
    <meta property="og:description" content="Творческие занятия в Семее: вязание, макраме, вышивка и игрушки своими руками. Студия Lappy Art — с нуля и с удовольствием.">
    <meta property="og:image" content="<?= e($ogImage) ?>">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= e($siteName) ?> — творчество и рукоделие в Семее">
    <meta name="twitter:image" content="<?= e($ogImage) ?>">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Playfair+Display:wght@400..900&display=swap&subset=cyrillic" rel="stylesheet">
    <link rel="stylesheet" href="<?= e(asset('assets/app.css')) ?>">

    <script>
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for(var j=0;j<document.scripts.length;j++){if((document.scripts[j].src||"").indexOf("/metrika/tag.js")!==-1){return;}}
k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;
k.onerror=function(){k.src="https://mc.yandex.com/metrika/tag.js"};
a.parentNode.insertBefore(k,a)})
(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(<?= (int) $metricaId ?>,"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
    </script>
    <?php render('partials/json-ld'); ?>
</head>
<body class="min-h-full font-sans" data-metrica-id="<?= (int) $metricaId ?>">
<noscript><style>.reveal-block{opacity:1!important;transform:none!important}</style></noscript>
<noscript><div><img src="https://mc.yandex.ru/watch/<?= (int) $metricaId ?>" style="position:absolute;left:-9999px" alt=""></div></noscript>

<?php render('partials/background'); ?>

<header class="site-header fixed inset-x-0 top-0 z-50" data-site-header>
    <div class="container-header flex min-h-16 w-full items-center gap-3 py-2 lg:gap-4">
        <a href="/" class="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
            <?php
            render('partials/logo', [
                'titleClass' => 'font-heading text-base font-semibold tracking-tight text-brand-800 whitespace-nowrap sm:text-lg',
                'subtitleClass' => 'hidden truncate text-[11px] leading-tight text-warm-500 sm:block sm:text-xs 2xl:text-sm lg:hidden 2xl:block',
            ]);
            ?>
        </a>

        <div class="site-header-nav-wrap hidden flex-1 lg:block" data-nav-wrap>
            <nav class="site-header-nav" aria-label="<?= t('aria.menu') ?>" data-nav>
                <div class="site-header-nav-inner">
                    <?php foreach (site('nav') as $href): ?>
                        <a href="<?= e($href) ?>" class="nav-link shrink-0 whitespace-nowrap text-[13px] leading-none text-warm-500"><?= t('nav.' . $href) ?></a>
                    <?php endforeach; ?>
                </div>
            </nav>
            <span class="site-header-nav-more site-header-nav-more-left" aria-hidden="true">
                <span class="site-header-nav-more-btn"><?= icon('chevron-left', 'size-3.5') ?></span>
            </span>
            <span class="site-header-nav-more site-header-nav-more-right" aria-hidden="true">
                <span class="site-header-nav-more-btn"><?= icon('chevron-right', 'size-3.5') ?></span>
            </span>
        </div>

        <div class="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5 lg:ml-0">
            <?php render('partials/language-toggle', ['returnPath' => $returnPath]); ?>
            <div class="hidden lg:block">
                <?php render('partials/booking-button', ['class' => 'h-9 px-3 text-sm xl:px-4']); ?>
            </div>
            <button type="button"
                    class="inline-flex size-9 items-center justify-center rounded-xl border border-cream-200 bg-white lg:hidden"
                    aria-label="<?= t('aria.openMenu') ?>"
                    aria-expanded="false"
                    aria-controls="mobile-nav"
                    data-menu-toggle
                    data-label-open="<?= t('aria.openMenu') ?>"
                    data-label-close="<?= t('aria.closeMenu') ?>">
                <span data-icon-open><?= icon('menu') ?></span>
                <span data-icon-close hidden><?= icon('x') ?></span>
            </button>
        </div>
    </div>
</header>

<div id="mobile-nav" class="lg:hidden" hidden>
    <div class="mobile-nav-backdrop" aria-hidden="true" data-menu-close></div>
    <nav class="mobile-nav-sheet">
        <span class="mobile-nav-thread" aria-hidden="true"></span>
        <span class="mobile-nav-flow" aria-hidden="true"></span>
        <div class="mobile-nav-list">
            <?php foreach (site('nav') as $href): ?>
                <a href="<?= e($href) ?>" class="mobile-nav-link" data-menu-close><?= t('nav.' . $href) ?></a>
            <?php endforeach; ?>
        </div>
        <div class="mobile-nav-cta">
            <?php render('partials/booking-button', ['class' => 'h-11 w-full', 'menuClose' => true]); ?>
        </div>
    </nav>
</div>

<div class="site-header-spacer" aria-hidden="true"></div>

<main id="top">
