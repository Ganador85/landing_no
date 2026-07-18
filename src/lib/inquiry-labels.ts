const LABELS_NO: Record<string, string> = {
  takvask: "Takvask",
  impregnering: "Impregnering",
  takmaling: "Takmaling",
  nytt_tak: "Nytt tak",
  usikker: "Usikker – taksjekk",
  vedlikehold: "Vedlikehold (eldre)",
  kledning: "Kledning (eldre)",
};

export function inquiryTypeLabelNo(type: string) {
  return LABELS_NO[type] || type;
}

export function languageLabelNo(locale: string) {
  return locale === "en" ? "Engelsk" : "Norsk";
}
