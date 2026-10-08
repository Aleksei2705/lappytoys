<?php
$heroBtn = 'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-center text-sm font-semibold leading-snug shadow-md transition duration-200 hover:-translate-y-0.5 active:scale-[0.98] sm:px-4';
?>
<section class="hero-screen<?= ($heroVideos ?? []) !== [] ? ' hero-screen-reel' : '' ?>">
    <div class="absolute inset-0 overflow-hidden bg-cream">
        <div class="hero-parallax-layer absolute -inset-[8%] bg-cover bg-center" data-hero-parallax
             style="background-image:url(/images/hero-knit.jpg)"></div>
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-cream/80 via-cream/35 to-transparent"></div>
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-cream/90 via-cream/25 to-brand-50/20"></div>
        <div class="pointer-events-none absolute inset-0 bg-white/15"></div>
        <div class="pointer-events-none absolute inset-0 opacity-25 mix-blend-soft-light">
            <div class="hero-shimmer absolute inset-0"></div>
        </div>
    </div>
    <?php
    $heroClips = $heroVideos ?? [];
    if (count($heroClips) === 1) {
        $heroClips = array_fill(0, 4, $heroClips[0]);
    } elseif (count($heroClips) === 2) {
        $heroClips = array_merge($heroClips, $heroClips);
    }
    ?>
    <?php if ($heroClips !== []): ?>
        <div class="hero-reel" role="region" aria-label="<?= t('hero.reelAria') ?>">
            <div class="hero-reel-track">
                <?php foreach ([false, true] as $copy): ?>
                    <?php foreach ($heroClips as $clip): ?>
                        <div class="hero-reel-slide">
                            <video class="hero-reel-item" width="360" height="480" src="<?= e((string) $clip['path']) ?>" muted autoplay loop playsinline preload="metadata" disablepictureinpicture <?= $copy ? 'aria-hidden="true" tabindex="-1"' : '' ?>></video>
                        </div>
                    <?php endforeach; ?>
                <?php endforeach; ?>
            </div>
        </div>
    <?php endif; ?>
    <div class="container-main relative z-10 flex min-h-0 w-full flex-1 items-end">
        <div class="hero-copy">
            <?php if ($heroClips === []): ?>
                <p class="font-heading text-[2.35rem] font-bold leading-[1.05] tracking-tight text-brand-800 sm:text-5xl lg:text-6xl"><?= e((string) site('brand_title')) ?></p>
                <p class="text-sm font-medium tracking-wide text-warm-700 sm:text-base"><?= t('brand.subtitle') ?></p>
                <a href="/courses/trial/" class="hero-offer">
                    <span class="hero-offer-aura" aria-hidden="true"></span>
                    <span class="hero-offer-card">
                        <span class="hero-offer-shine" aria-hidden="true"></span>
                        <?= icon('gift', 'relative z-[1] size-5 shrink-0 text-brand-700 sm:size-6') ?>
                        <span class="relative z-[1]">
                            <span class="hero-offer-title"><?= t('hero.offer') ?></span>
                            <span class="mt-0.5 block text-[0.7rem] font-medium tracking-wide text-brand-800/80 sm:text-xs"><?= t('hero.offerHint') ?></span>
                        </span>
                    </span>
                </a>
            <?php endif; ?>

            <h1 class="hero-heading max-w-xl">
                <span class="hero-heading-line"><?= t('hero.title.before') ?></span>
                <svg class="hero-heading-yarn" viewBox="0 0 280 14" fill="none" aria-hidden="true">
                    <path d="M2 9 C 28 2, 52 13, 80 7 S 130 1, 160 8 S 220 14, 278 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                </svg>
                <span class="hero-heading-place">
                    <?= icon('map-pin', 'size-4 shrink-0 sm:size-[1.1rem]') ?>
                    <?= t('hero.title.accent') ?>
                </span>
            </h1>
            <?php if ($heroClips !== []): ?>
                <p class="font-heading text-3xl font-bold leading-none tracking-tight text-brand-800 sm:text-4xl"><?= e((string) site('brand_title')) ?></p>
                <p class="text-sm font-medium tracking-wide text-warm-700"><?= t('brand.subtitle') ?></p>
                <a href="/courses/trial/" class="hero-offer">
                    <span class="hero-offer-aura" aria-hidden="true"></span>
                    <span class="hero-offer-card">
                        <span class="hero-offer-shine" aria-hidden="true"></span>
                        <?= icon('gift', 'relative z-[1] size-5 shrink-0 text-brand-700') ?>
                        <span class="relative z-[1]">
                            <span class="hero-offer-title"><?= t('hero.offer') ?></span>
                            <span class="mt-0.5 block text-[0.7rem] font-medium tracking-wide text-brand-800/80"><?= t('hero.offerHint') ?></span>
                        </span>
                    </span>
                </a>
            <?php endif; ?>
            <p class="hero-slogan">
                <?= t('hero.slogan.before') ?> <span class="hero-slogan-accent"><?= t('hero.slogan.accent') ?></span>
            </p>
            <p class="hero-lead max-w-md text-sm leading-snug text-warm-700 sm:text-base sm:leading-relaxed"><?= t('hero.lead') ?></p>

            <div class="hero-actions flex w-full max-w-xl flex-col gap-2.5">
                <a href="#signup" data-signup-direction="course:trial" class="<?= $heroBtn ?> bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-brand-900/15 hover:from-brand-700 hover:to-brand-800">
                    <?= icon('calendar-check', 'size-4 shrink-0') ?><?= t('cta.trial') ?>
                </a>
                <div class="grid grid-cols-2 gap-2.5">
                    <a href="#courses" class="<?= $heroBtn ?> border border-white/80 bg-white/90 text-warm-900 shadow-warm-900/10 backdrop-blur-md hover:bg-white">
                        <?= icon('book-open', 'size-4 shrink-0 text-brand-700') ?><?= t('hero.courses') ?>
                    </a>
                    <a href="#master-classes" class="<?= $heroBtn ?> border border-white/80 bg-white/90 text-warm-900 shadow-warm-900/10 backdrop-blur-md hover:bg-white">
                        <?= icon('sparkles', 'size-4 shrink-0 text-brand-700') ?><?= t('hero.masters') ?>
                    </a>
                </div>
            </div>
        </div>
        <?php if (is_array($heroFeature ?? null)): ?>
            <button type="button" class="hero-feature" data-hero-feature="<?= e($heroFeature['video']) ?>" aria-label="<?= t('aria.expandVideo') ?>">
                <img class="hero-feature-poster" src="<?= e($heroFeature['poster']) ?>" alt="" width="720" height="960">
                <span class="hero-feature-play" aria-hidden="true"><?= icon('play', 'size-7 fill-current') ?></span>
            </button>
        <?php endif; ?>
    </div>
</section>
<?php if (is_array($heroFeature ?? null)): ?>
    <div class="hero-feature-player" hidden data-hero-feature-player>
        <button type="button" class="hero-feature-close" data-hero-feature-close aria-label="<?= t('aria.close') ?>"><?= icon('x') ?></button>
        <video data-hero-feature-video controls playsinline preload="none" poster="<?= e($heroFeature['poster']) ?>"></video>
    </div>
<?php endif; ?>
