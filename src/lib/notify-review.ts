import { site } from "@/data/site";

type ReviewNotice = {
  name: string;
  course: string;
  text: string;
  rating: number;
};

/** Sends an email to the site author about a new review (FormSubmit). */
export async function notifySiteAuthorAboutReview(review: ReviewNotice) {
  const notifyEmail = site.notifyEmail;
  if (!notifyEmail) return;

  const subject = `Новый отзыв на lappytoys.kz — ${review.name}`;

  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(notifyEmail)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: subject,
          _template: "table",
          _captcha: "false",
          Имя: review.name,
          Курс: review.course,
          Оценка: `${review.rating}/5`,
          Отзыв: review.text,
        }),
        keepalive: true,
      },
    );

    // FormSubmit returns JSON; ignore body, only ensure request finished.
    await response.text();
  } catch {
    // Review already saved — do not fail the form if mail fails.
  }
}
