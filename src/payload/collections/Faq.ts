import type { CollectionConfig } from "payload";

export const Faq: CollectionConfig = {
  slug: "faq",
  admin: {
    useAsTitle: "questionNo",
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "questionNo", type: "text", required: true },
    { name: "questionEn", type: "text", required: true },
    { name: "answerNo", type: "textarea", required: true },
    { name: "answerEn", type: "textarea", required: true },
    { name: "order", type: "number", defaultValue: 0 },
  ],
};
