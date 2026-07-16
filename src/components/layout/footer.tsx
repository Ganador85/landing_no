import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const locale = await getLocale();
  const year = new Date().getFullYear();

  const quick = [
    { href: "/", label: tNav("home") },
    { href: "/#tjenester", label: tNav("services") },
    { href: "/#referanser", label: tNav("references") },
    { href: "/#om-oss", label: tNav("about") },
    { href: "/#kontakt", label: tNav("contact") },
  ] as const;

  return (
    <footer className="border-t border-white/10 bg-[#080a0e] pb-24 md:pb-0">
      <div className="container-narrow section-pad grid gap-10 md:grid-cols-3">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-amber-700 text-sm font-bold text-accent-foreground">
              T
            </span>
            <span className="font-bold tracking-wide uppercase">{siteConfig.name}</span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {t("tagline")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("partOf")}{" "}
            <span className="text-foreground">{siteConfig.parentOrg}</span>
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
            {t("quickLinks")}
          </h4>
          <ul className="space-y-2">
            {quick.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
            {t("contact")}
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-accent">
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a href={siteConfig.phoneHref} className="hover:text-accent">
                {siteConfig.phone}
              </a>
            </li>
            <li>
              {siteConfig.address.street}, {siteConfig.address.postal}{" "}
              {siteConfig.address.city}
            </li>
            <li>Org.nr: {siteConfig.orgNr}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-narrow flex flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {siteConfig.name}. {t("rights")}
          </p>
          <p>{t("warrantyNote")}</p>
          <p className="uppercase tracking-wider">{locale}</p>
        </div>
      </div>
    </footer>
  );
}
