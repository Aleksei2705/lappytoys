import { notFound } from "next/navigation";
import { CoursePageContent } from "@/components/course-page-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { courses, getCourseById, site } from "@/data/site";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseById(slug);
  if (!course) return {};
  return {
    title: `${course.title} — творчество и рукоделие в Семее`,
    description: `${course.description} Творческие занятия в студии lappy.art, ${site.city}. ${course.price}, ${course.duration}, уровень: ${course.level}.`,
    keywords: [
      course.title,
      `${course.title} Семей`,
      "творчество Семей",
      "рукоделие Семей",
      "творческая студия",
      "lappy.art",
    ],
    alternates: {
      canonical: `/courses/${course.id}/`,
    },
    openGraph: {
      title: `${course.title} — творчество в ${site.city}`,
      description: course.description,
      url: `${site.url}/courses/${course.id}/`,
      type: "website",
    },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseById(slug);
  if (!course) notFound();

  return (
    <div>
      <SiteHeader />
      <CoursePageContent course={course} />
      <SiteFooter />
    </div>
  );
}
