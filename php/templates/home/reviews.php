<?php
/**
 * @var list<array<string, mixed>> $reviews approved reviews, newest first
 * @var list<array<string, mixed>> $courses
 */
$visibleCount = 2;
$hiddenCount = max(0, count($reviews) - $visibleCount);
$flash = $_SESSION['review_flash'] ?? null;
unset($_SESSION['review_flash']);
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

        <div class="mt-12 grid gap-6 sm:grid-cols-2">
            <?php foreach ($reviews as $index => $review): ?>
                <?php if ($index >= $visibleCount): ?><div class="contents" data-expandable-extra hidden><?php endif; ?>
                <?php render('partials/review-card', ['review' => $review]); ?>
                <?php if ($index >= $visibleCount): ?></div><?php endif; ?>
            <?php endforeach; ?>
        </div>

        <?php if ($hiddenCount > 0): ?>
            <div class="mt-8 flex justify-center" data-expandable>
                <button type="button" class="btn-secondary h-11 px-6" aria-expanded="false" data-expandable-toggle data-expandable-scope="#reviews">
                    <span data-label-collapsed class="inline-flex items-center gap-2"><?= icon('chevron-down', 'size-4') ?><?= t('cta.showMore') ?> (<?= $hiddenCount ?>)</span>
                    <span data-label-expanded class="hidden items-center gap-2"><?= icon('chevron-up', 'size-4') ?><?= t('cta.hide') ?></span>
                </button>
            </div>
        <?php endif; ?>

        <div class="mx-auto max-w-xl">
            <?php render('partials/review-form', ['courses' => $courses, 'flash' => $flash]); ?>
        </div>
    </div>
</section>
</div>
