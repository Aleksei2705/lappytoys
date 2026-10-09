<?php
/**
 * @var list<array<string, mixed>> $reviews approved reviews, newest first
 * @var list<array<string, mixed>> $courses
 * @var list<array<string, mixed>> $masterClasses
 * @var list<array<string, mixed>> $shopProducts
 */
$flash = $_SESSION['review_flash'] ?? null;
unset($_SESSION['review_flash']);

$count = count($reviews);
$photoCount = 0;
$ratingSum = 0;
foreach ($reviews as $review) {
    $ratingSum += (int) $review['rating'];
    if (ReviewRepository::isPhotoPath($review['photo_path'] ?? null)) {
        $photoCount++;
    }
}
$average = $count > 0 ? round($ratingSum / $count, 1) : 0.0;
$averageDisplay = fmod($average, 1.0) === 0.0 ? (string) (int) $average : number_format($average, 1, '.', '');
?>
<?= revealStart(0, '', 'left') ?>
<section id="reviews" class="page-section">
    <div class="container-main">
        <?php
        render('partials/section-header', [
            'eyebrow' => t('reviews.eyebrow'),
            'titleHtml' => t('reviews.title'),
            'description' => t('reviews.desc'),
        ]);
        ?>

        <?php if ($count > 0): ?>
            <div class="reviews-trust mt-10 grid gap-4 sm:grid-cols-3">
                <div class="card-soft flex items-center gap-4 px-5 py-4">
                    <p class="font-heading text-3xl font-semibold tabular-nums text-brand-800"><?= e($averageDisplay) ?></p>
                    <div>
                        <div class="flex gap-0.5" aria-hidden="true">
                            <?php for ($i = 1; $i <= 5; $i++): ?>
                                <?= icon('star', 'size-4 ' . ($i <= (int) round($average) ? 'fill-accent-400 text-accent-400' : 'text-cream-200')) ?>
                            <?php endfor; ?>
                        </div>
                        <p class="mt-1 text-sm text-warm-500"><?= t('reviews.avgRating') ?></p>
                    </div>
                </div>
                <div class="card-soft px-5 py-4">
                    <p class="font-heading text-3xl font-semibold tabular-nums text-brand-800"><?= $count ?></p>
                    <p class="mt-1 text-sm text-warm-500"><?= t('reviews.totalCount') ?></p>
                </div>
                <div class="card-soft px-5 py-4">
                    <p class="font-heading text-3xl font-semibold tabular-nums text-brand-800"><?= $photoCount ?></p>
                    <p class="mt-1 text-sm text-warm-500"><?= t('reviews.photoCount') ?></p>
                </div>
            </div>

            <div class="relative mt-10" data-reviews-carousel>
                <div class="reviews-feed-scroller flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                     data-reviews-scroller
                     tabindex="0"
                     role="region"
                     aria-roledescription="carousel"
                     aria-label="<?= t('reviews.carouselAria') ?>">
                    <?php foreach ($reviews as $review): ?>
                        <div class="reviews-feed-slide w-[min(88vw,26rem)] shrink-0 snap-center" data-reviews-slide>
                            <?php render('partials/review-card', ['review' => $review]); ?>
                        </div>
                    <?php endforeach; ?>
                </div>
                <?php if ($count > 1): ?>
                    <button type="button" class="reviews-feed-nav reviews-feed-nav-prev btn-secondary absolute left-0 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full !p-0 shadow-md sm:inline-flex"
                            data-reviews-prev aria-label="<?= t('aria.prevReview') ?>"><?= icon('chevron-left') ?></button>
                    <button type="button" class="reviews-feed-nav reviews-feed-nav-next btn-secondary absolute right-0 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full !p-0 shadow-md sm:inline-flex"
                            data-reviews-next aria-label="<?= t('aria.nextReview') ?>"><?= icon('chevron-right') ?></button>
                    <p class="mt-4 text-center text-sm text-warm-500">
                        <span class="font-medium text-warm-700" data-reviews-index>1</span> / <?= $count ?>
                    </p>
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <div class="mx-auto max-w-xl">
            <?php render('partials/review-form', [
                'courses' => $courses,
                'masterClasses' => $masterClasses ?? [],
                'shopProducts' => $shopProducts ?? [],
                'flash' => $flash,
            ]); ?>
        </div>
    </div>
</section>
</div>
