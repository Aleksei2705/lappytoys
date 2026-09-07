import { site } from "@/data/site";

type ReviewNotice = {
  name: string;
  course: string;
  text: string;
  rating: number;
  createdAt?: string;
};

function formatNotifyDateTime(iso?: string) {
  const date = iso ? new Date(iso) : new Date();
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("ru-RU", {
    timeZone: "Asia/Almaty",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

  const when = formatNotifyDateTime(review.createdAt);
  const fields: Record<string, string> = {
    _subject: `Новый отзыв на lappytoys.kz — ${review.name}`,
    _template: "table",
    _captcha: "false",
    Имя: review.name,
    Курс: review.course,
    Оценка: `${review.rating}/5`,
    Дата: when,
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
  if (!token || !chatId || typeof document === "undefined") return false;

  const text = [
    "🆕 Новый отзыв на lappytoys.kz",
    `Имя: ${review.name}`,
    `Курс: ${review.course}`,
    `Оценка: ${review.rating}/5`,
    `Дата: ${formatNotifyDateTime(review.createdAt)}`,
    "",
    review.text,
  ].join("\n");

  // Static site: call Telegram via GET in a hidden iframe (browser fetch is blocked by CORS).
  try {
    ensureNotifyFrame();
    const params = new URLSearchParams({
      chat_id: chatId,
      text,
      disable_web_page_preview: "true",
    });
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden";
    iframe.src = `https://api.telegram.org/bot${token}/sendMessage?${params.toString()}`;
    document.body.appendChild(iframe);
    window.setTimeout(() => iframe.remove(), 8000);
    return true;
  } catch {
    return false;
  }
}

/**
 * Try Telegram when secrets were baked into the static build;
 * always also send FormSubmit email as a reliable backup.
 */
export async function notifySiteAuthorAboutReview(review: ReviewNotice) {
  await notifyByTelegram(review);
  notifyByFormSubmit(review);
}
