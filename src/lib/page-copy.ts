/** Localized marketing copy for the landing page (NO + EN). */

export type LocaleText = { no: string; en: string };

export type PageCopy = {
  meta: {
    title: LocaleText;
    description: LocaleText;
  };
  nav: {
    home: LocaleText;
    services: LocaleText;
    references: LocaleText;
    about: LocaleText;
    products: LocaleText;
    contact: LocaleText;
    contactUs: LocaleText;
    call: LocaleText;
    menu: LocaleText;
    close: LocaleText;
  };
  hero: {
    badge: LocaleText;
    title: LocaleText;
    titleAccent: LocaleText;
    subtitle: LocaleText;
    cta: LocaleText;
    ctaSecondary: LocaleText;
    trustWarranty: LocaleText;
    trustCustomers: LocaleText;
    trustRating: LocaleText;
  };
  trustBar: {
    items: LocaleText[];
  };
  sticky: {
    call: LocaleText;
    book: LocaleText;
  };
  services: {
    eyebrow: LocaleText;
    title: LocaleText;
    subtitle: LocaleText;
    showMore: LocaleText;
    showLess: LocaleText;
  };
  calculator: {
    eyebrow: LocaleText;
    title: LocaleText;
    subtitle: LocaleText;
    hint: LocaleText;
    sizeLabel: LocaleText;
    newRoof: LocaleText;
    renewal: LocaleText;
    youSave: LocaleText;
    cheaper: LocaleText;
    disclaimer: LocaleText;
    cta: LocaleText;
  };
  newRoof: {
    eyebrow: LocaleText;
    title: LocaleText;
    subtitle: LocaleText;
    body: LocaleText;
    typesTitle: LocaleText;
    types: LocaleText[];
    note: LocaleText;
    cta: LocaleText;
  };
  references: {
    eyebrow: LocaleText;
    title: LocaleText;
    subtitle: LocaleText;
    note: LocaleText;
    before: LocaleText;
    during: LocaleText;
    after: LocaleText;
    swipe: LocaleText;
  };
  about: {
    eyebrow: LocaleText;
    title: LocaleText;
    subtitle: LocaleText;
    p1: LocaleText;
    p2: LocaleText;
    p3: LocaleText;
    parent: LocaleText;
    cta: LocaleText;
    stats: Array<{ title: LocaleText; desc: LocaleText }>;
    company: {
      title: LocaleText;
      org: LocaleText;
      phone: LocaleText;
      email: LocaleText;
      address: LocaleText;
    };
  };
  products: {
    eyebrow: LocaleText;
    title: LocaleText;
    subtitle: LocaleText;
    footer: LocaleText;
  };
  faq: {
    eyebrow: LocaleText;
    title: LocaleText;
    subtitle: LocaleText;
  };
  testimonials: {
    eyebrow: LocaleText;
    title: LocaleText;
    items: Array<{ quote: LocaleText; author: LocaleText; service: LocaleText }>;
  };
  contact: {
    eyebrow: LocaleText;
    title: LocaleText;
    subtitle: LocaleText;
    phone: LocaleText;
    hours: LocaleText;
    email: LocaleText;
    reply: LocaleText;
    office: LocaleText;
    form: {
      name: LocaleText;
      email: LocaleText;
      phone: LocaleText;
      address: LocaleText;
      houseNumber: LocaleText;
      postal: LocaleText;
      city: LocaleText;
      type: LocaleText;
      typeRenewal: LocaleText;
      typeNew: LocaleText;
      typeCladding: LocaleText;
      message: LocaleText;
      submit: LocaleText;
      sending: LocaleText;
      success: LocaleText;
      error: LocaleText;
      required: LocaleText;
      invalidEmail: LocaleText;
      messageTooShort: LocaleText;
      messageHint: LocaleText;
    };
  };
  footer: {
    tagline: LocaleText;
    partOf: LocaleText;
    quickLinks: LocaleText;
    contact: LocaleText;
    warrantyNote: LocaleText;
    rights: LocaleText;
  };
};

/** Resolved copy for a single locale (ready for components). */
export type LocalizedCopy = {
  [K in keyof PageCopy]: PageCopy[K] extends LocaleText
    ? string
    : PageCopy[K] extends LocaleText[]
      ? string[]
      : PageCopy[K] extends Array<infer U>
        ? Array<{
            [P in keyof U]: U[P] extends LocaleText ? string : U[P];
          }>
        : {
            [P in keyof PageCopy[K]]: PageCopy[K][P] extends LocaleText
              ? string
              : PageCopy[K][P] extends LocaleText[]
                ? string[]
                : PageCopy[K][P] extends Array<infer U>
                  ? Array<{
                      [Q in keyof U]: U[Q] extends LocaleText ? string : U[Q];
                    }>
                  : {
                      [Q in keyof PageCopy[K][P]]: PageCopy[K][P][Q] extends LocaleText
                        ? string
                        : PageCopy[K][P][Q];
                    };
          };
};

function t(no: string, en: string): LocaleText {
  return { no, en };
}

type Msg = typeof import("@/i18n/messages/no.json");

export function pageCopyFromMessages(no: Msg, en: Msg): PageCopy {
  return {
    meta: {
      title: t(no.meta.title, en.meta.title),
      description: t(no.meta.description, en.meta.description),
    },
    nav: {
      home: t(no.nav.home, en.nav.home),
      services: t(no.nav.services, en.nav.services),
      references: t(no.nav.references, en.nav.references),
      about: t(no.nav.about, en.nav.about),
      products: t(no.nav.products, en.nav.products),
      contact: t(no.nav.contact, en.nav.contact),
      contactUs: t(no.nav.contactUs, en.nav.contactUs),
      call: t(no.nav.call, en.nav.call),
      menu: t(no.nav.menu, en.nav.menu),
      close: t(no.nav.close, en.nav.close),
    },
    hero: {
      badge: t(no.hero.badge, en.hero.badge),
      title: t(no.hero.title, en.hero.title),
      titleAccent: t(no.hero.titleAccent, en.hero.titleAccent),
      subtitle: t(no.hero.subtitle, en.hero.subtitle),
      cta: t(no.hero.cta, en.hero.cta),
      ctaSecondary: t(no.hero.ctaSecondary, en.hero.ctaSecondary),
      trustWarranty: t(no.hero.trustWarranty, en.hero.trustWarranty),
      trustCustomers: t(no.hero.trustCustomers, en.hero.trustCustomers),
      trustRating: t(no.hero.trustRating, en.hero.trustRating),
    },
    trustBar: {
      items: no.trustBar.items.map((label, i) =>
        t(label, en.trustBar.items[i] || label),
      ),
    },
    sticky: {
      call: t(no.sticky.call, en.sticky.call),
      book: t(no.sticky.book, en.sticky.book),
    },
    services: {
      eyebrow: t(no.services.eyebrow, en.services.eyebrow),
      title: t(no.services.title, en.services.title),
      subtitle: t(no.services.subtitle, en.services.subtitle),
      showMore: t(no.services.showMore, en.services.showMore),
      showLess: t(no.services.showLess, en.services.showLess),
    },
    calculator: {
      eyebrow: t(no.calculator.eyebrow, en.calculator.eyebrow),
      title: t(no.calculator.title, en.calculator.title),
      subtitle: t(no.calculator.subtitle, en.calculator.subtitle),
      hint: t(no.calculator.hint, en.calculator.hint),
      sizeLabel: t(no.calculator.sizeLabel, en.calculator.sizeLabel),
      newRoof: t(no.calculator.newRoof, en.calculator.newRoof),
      renewal: t(no.calculator.renewal, en.calculator.renewal),
      youSave: t(no.calculator.youSave, en.calculator.youSave),
      cheaper: t(no.calculator.cheaper, en.calculator.cheaper),
      disclaimer: t(no.calculator.disclaimer, en.calculator.disclaimer),
      cta: t(no.calculator.cta, en.calculator.cta),
    },
    newRoof: {
      eyebrow: t(no.newRoof.eyebrow, en.newRoof.eyebrow),
      title: t(no.newRoof.title, en.newRoof.title),
      subtitle: t(no.newRoof.subtitle, en.newRoof.subtitle),
      body: t(no.newRoof.body, en.newRoof.body),
      typesTitle: t(no.newRoof.typesTitle, en.newRoof.typesTitle),
      types: no.newRoof.types.map((label, i) => t(label, en.newRoof.types[i] || label)),
      note: t(no.newRoof.note, en.newRoof.note),
      cta: t(no.newRoof.cta, en.newRoof.cta),
    },
    references: {
      eyebrow: t(no.references.eyebrow, en.references.eyebrow),
      title: t(no.references.title, en.references.title),
      subtitle: t(no.references.subtitle, en.references.subtitle),
      note: t(no.references.note, en.references.note),
      before: t(no.references.before, en.references.before),
      during: t(no.references.during, en.references.during),
      after: t(no.references.after, en.references.after),
      swipe: t(no.references.swipe, en.references.swipe),
    },
    about: {
      eyebrow: t(no.about.eyebrow, en.about.eyebrow),
      title: t(no.about.title, en.about.title),
      subtitle: t(no.about.subtitle, en.about.subtitle),
      p1: t(no.about.p1, en.about.p1),
      p2: t(no.about.p2, en.about.p2),
      p3: t(no.about.p3, en.about.p3),
      parent: t(no.about.parent, en.about.parent),
      cta: t(no.about.cta, en.about.cta),
      stats: [
        {
          title: t(no.about.stats.roofs, en.about.stats.roofs),
          desc: t(no.about.stats.roofsDesc, en.about.stats.roofsDesc),
        },
        {
          title: t(no.about.stats.warranty, en.about.stats.warranty),
          desc: t(no.about.stats.warrantyDesc, en.about.stats.warrantyDesc),
        },
        {
          title: t(no.about.stats.area, en.about.stats.area),
          desc: t(no.about.stats.areaDesc, en.about.stats.areaDesc),
        },
        {
          title: t(no.about.stats.teams, en.about.stats.teams),
          desc: t(no.about.stats.teamsDesc, en.about.stats.teamsDesc),
        },
      ],
      company: {
        title: t(no.about.company.title, en.about.company.title),
        org: t(no.about.company.org, en.about.company.org),
        phone: t(no.about.company.phone, en.about.company.phone),
        email: t(no.about.company.email, en.about.company.email),
        address: t(no.about.company.address, en.about.company.address),
      },
    },
    products: {
      eyebrow: t(no.products.eyebrow, en.products.eyebrow),
      title: t(no.products.title, en.products.title),
      subtitle: t(no.products.subtitle, en.products.subtitle),
      footer: t(no.products.footer, en.products.footer),
    },
    faq: {
      eyebrow: t(no.faq.eyebrow, en.faq.eyebrow),
      title: t(no.faq.title, en.faq.title),
      subtitle: t(no.faq.subtitle, en.faq.subtitle),
    },
    testimonials: {
      eyebrow: t(no.testimonials.eyebrow, en.testimonials.eyebrow),
      title: t(no.testimonials.title, en.testimonials.title),
      items: no.testimonials.items.map((item, i) => {
        const enItem = en.testimonials.items[i] || item;
        return {
          quote: t(item.quote, enItem.quote),
          author: t(item.author, enItem.author),
          service: t(item.service, enItem.service),
        };
      }),
    },
    contact: {
      eyebrow: t(no.contact.eyebrow, en.contact.eyebrow),
      title: t(no.contact.title, en.contact.title),
      subtitle: t(no.contact.subtitle, en.contact.subtitle),
      phone: t(no.contact.phone, en.contact.phone),
      hours: t(no.contact.hours, en.contact.hours),
      email: t(no.contact.email, en.contact.email),
      reply: t(no.contact.reply, en.contact.reply),
      office: t(no.contact.office, en.contact.office),
      form: {
        name: t(no.contact.form.name, en.contact.form.name),
        email: t(no.contact.form.email, en.contact.form.email),
        phone: t(no.contact.form.phone, en.contact.form.phone),
        address: t(no.contact.form.address, en.contact.form.address),
        houseNumber: t(no.contact.form.houseNumber, en.contact.form.houseNumber),
        postal: t(no.contact.form.postal, en.contact.form.postal),
        city: t(no.contact.form.city, en.contact.form.city),
        type: t(no.contact.form.type, en.contact.form.type),
        typeRenewal: t(no.contact.form.typeRenewal, en.contact.form.typeRenewal),
        typeNew: t(no.contact.form.typeNew, en.contact.form.typeNew),
        typeCladding: t(no.contact.form.typeCladding, en.contact.form.typeCladding),
        message: t(no.contact.form.message, en.contact.form.message),
        submit: t(no.contact.form.submit, en.contact.form.submit),
        sending: t(no.contact.form.sending, en.contact.form.sending),
        success: t(no.contact.form.success, en.contact.form.success),
        error: t(no.contact.form.error, en.contact.form.error),
        required: t(no.contact.form.required, en.contact.form.required),
        invalidEmail: t(no.contact.form.invalidEmail, en.contact.form.invalidEmail),
        messageTooShort: t(no.contact.form.messageTooShort, en.contact.form.messageTooShort),
        messageHint: t(no.contact.form.messageHint, en.contact.form.messageHint),
      },
    },
    footer: {
      tagline: t(no.footer.tagline, en.footer.tagline),
      partOf: t(no.footer.partOf, en.footer.partOf),
      quickLinks: t(no.footer.quickLinks, en.footer.quickLinks),
      contact: t(no.footer.contact, en.footer.contact),
      warrantyNote: t(no.footer.warrantyNote, en.footer.warrantyNote),
      rights: t(no.footer.rights, en.footer.rights),
    },
  };
}

function pickText(value: LocaleText, locale: "no" | "en"): string {
  return value[locale] || value.no || value.en || "";
}

function pickField(
  noVal: string | null | undefined,
  enVal: string | null | undefined,
  fallback: LocaleText,
): LocaleText {
  const no = noVal?.trim();
  const en = enVal?.trim();
  return {
    no: no || fallback.no,
    en: en || fallback.en,
  };
}

function pickTypesList(
  noVal: string | null | undefined,
  enVal: string | null | undefined,
  fallback: LocaleText[],
): LocaleText[] {
  const noLines = (noVal || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const enLines = (enVal || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  if (noLines.length === 0 && enLines.length === 0) {
    return fallback;
  }

  const maxLen = Math.max(noLines.length, enLines.length, fallback.length);
  return Array.from({ length: maxLen }, (_, i) => ({
    no: noLines[i] || fallback[i]?.no || noLines[0] || fallback[0]?.no || "",
    en: enLines[i] || fallback[i]?.en || enLines[0] || fallback[0]?.en || "",
  }));
}

function pickTestimonialItems(
  noVal: string | null | undefined,
  enVal: string | null | undefined,
  fallback: Array<{ quote: LocaleText; author: LocaleText; service: LocaleText }>,
): Array<{ quote: LocaleText; author: LocaleText; service: LocaleText }> {
  const parse = (raw: string) =>
    raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [quote = "", author = "", service = ""] = line.split("|").map((s) => s.trim());
        return { quote, author, service };
      });

  const noItems = parse(noVal || "");
  const enItems = parse(enVal || "");
  if (noItems.length === 0 && enItems.length === 0) return fallback;

  const maxLen = Math.max(noItems.length, enItems.length, fallback.length);
  return Array.from({ length: maxLen }, (_, i) => ({
    quote: {
      no: noItems[i]?.quote || fallback[i]?.quote.no || "",
      en: enItems[i]?.quote || fallback[i]?.quote.en || "",
    },
    author: {
      no: noItems[i]?.author || fallback[i]?.author.no || "",
      en: enItems[i]?.author || fallback[i]?.author.en || "",
    },
    service: {
      no: noItems[i]?.service || fallback[i]?.service.no || "",
      en: enItems[i]?.service || fallback[i]?.service.en || "",
    },
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pageCopyFromSettingsDoc(doc: any, fallback: PageCopy): PageCopy {
  const meta = doc?.copyMeta;
  const nav = doc?.copyNav;
  const hero = doc?.copyHero;
  const sticky = doc?.copySticky;
  const services = doc?.copyServices;
  const calculator = doc?.copyCalculator;
  const references = doc?.copyReferences;
  const products = doc?.copyProducts;
  const faq = doc?.copyFaq;
  const testimonials = doc?.copyTestimonials;
  const newRoof = doc?.copyNewRoof;
  const about = doc?.copyAbout;
  const contact = doc?.copyContact;
  const footer = doc?.copyFooter;

  return {
    meta: {
      title: pickField(meta?.titleNo, meta?.titleEn, fallback.meta.title),
      description: pickField(meta?.descriptionNo, meta?.descriptionEn, fallback.meta.description),
    },
    nav: {
      home: pickField(nav?.homeNo, nav?.homeEn, fallback.nav.home),
      services: pickField(nav?.servicesNo, nav?.servicesEn, fallback.nav.services),
      references: pickField(nav?.referencesNo, nav?.referencesEn, fallback.nav.references),
      about: pickField(nav?.aboutNo, nav?.aboutEn, fallback.nav.about),
      products: pickField(nav?.productsNo, nav?.productsEn, fallback.nav.products),
      contact: pickField(nav?.contactNo, nav?.contactEn, fallback.nav.contact),
      contactUs: pickField(nav?.contactUsNo, nav?.contactUsEn, fallback.nav.contactUs),
      call: pickField(nav?.callNo, nav?.callEn, fallback.nav.call),
      menu: pickField(nav?.menuNo, nav?.menuEn, fallback.nav.menu),
      close: pickField(nav?.closeNo, nav?.closeEn, fallback.nav.close),
    },
    hero: {
      badge: pickField(hero?.badgeNo, hero?.badgeEn, fallback.hero.badge),
      title: pickField(hero?.titleNo, hero?.titleEn, fallback.hero.title),
      titleAccent: pickField(hero?.titleAccentNo, hero?.titleAccentEn, fallback.hero.titleAccent),
      subtitle: pickField(hero?.subtitleNo, hero?.subtitleEn, fallback.hero.subtitle),
      cta: pickField(hero?.ctaNo, hero?.ctaEn, fallback.hero.cta),
      ctaSecondary: pickField(hero?.ctaSecondaryNo, hero?.ctaSecondaryEn, fallback.hero.ctaSecondary),
      trustWarranty: pickField(hero?.trustWarrantyNo, hero?.trustWarrantyEn, fallback.hero.trustWarranty),
      trustCustomers: pickField(hero?.trustCustomersNo, hero?.trustCustomersEn, fallback.hero.trustCustomers),
      trustRating: pickField(hero?.trustRatingNo, hero?.trustRatingEn, fallback.hero.trustRating),
    },
    trustBar: {
      items: pickTypesList(
        doc?.copyTrustBar?.itemsNo,
        doc?.copyTrustBar?.itemsEn,
        fallback.trustBar.items,
      ),
    },
    sticky: {
      call: pickField(sticky?.callNo, sticky?.callEn, fallback.sticky.call),
      book: pickField(sticky?.bookNo, sticky?.bookEn, fallback.sticky.book),
    },
    services: {
      eyebrow: pickField(services?.eyebrowNo, services?.eyebrowEn, fallback.services.eyebrow),
      title: pickField(services?.titleNo, services?.titleEn, fallback.services.title),
      subtitle: pickField(services?.subtitleNo, services?.subtitleEn, fallback.services.subtitle),
      showMore: pickField(services?.showMoreNo, services?.showMoreEn, fallback.services.showMore),
      showLess: pickField(services?.showLessNo, services?.showLessEn, fallback.services.showLess),
    },
    calculator: {
      eyebrow: pickField(calculator?.eyebrowNo, calculator?.eyebrowEn, fallback.calculator.eyebrow),
      title: pickField(calculator?.titleNo, calculator?.titleEn, fallback.calculator.title),
      subtitle: pickField(calculator?.subtitleNo, calculator?.subtitleEn, fallback.calculator.subtitle),
      hint: pickField(calculator?.hintNo, calculator?.hintEn, fallback.calculator.hint),
      sizeLabel: pickField(calculator?.sizeLabelNo, calculator?.sizeLabelEn, fallback.calculator.sizeLabel),
      newRoof: pickField(calculator?.newRoofNo, calculator?.newRoofEn, fallback.calculator.newRoof),
      renewal: pickField(calculator?.renewalNo, calculator?.renewalEn, fallback.calculator.renewal),
      youSave: pickField(calculator?.youSaveNo, calculator?.youSaveEn, fallback.calculator.youSave),
      cheaper: pickField(calculator?.cheaperNo, calculator?.cheaperEn, fallback.calculator.cheaper),
      disclaimer: pickField(calculator?.disclaimerNo, calculator?.disclaimerEn, fallback.calculator.disclaimer),
      cta: pickField(calculator?.ctaNo, calculator?.ctaEn, fallback.calculator.cta),
    },
    newRoof: {
      eyebrow: pickField(newRoof?.eyebrowNo, newRoof?.eyebrowEn, fallback.newRoof.eyebrow),
      title: pickField(newRoof?.titleNo, newRoof?.titleEn, fallback.newRoof.title),
      subtitle: pickField(newRoof?.subtitleNo, newRoof?.subtitleEn, fallback.newRoof.subtitle),
      body: pickField(newRoof?.bodyNo, newRoof?.bodyEn, fallback.newRoof.body),
      typesTitle: pickField(newRoof?.typesTitleNo, newRoof?.typesTitleEn, fallback.newRoof.typesTitle),
      types: pickTypesList(newRoof?.typesNo, newRoof?.typesEn, fallback.newRoof.types),
      note: pickField(newRoof?.noteNo, newRoof?.noteEn, fallback.newRoof.note),
      cta: pickField(newRoof?.ctaNo, newRoof?.ctaEn, fallback.newRoof.cta),
    },
    references: {
      eyebrow: pickField(references?.eyebrowNo, references?.eyebrowEn, fallback.references.eyebrow),
      title: pickField(references?.titleNo, references?.titleEn, fallback.references.title),
      subtitle: pickField(references?.subtitleNo, references?.subtitleEn, fallback.references.subtitle),
      note: pickField(references?.noteNo, references?.noteEn, fallback.references.note),
      before: pickField(references?.beforeNo, references?.beforeEn, fallback.references.before),
      during: pickField(references?.duringNo, references?.duringEn, fallback.references.during),
      after: pickField(references?.afterNo, references?.afterEn, fallback.references.after),
      swipe: pickField(references?.swipeNo, references?.swipeEn, fallback.references.swipe),
    },
    about: {
      eyebrow: pickField(about?.eyebrowNo, about?.eyebrowEn, fallback.about.eyebrow),
      title: pickField(about?.titleNo, about?.titleEn, fallback.about.title),
      subtitle: pickField(about?.subtitleNo, about?.subtitleEn, fallback.about.subtitle),
      p1: pickField(about?.p1No, about?.p1En, fallback.about.p1),
      p2: pickField(about?.p2No, about?.p2En, fallback.about.p2),
      p3: pickField(about?.p3No, about?.p3En, fallback.about.p3),
      parent: pickField(about?.parentNo, about?.parentEn, fallback.about.parent),
      cta: pickField(about?.ctaNo, about?.ctaEn, fallback.about.cta),
      stats: [
        {
          title: pickField(about?.stat1TitleNo, about?.stat1TitleEn, fallback.about.stats[0].title),
          desc: pickField(about?.stat1DescNo, about?.stat1DescEn, fallback.about.stats[0].desc),
        },
        {
          title: pickField(about?.stat2TitleNo, about?.stat2TitleEn, fallback.about.stats[1].title),
          desc: pickField(about?.stat2DescNo, about?.stat2DescEn, fallback.about.stats[1].desc),
        },
        {
          title: pickField(about?.stat3TitleNo, about?.stat3TitleEn, fallback.about.stats[2].title),
          desc: pickField(about?.stat3DescNo, about?.stat3DescEn, fallback.about.stats[2].desc),
        },
        {
          title: pickField(about?.stat4TitleNo, about?.stat4TitleEn, fallback.about.stats[3].title),
          desc: pickField(about?.stat4DescNo, about?.stat4DescEn, fallback.about.stats[3].desc),
        },
      ],
      company: {
        title: pickField(about?.companyTitleNo, about?.companyTitleEn, fallback.about.company.title),
        org: pickField(about?.companyOrgNo, about?.companyOrgEn, fallback.about.company.org),
        phone: pickField(about?.companyPhoneNo, about?.companyPhoneEn, fallback.about.company.phone),
        email: pickField(about?.companyEmailNo, about?.companyEmailEn, fallback.about.company.email),
        address: pickField(about?.companyAddressNo, about?.companyAddressEn, fallback.about.company.address),
      },
    },
    products: {
      eyebrow: pickField(products?.eyebrowNo, products?.eyebrowEn, fallback.products.eyebrow),
      title: pickField(products?.titleNo, products?.titleEn, fallback.products.title),
      subtitle: pickField(products?.subtitleNo, products?.subtitleEn, fallback.products.subtitle),
      footer: pickField(products?.footerNo, products?.footerEn, fallback.products.footer),
    },
    faq: {
      eyebrow: pickField(faq?.eyebrowNo, faq?.eyebrowEn, fallback.faq.eyebrow),
      title: pickField(faq?.titleNo, faq?.titleEn, fallback.faq.title),
      subtitle: pickField(faq?.subtitleNo, faq?.subtitleEn, fallback.faq.subtitle),
    },
    testimonials: {
      eyebrow: pickField(
        testimonials?.eyebrowNo,
        testimonials?.eyebrowEn,
        fallback.testimonials.eyebrow,
      ),
      title: pickField(testimonials?.titleNo, testimonials?.titleEn, fallback.testimonials.title),
      items: pickTestimonialItems(
        testimonials?.itemsNo,
        testimonials?.itemsEn,
        fallback.testimonials.items,
      ),
    },
    contact: {
      eyebrow: pickField(contact?.eyebrowNo, contact?.eyebrowEn, fallback.contact.eyebrow),
      title: pickField(contact?.titleNo, contact?.titleEn, fallback.contact.title),
      subtitle: pickField(contact?.subtitleNo, contact?.subtitleEn, fallback.contact.subtitle),
      phone: pickField(contact?.phoneNo, contact?.phoneEn, fallback.contact.phone),
      hours: pickField(contact?.hoursNo, contact?.hoursEn, fallback.contact.hours),
      email: pickField(contact?.emailNo, contact?.emailEn, fallback.contact.email),
      reply: pickField(contact?.replyNo, contact?.replyEn, fallback.contact.reply),
      office: pickField(contact?.officeNo, contact?.officeEn, fallback.contact.office),
      form: {
        name: pickField(contact?.formNameNo, contact?.formNameEn, fallback.contact.form.name),
        email: pickField(contact?.formEmailNo, contact?.formEmailEn, fallback.contact.form.email),
        phone: pickField(contact?.formPhoneNo, contact?.formPhoneEn, fallback.contact.form.phone),
        address: pickField(contact?.formAddressNo, contact?.formAddressEn, fallback.contact.form.address),
        houseNumber: pickField(
          contact?.formHouseNumberNo,
          contact?.formHouseNumberEn,
          fallback.contact.form.houseNumber,
        ),
        postal: pickField(contact?.formPostalNo, contact?.formPostalEn, fallback.contact.form.postal),
        city: pickField(contact?.formCityNo, contact?.formCityEn, fallback.contact.form.city),
        type: pickField(contact?.formTypeNo, contact?.formTypeEn, fallback.contact.form.type),
        typeRenewal: pickField(
          contact?.formTypeRenewalNo,
          contact?.formTypeRenewalEn,
          fallback.contact.form.typeRenewal,
        ),
        typeNew: pickField(contact?.formTypeNewNo, contact?.formTypeNewEn, fallback.contact.form.typeNew),
        typeCladding: pickField(
          contact?.formTypeCladdingNo,
          contact?.formTypeCladdingEn,
          fallback.contact.form.typeCladding,
        ),
        message: pickField(contact?.formMessageNo, contact?.formMessageEn, fallback.contact.form.message),
        submit: pickField(contact?.formSubmitNo, contact?.formSubmitEn, fallback.contact.form.submit),
        sending: pickField(contact?.formSendingNo, contact?.formSendingEn, fallback.contact.form.sending),
        success: pickField(contact?.formSuccessNo, contact?.formSuccessEn, fallback.contact.form.success),
        error: pickField(contact?.formErrorNo, contact?.formErrorEn, fallback.contact.form.error),
        required: pickField(contact?.formRequiredNo, contact?.formRequiredEn, fallback.contact.form.required),
        invalidEmail: pickField(
          contact?.formInvalidEmailNo,
          contact?.formInvalidEmailEn,
          fallback.contact.form.invalidEmail,
        ),
        messageTooShort: pickField(
          contact?.formMessageTooShortNo,
          contact?.formMessageTooShortEn,
          fallback.contact.form.messageTooShort,
        ),
        messageHint: pickField(
          contact?.formMessageHintNo,
          contact?.formMessageHintEn,
          fallback.contact.form.messageHint,
        ),
      },
    },
    footer: {
      tagline: pickField(footer?.taglineNo, footer?.taglineEn, fallback.footer.tagline),
      partOf: pickField(footer?.partOfNo, footer?.partOfEn, fallback.footer.partOf),
      quickLinks: pickField(footer?.quickLinksNo, footer?.quickLinksEn, fallback.footer.quickLinks),
      contact: pickField(footer?.contactNo, footer?.contactEn, fallback.footer.contact),
      warrantyNote: pickField(footer?.warrantyNoteNo, footer?.warrantyNoteEn, fallback.footer.warrantyNote),
      rights: pickField(footer?.rightsNo, footer?.rightsEn, fallback.footer.rights),
    },
  };
}

export function localizeCopy(copy: PageCopy, locale: "no" | "en"): LocalizedCopy {
  return {
    meta: {
      title: pickText(copy.meta.title, locale),
      description: pickText(copy.meta.description, locale),
    },
    nav: {
      home: pickText(copy.nav.home, locale),
      services: pickText(copy.nav.services, locale),
      references: pickText(copy.nav.references, locale),
      about: pickText(copy.nav.about, locale),
      products: pickText(copy.nav.products, locale),
      contact: pickText(copy.nav.contact, locale),
      contactUs: pickText(copy.nav.contactUs, locale),
      call: pickText(copy.nav.call, locale),
      menu: pickText(copy.nav.menu, locale),
      close: pickText(copy.nav.close, locale),
    },
    hero: {
      badge: pickText(copy.hero.badge, locale),
      title: pickText(copy.hero.title, locale),
      titleAccent: pickText(copy.hero.titleAccent, locale),
      subtitle: pickText(copy.hero.subtitle, locale),
      cta: pickText(copy.hero.cta, locale),
      ctaSecondary: pickText(copy.hero.ctaSecondary, locale),
      trustWarranty: pickText(copy.hero.trustWarranty, locale),
      trustCustomers: pickText(copy.hero.trustCustomers, locale),
      trustRating: pickText(copy.hero.trustRating, locale),
    },
    trustBar: {
      items: copy.trustBar.items.map((item) => pickText(item, locale)),
    },
    sticky: {
      call: pickText(copy.sticky.call, locale),
      book: pickText(copy.sticky.book, locale),
    },
    services: {
      eyebrow: pickText(copy.services.eyebrow, locale),
      title: pickText(copy.services.title, locale),
      subtitle: pickText(copy.services.subtitle, locale),
      showMore: pickText(copy.services.showMore, locale),
      showLess: pickText(copy.services.showLess, locale),
    },
    calculator: {
      eyebrow: pickText(copy.calculator.eyebrow, locale),
      title: pickText(copy.calculator.title, locale),
      subtitle: pickText(copy.calculator.subtitle, locale),
      hint: pickText(copy.calculator.hint, locale),
      sizeLabel: pickText(copy.calculator.sizeLabel, locale),
      newRoof: pickText(copy.calculator.newRoof, locale),
      renewal: pickText(copy.calculator.renewal, locale),
      youSave: pickText(copy.calculator.youSave, locale),
      cheaper: pickText(copy.calculator.cheaper, locale),
      disclaimer: pickText(copy.calculator.disclaimer, locale),
      cta: pickText(copy.calculator.cta, locale),
    },
    newRoof: {
      eyebrow: pickText(copy.newRoof.eyebrow, locale),
      title: pickText(copy.newRoof.title, locale),
      subtitle: pickText(copy.newRoof.subtitle, locale),
      body: pickText(copy.newRoof.body, locale),
      typesTitle: pickText(copy.newRoof.typesTitle, locale),
      types: copy.newRoof.types.map((item) => pickText(item, locale)),
      note: pickText(copy.newRoof.note, locale),
      cta: pickText(copy.newRoof.cta, locale),
    },
    references: {
      eyebrow: pickText(copy.references.eyebrow, locale),
      title: pickText(copy.references.title, locale),
      subtitle: pickText(copy.references.subtitle, locale),
      note: pickText(copy.references.note, locale),
      before: pickText(copy.references.before, locale),
      during: pickText(copy.references.during, locale),
      after: pickText(copy.references.after, locale),
      swipe: pickText(copy.references.swipe, locale),
    },
    about: {
      eyebrow: pickText(copy.about.eyebrow, locale),
      title: pickText(copy.about.title, locale),
      subtitle: pickText(copy.about.subtitle, locale),
      p1: pickText(copy.about.p1, locale),
      p2: pickText(copy.about.p2, locale),
      p3: pickText(copy.about.p3, locale),
      parent: pickText(copy.about.parent, locale),
      cta: pickText(copy.about.cta, locale),
      stats: copy.about.stats.map((stat) => ({
        title: pickText(stat.title, locale),
        desc: pickText(stat.desc, locale),
      })),
      company: {
        title: pickText(copy.about.company.title, locale),
        org: pickText(copy.about.company.org, locale),
        phone: pickText(copy.about.company.phone, locale),
        email: pickText(copy.about.company.email, locale),
        address: pickText(copy.about.company.address, locale),
      },
    },
    products: {
      eyebrow: pickText(copy.products.eyebrow, locale),
      title: pickText(copy.products.title, locale),
      subtitle: pickText(copy.products.subtitle, locale),
      footer: pickText(copy.products.footer, locale),
    },
    faq: {
      eyebrow: pickText(copy.faq.eyebrow, locale),
      title: pickText(copy.faq.title, locale),
      subtitle: pickText(copy.faq.subtitle, locale),
    },
    testimonials: {
      eyebrow: pickText(copy.testimonials.eyebrow, locale),
      title: pickText(copy.testimonials.title, locale),
      items: copy.testimonials.items.map((item) => ({
        quote: pickText(item.quote, locale),
        author: pickText(item.author, locale),
        service: pickText(item.service, locale),
      })),
    },
    contact: {
      eyebrow: pickText(copy.contact.eyebrow, locale),
      title: pickText(copy.contact.title, locale),
      subtitle: pickText(copy.contact.subtitle, locale),
      phone: pickText(copy.contact.phone, locale),
      hours: pickText(copy.contact.hours, locale),
      email: pickText(copy.contact.email, locale),
      reply: pickText(copy.contact.reply, locale),
      office: pickText(copy.contact.office, locale),
      form: {
        name: pickText(copy.contact.form.name, locale),
        email: pickText(copy.contact.form.email, locale),
        phone: pickText(copy.contact.form.phone, locale),
        address: pickText(copy.contact.form.address, locale),
        houseNumber: pickText(copy.contact.form.houseNumber, locale),
        postal: pickText(copy.contact.form.postal, locale),
        city: pickText(copy.contact.form.city, locale),
        type: pickText(copy.contact.form.type, locale),
        typeRenewal: pickText(copy.contact.form.typeRenewal, locale),
        typeNew: pickText(copy.contact.form.typeNew, locale),
        typeCladding: pickText(copy.contact.form.typeCladding, locale),
        message: pickText(copy.contact.form.message, locale),
        submit: pickText(copy.contact.form.submit, locale),
        sending: pickText(copy.contact.form.sending, locale),
        success: pickText(copy.contact.form.success, locale),
        error: pickText(copy.contact.form.error, locale),
        required: pickText(copy.contact.form.required, locale),
        invalidEmail: pickText(copy.contact.form.invalidEmail, locale),
        messageTooShort: pickText(copy.contact.form.messageTooShort, locale),
        messageHint: pickText(copy.contact.form.messageHint, locale),
      },
    },
    footer: {
      tagline: pickText(copy.footer.tagline, locale),
      partOf: pickText(copy.footer.partOf, locale),
      quickLinks: pickText(copy.footer.quickLinks, locale),
      contact: pickText(copy.footer.contact, locale),
      warrantyNote: pickText(copy.footer.warrantyNote, locale),
      rights: pickText(copy.footer.rights, locale),
    },
  };
}
