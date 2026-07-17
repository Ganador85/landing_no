export const siteConfig = {
  name: "Takfornyelse",
  domain: "takfornyelse.no",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phone: "+47 47 73 66 69",
  phoneHref: "tel:+4747736669",
  email: "post@takfornyelse.no",
  address: {
    street: "Nesbruveien 75",
    postal: "1394",
    city: "Nesbru",
    country: "NO",
  },
  orgNr: "916 693 168",
  parentOrg: "Fornyingsgruppen AS",
  locales: ["no", "en"] as const,
  defaultLocale: "no" as const,
  calculator: {
    minSqm: 50,
    maxSqm: 500,
    defaultSqm: 150,
    newRoofPerSqm: 2490,
    renewalPerSqm: 350,
  },
  trust: {
    sqmRenewed: "2.000.000+",
    warrantyYears: 10,
    happyCustomers: "500+",
    rating: "4.9/5",
  },
};

export type Locale = (typeof siteConfig.locales)[number];
