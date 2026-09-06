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

function notifyByFormSubmit(review: ReviewNotice) {
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

async function notifyByTelegram(review: ReviewNotice) {
  const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return false;

  const text = [
    "🆕 Новый отзыв на lappytoys.kz",
    `Имя: ${review.name}`,
    `Курс: ${review.course}`,
    `Оценка: ${review.rating}/5`,
    "",
    review.text,
  ].join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Prefer Telegram (set NEXT_PUBLIC_TELEGRAM_BOT_TOKEN + NEXT_PUBLIC_TELEGRAM_CHAT_ID in build),
 * fallback to FormSubmit email.
 */
export async function notifySiteAuthorAboutReview(review: ReviewNotice) {
  const telegramOk = await notifyByTelegram(review);
  if (!telegramOk) {
    notifyByFormSubmit(review);
  }
}
