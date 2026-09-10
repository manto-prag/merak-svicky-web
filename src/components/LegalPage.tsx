import { useI18n } from "@/lib/i18n";

export type LegalSection = { title: { cs: string; en: string }; body: { cs: string; en: string } };

export function LegalPage({
  title,
  sections,
}: {
  title: { cs: string; en: string };
  sections: LegalSection[];
}) {
  const { locale } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl md:text-5xl">{title[locale]}</h1>
      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title.cs}>
            <h2 className="text-2xl">{section.title[locale]}</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {section.body[locale]}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
