<?php
$works = site('works');
$videos = site('videos');
?>
<section id="works" class="page-section">
    <div class="container-main">
        <?= revealStart() ?>
            <?php render('partials/section-header', [
                'eyebrow' => t('works.eyebrow'),
                'titleHtml' => t('works.title.before'),
                'description' => t('works.desc'),
            ]); ?>
        </div>

        <div class="relative mt-10 sm:mt-12" data-media-carousel>
            <div class="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[8%] pb-2 [scrollbar-width:none] sm:gap-5 sm:px-[12%] [&::-webkit-scrollbar]:hidden"
                 data-carousel-scroller aria-roledescription="carousel" aria-label="<?= t('works.aria') ?>">
                <?php foreach ($works as $index => $work): ?>
                    <button type="button"
                            class="group relative aspect-[3/4] w-[78%] max-w-md shrink-0 snap-center overflow-hidden rounded-3xl text-left outline-none ring-brand-300 transition duration-300 focus-visible:ring-4 sm:w-[55%] lg:w-[42%]"
                            data-carousel-slide
                            data-title="<?= t('work.' . $index . '.title') ?>"
                            data-category="<?= t('work.' . $index . '.category') ?>"
                            data-lightbox-image="/images/works/<?= e($work['file']) ?>"
                            data-lightbox-alt="<?= e(I18n::locale() === 'kk' ? $work['alt_kk'] : $work['alt_ru']) ?>"
                            aria-label="<?= t('work.' . $index . '.title') ?>, <?= t('work.' . $index . '.category') ?>">
                        <img src="/images/works/<?= e($work['file']) ?>"
                             alt="<?= e(I18n::locale() === 'kk' ? $work['alt_kk'] : $work['alt_ru']) ?>"
                             width="900" height="1200" loading="<?= $index < 2 ? 'eager' : 'lazy' ?>"
                             class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                        <span class="absolute inset-0 bg-gradient-to-t from-warm-900/60 via-warm-900/10 to-transparent"></span>
                        <span class="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                            <span class="block text-xs font-medium uppercase tracking-[0.18em] text-white/75"><?= t('work.' . $index . '.category') ?></span>
                            <span class="mt-1 block font-heading text-xl font-semibold text-white sm:text-2xl"><?= t('work.' . $index . '.title') ?></span>
                        </span>
                    </button>
                <?php endforeach; ?>
            </div>
            <button type="button" class="absolute left-0 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-100 bg-white/95 shadow-md sm:left-1 sm:size-11"
                    data-carousel-prev aria-label="<?= t('aria.prevPhoto') ?>"><?= icon('chevron-left') ?></button>
            <button type="button" class="absolute right-0 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-100 bg-white/95 shadow-md sm:right-1 sm:size-11"
                    data-carousel-next aria-label="<?= t('aria.nextPhoto') ?>"><?= icon('chevron-right') ?></button>
            <div class="mt-5 flex flex-col items-center gap-3">
                <div class="flex flex-wrap justify-center gap-2" data-carousel-dots></div>
                <p class="text-sm text-warm-500"><span class="font-medium text-warm-700" data-carousel-index>1</span> / <?= count($works) ?><span class="mx-2 text-brand-200">·</span><span data-carousel-title><?= t('work.0.title') ?></span></p>
            </div>
        </div>

        <div class="mt-14 sm:mt-16" data-video-section>
            <div class="mx-auto max-w-2xl text-center">
                <h2 class="font-heading text-3xl font-bold tracking-tight text-warm-900 sm:text-4xl"><?= t('works.lessonsTitle') ?></h2>
                <p class="mt-4 text-base leading-relaxed text-warm-500"><?= t('works.lessonsDesc') ?></p>
            </div>
            <div class="mt-8 flex justify-center" data-video-collapsed>
                <button type="button" class="btn-secondary h-11 px-6" data-video-toggle aria-expanded="false"><?= icon('chevron-down', 'size-4') ?><?= t('works.lessonsShow') ?></button>
            </div>
            <div hidden data-video-expanded>
                <div class="relative mt-8 sm:mt-10" data-media-carousel>
                    <div class="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[8%] pb-2 [scrollbar-width:none] sm:gap-5 sm:px-[12%] [&::-webkit-scrollbar]:hidden"
                         data-carousel-scroller aria-label="<?= t('works.lessonsAria') ?>">
                        <?php foreach ($videos as $index => $video): ?>
                            <button type="button"
                                    class="group relative aspect-[9/16] w-[78%] max-w-sm shrink-0 snap-center overflow-hidden rounded-3xl bg-warm-900 outline-none ring-brand-300 focus-visible:ring-4 sm:w-[48%] lg:w-[36%]"
                                    data-carousel-slide data-title="<?= t('lesson.' . $index . '.title') ?>"
                                    data-lightbox-video="<?= e($video['youtube_id']) ?>"
                                    aria-label="<?= t('lesson.' . $index . '.title') ?>. <?= t('aria.expandVideo') ?>">
                                <img src="https://i.ytimg.com/vi/<?= e($video['youtube_id']) ?>/hqdefault.jpg" alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]">
                                <span class="absolute inset-0 bg-gradient-to-t from-warm-900/55 via-warm-900/10 to-transparent"></span>
                                <span class="absolute inset-0 flex items-center justify-center"><span class="inline-flex size-16 items-center justify-center rounded-full bg-white/95 shadow-md"><?= icon('play', 'size-7 fill-current') ?></span></span>
                            </button>
                        <?php endforeach; ?>
                    </div>
                    <button type="button" class="absolute left-0 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-md" data-carousel-prev aria-label="<?= t('aria.prevVideo') ?>"><?= icon('chevron-left') ?></button>
                    <button type="button" class="absolute right-0 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-md" data-carousel-next aria-label="<?= t('aria.nextVideo') ?>"><?= icon('chevron-right') ?></button>
                    <div class="mt-5 flex flex-col items-center gap-3">
                        <div class="flex justify-center gap-2" data-carousel-dots></div>
                        <p class="text-sm text-warm-500"><span data-carousel-index>1</span> / <?= count($videos) ?><span class="mx-2">·</span><span data-carousel-title><?= t('lesson.0.title') ?></span></p>
                    </div>
                </div>
                <div class="mt-8 flex justify-center"><button type="button" class="btn-secondary h-11 px-6" data-video-toggle aria-expanded="true"><?= icon('chevron-up', 'size-4') ?><?= t('cta.hide') ?></button></div>
            </div>
        </div>
    </div>
</section>

<div class="fixed inset-0 z-[80] bg-warm-900/95" role="dialog" aria-modal="true" hidden data-media-lightbox>
    <button type="button" class="absolute right-3 top-3 z-20 inline-flex size-11 items-center justify-center rounded-full bg-white/95 shadow-md" data-lightbox-close aria-label="<?= t('aria.close') ?>"><?= icon('x') ?></button>
    <button type="button" class="absolute left-2 top-1/2 z-20 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-md sm:left-6" data-lightbox-prev aria-label="<?= t('aria.prevSlide') ?>"><?= icon('chevron-left') ?></button>
    <button type="button" class="absolute right-2 top-1/2 z-20 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-md sm:right-6" data-lightbox-next aria-label="<?= t('aria.nextSlide') ?>"><?= icon('chevron-right') ?></button>
    <div class="flex h-[100dvh] items-center justify-center px-12 pb-16 pt-14" data-lightbox-stage></div>
    <p class="pointer-events-none absolute inset-x-0 bottom-4 px-4 text-center font-heading text-lg font-semibold text-white" data-lightbox-title></p>
</div>
