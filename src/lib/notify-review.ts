import { site } from "@/data/site";

type ReviewNotice = {
  name: string;
  course: string;
  text: string;
  rating: number;
};

/**
 * Notifies the site author about a new review.
 * Uses Web3Forms when NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is set,
 * otherwise FormSubmit to site.notifyEmail / NEXT_PUBLIC_REVIEW_NOTIFY_EMAIL.
 * Failures are swallowed so review submit still succeeds.
 */
export async function notifySiteAuthorAboutReview(review: ReviewNotice) {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
  const notifyEmail =
    process.env.NEXT_PUBLIC_REVIEW_NOTIFY_EMAIL?.trim() || site.notifyEmail;

  if (!accessKey && !notifyEmail) {
    return;
  }

  const stars = "★".repeat(review.rating) + "☆".repeat(Math.max(0, 5 - review.rating));
  const subject = `Новый отзыв на lappytoys.kz — ${review.name}`;
  const message = [
    `Имя: ${review.name}`,
    `Курс: ${review.course}`,
    `Оценка: ${review.rating}/5 ${stars}`,
    "",
    review.text,
  ].join("\n");

  try {
    if (accessKey) {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject,
          from_name: review.name,
          email: notifyEmail || undefined,
          message,
          name: review.name,
          course: review.course,
          rating: `${review.rating}/5`,
        }),
      });
      return;
    }

    await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(notifyEmail)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: subject,
        _template: "table",
        Имя: review.name,
        Курс: review.course,
        Оценка: `${review.rating}/5`,
        Отзыв: review.text,
      }),
    });
  } catch {
    // Do not block the review flow if mail delivery fails.
  }
}
