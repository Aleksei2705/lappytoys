<?php
$heroBtn = 'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-center text-sm font-semibold leading-snug shadow-md transition duration-200 hover:-translate-y-0.5 active:scale-[0.98] sm:px-4';
?>
<section class="relative flex min-h-[calc(100svh-4rem-env(safe-area-inset-top,0px))] flex-col justify-end overflow-hidden">
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
    <div class="container-main relative z-10 w-full pb-10 pt-16 sm:pb-14 sm:pt-20 md:pb-16">
        <div class="hero-copy flex w-full max-w-2xl flex-col items-start text-left">
            <p class="font-heading text-5xl font-bold leading-[1.05] tracking-tight text-brand-800 sm:text-6xl lg:text-7xl"><?= e((string) site('brand_title')) ?></p>
            <p class="mt-2 text-sm font-medium tracking-wide text-warm-700 sm:text-base"><?= t('brand.subtitle') ?></p>

            <a href="/courses/trial/" class="hero-offer mt-6 sm:mt-7">
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

            <h1 class="hero-heading mt-8 max-w-xl">
                <span class="hero-heading-line"><?= t('hero.title.before') ?></span>
                <svg class="hero-heading-yarn" viewBox="0 0 280 14" fill="none" aria-hidden="true">
                    <path d="M2 9 C 28 2, 52 13, 80 7 S 130 1, 160 8 S 220 14, 278 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                </svg>
                <span class="hero-heading-place">
                    <?= icon('map-pin', 'size-4 shrink-0 sm:size-[1.1rem]') ?>
                    <?= t('hero.title.accent') ?>
                </span>
            </h1>
            <p class="hero-slogan mt-5">
                <?= t('hero.slogan.before') ?> <span class="hero-slogan-accent"><?= t('hero.slogan.accent') ?></span>
            </p>
            <p class="mt-3 max-w-md text-base leading-relaxed text-warm-700 sm:text-lg"><?= t('hero.lead') ?></p>

            <div class="mt-8 flex w-full max-w-xl flex-col gap-3">
                <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <a href="#courses" class="<?= $heroBtn ?> bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-brand-900/15 hover:from-brand-700 hover:to-brand-800">
                        <?= icon('book-open', 'size-4 shrink-0') ?><?= t('hero.courses') ?>
                    </a>
                    <a href="#master-classes" class="<?= $heroBtn ?> border border-white/80 bg-white/90 text-warm-900 shadow-warm-900/10 backdrop-blur-md hover:bg-white">
                        <?= icon('sparkles', 'size-4 shrink-0 text-brand-700') ?><?= t('hero.masters') ?>
                    </a>
                </div>
                <a href="<?= e((string) site('telegram_group')) ?>" target="_blank" rel="noopener noreferrer" class="hero-guide">
                    <span class="hero-guide-icon" aria-hidden="true">
                        <img src="/images/telegram.svg" alt="" width="128" height="128" class="size-7">
                    </span>
                    <span class="min-w-0 flex-1">
                        <span class="hero-guide-kicker"><?= t('hero.guide.kicker') ?></span>
                        <span class="hero-guide-title"><?= t('hero.guide.title') ?></span>
                    </span>
                    <?= icon('chevron-right', 'size-5 shrink-0 text-[#1a8bc4]') ?>
                </a>
            </div>
        </div>
    </div>
</section>
