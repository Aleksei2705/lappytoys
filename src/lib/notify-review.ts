import { site } from "@/data/site";

type ReviewNotice = {
  name: string;
  course: string;
  text: string;
  rating: number;
};

const FRAME_NAME = "review-notify-frame";

function ensureNotifyFrame() {
  if (typeof document === "undefined") return null;

  let frame = document.querySelector<HTMLIFrameElement>(`iframe[name="${FRAME_NAME}"]`);
  if (!frame) {
    frame = document.createElement("iframe");
    frame.name = FRAME_NAME;
    frame.title = "review-notify";
    frame.setAttribute("aria-hidden", "true");
    frame.tabIndex = -1;
    frame.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden";
    document.body.appendChild(frame);
  }
  return frame;
}

/**
 * Notify author via FormSubmit using a real form POST in a hidden iframe.
 * More reliable than fetch(): React re-renders / list refresh won't cancel it.
 */
export function notifySiteAuthorAboutReview(review: ReviewNotice) {
  const notifyEmail = site.notifyEmail;
  if (!notifyEmail || typeof document === "undefined") return;

  ensureNotifyFrame();

  const form = document.createElement("form");
  form.method = "POST";
  form.action = `https://formsubmit.co/${encodeURIComponent(notifyEmail)}`;
  form.target = FRAME_NAME;
  form.acceptCharset = "UTF-8";
  form.style.display = "none";

  const fields: Record<string, string> = {
    _subject: `Новый отзыв на lappytoys.kz — ${review.name}`,
    _template: "table",
    _captcha: "false",
    Имя: review.name,
    Курс: review.course,
    Оценка: `${review.rating}/5`,
    Отзыв: review.text,
  };

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
  form.remove();
}
