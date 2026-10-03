<?php
/** @var array<string, mixed> $review */
$name = (string) $review['name'];
$text = loc($review, 'text');
$course = loc($review, 'course');
$reply = trim(loc($review, 'reply_text'));
$stars = max(1, min(5, (int) $review['rating']));
$when = !empty($review['show_date']) ? formatDateTime((string) $review['created_at']) : '';
$replyWhen = $reply !== '' && !empty($review['reply_at']) ? formatDateTime((string) $review['reply_at']) : '';
$initials = mb_strtoupper(mb_substr($name, 0, 1));
$shareText = implode(' ', array_filter([
    '«' . $text . '» — ' . $name . ', ' . $course . '.',
    $when !== '' ? I18n::translate('review.shareDate') . ' ' . $when . '.' : null,
    $reply !== '' ? I18n::translate('review.replyFrom') . ': ' . $reply : null,
    I18n::translate('review.shareStudio') . ' ' . site('brand_title') . ': ' . site('url'),
]));
?>
<article class="card-soft card-hover px-5 pb-5 pt-2.5">
    <div class="flex items-start justify-between gap-3">
        <div class="flex gap-0.5" aria-label="<?= t('review.ratingLabel') ?> <?= $stars ?> <?= t('review.starsOf') ?>">
            <?php for ($i = 1; $i <= 5; $i++): ?>
                <?= icon('star', 'size-4 ' . ($i <= $stars ? 'fill-accent-400 text-accent-400' : 'text-cream-200')) ?>
            <?php endfor; ?>
        </div>
        <button type="button"
                class="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-warm-500 transition-colors hover:bg-brand-50 hover:text-brand-800"
                aria-label="<?= t('review.shareAria') ?>"
                data-share
                data-share-title="<?= e(I18n::translate('review.shareTitle') . ' ' . site('brand_title')) ?>"
                data-share-text="<?= e($shareText) ?>"
                data-share-url="<?= e(site('url') . '/#reviews') ?>"
                data-share-copied="<?= t('review.copied') ?>">
            <?= icon('share', 'size-3.5') ?><?= t('cta.share') ?>
        </button>
    </div>
    <p class="mt-3 text-base leading-relaxed text-warm-700">&ldquo;<?= e($text) ?>&rdquo;</p>
    <div class="mt-5 flex items-center justify-between gap-3 border-t border-cream-200/70 pt-4">
        <div class="flex min-w-0 items-center gap-3">
            <span class="inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-sm font-semibold text-brand-800 ring-1 ring-brand-100">
                <?php if (!empty($review['avatar_url'])): ?>
                    <img src="<?= e((string) $review['avatar_url']) ?>" alt="" class="size-full object-cover" referrerpolicy="no-referrer" loading="lazy">
                <?php else: ?>
                    <?= e($initials) ?>
                <?php endif; ?>
            </span>
            <div class="min-w-0">
                <p class="font-semibold text-warm-900"><?= e($name) ?></p>
                <p class="text-sm text-warm-500"><?= e($course) ?></p>
                <?php if ($when !== ''): ?>
                    <time datetime="<?= e(date('c', (int) strtotime((string) $review['created_at']))) ?>" class="mt-1 block text-xs text-warm-500/90"><?= e($when) ?></time>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <?php if ($reply !== ''): ?>
        <div class="mt-4 rounded-2xl border border-brand-100/80 bg-brand-50/50 px-4 py-3">
            <p class="text-xs font-semibold uppercase tracking-wide text-brand-700"><?= t('review.replyFrom') ?></p>
            <p class="mt-1.5 text-sm leading-relaxed text-warm-700"><?= e($reply) ?></p>
            <?php if ($replyWhen !== ''): ?>
                <time datetime="<?= e(date('c', (int) strtotime((string) $review['reply_at']))) ?>" class="mt-2 block text-xs text-warm-500/90"><?= e($replyWhen) ?></time>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</article>
