import { register } from "node:module";
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

register("./alias-loader.mjs", import.meta.url);

const { courses, masterClasses, reviews } = await import("../src/data/site.ts");
const { messages } = await import("../src/i18n/messages.ts");
const { getCoursePageCopy } = await import("../src/i18n/course-pages.ts");

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ru = messages.ru;
const kk = messages.kk;

const categories = [
  { slug: "crochet", ru: "Вязание крючком" },
  { slug: "needles", ru: "Вязание спицами" },
  { slug: "macrame", ru: "Макраме" },
  { slug: "embroidery", ru: "Вышивка" },
  { slug: "beadwork", ru: "Бисероплетение" },
  { slug: "sewing", ru: "Шитьё игрушек" },
].map((category, index) => ({
  slug: category.slug,
  title_ru: ru[`course.${category.slug}.title`] ?? category.ru,
  title_kk: kk[`course.${category.slug}.title`] ?? null,
  sort_order: (index + 1) * 10,
}));

const courseRows = courses.map((course, index) => {
  const copyRu = getCoursePageCopy(course.id, "ru");
  const copyKk = getCoursePageCopy(course.id, "kk");
  return {
    slug: course.id,
    kind: "course",
    category: course.id === "trial" ? null : course.id,
    title_ru: course.title,
    title_kk: kk[`course.${course.id}.title`] ?? null,
    description_ru: course.description,
    description_kk: kk[`course.${course.id}.desc`] ?? null,
    intro_ru: copyRu.intro,
    intro_kk: copyKk.intro,
    details_ru: copyRu.details,
    details_kk: copyKk.details,
    learn_ru: copyRu.learn,
    learn_kk: copyKk.learn,
    for_whom_ru: copyRu.forWhom,
    for_whom_kk: copyKk.forWhom,
    badge_ru: copyRu.badge,
    badge_kk: copyKk.badge,
    price_label: course.price,
    duration_ru: copyRu.duration,
    duration_kk: copyKk.duration,
    level_ru: copyRu.level,
    level_kk: copyKk.level,
    image_path: null,
    emoji: course.emoji,
    accent: course.accent,
    sort_order: (index + 1) * 10,
  };
});

const masterSlugs = ["mc-sova", "mc-cherepaha", "mc-cyplenok"];
const masterCategory = { "Макраме": "macrame", "Вязание крючком": "crochet" };

const masterRows = masterClasses.map((mc, index) => ({
  slug: masterSlugs[index],
  kind: "master_class",
  category: masterCategory[mc.category] ?? null,
  title_ru: mc.title,
  title_kk: kk[`mc.${index}.title`] ?? null,
  description_ru: mc.description,
  description_kk: kk[`mc.${index}.desc`] ?? null,
  intro_ru: null,
  intro_kk: null,
  details_ru: null,
  details_kk: null,
  learn_ru: null,
  learn_kk: null,
  for_whom_ru: null,
  for_whom_kk: null,
  badge_ru: null,
  badge_kk: null,
  price_label: mc.price,
  duration_ru: null,
  duration_kk: null,
  level_ru: null,
  level_kk: null,
  image_path: mc.image,
  emoji: null,
  accent: mc.accent,
  sort_order: (index + 1) * 10,
}));

const reviewRows = reviews.map((review, index) => ({
  name: review.name,
  course: review.course,
  course_kk: kk[`staticReview.${index}.course`] ?? null,
  text: review.text,
  text_kk: kk[`staticReview.${index}.text`] ?? null,
  reply_text: ru[`staticReview.${index}.reply`] ?? null,
  reply_text_kk: kk[`staticReview.${index}.reply`] ?? null,
  rating: 5,
  created_at: `2025-09-0${reviews.length - index} 12:00:00`,
}));

const seed = { categories, classes: [...courseRows, ...masterRows], reviews: reviewRows };
writeFileSync(resolve(root, "php/database/seed-data.json"), JSON.stringify(seed, null, 2), "utf8");
console.log(
  `categories: ${categories.length}, classes: ${seed.classes.length} (courses ${courseRows.length}, master classes ${masterRows.length}), reviews: ${reviewRows.length}`,
);
