import type { CollectionConfig } from "payload";

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "phone", "postal", "inquiryType", "language", "createdAt"],
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email" },
    { name: "phone", type: "text", required: true },
    { name: "address", type: "text" },
    { name: "houseNumber", type: "text" },
    { name: "postal", type: "text", required: true },
    { name: "city", type: "text" },
    { name: "approxSqm", type: "number" },
    {
      name: "photoUrls",
      type: "textarea",
      admin: {
        description:
          "Lead photos from the website form. Previews work in admin; direct Blob links are private.",
        components: {
          Field: "/components/LeadPhotoUrlsField#LeadPhotoUrlsField",
        },
      },
    },
    {
      name: "inquiryType",
      type: "select",
      required: true,
      options: [
        { label: "Takvask", value: "takvask" },
        { label: "Impregnering", value: "impregnering" },
        { label: "Takmaling", value: "takmaling" },
        { label: "Nytt tak", value: "nytt_tak" },
        { label: "Usikker – taksjekk", value: "usikker" },
        // legacy values (existing leads)
        { label: "Renewal (legacy)", value: "vedlikehold" },
        { label: "Cladding (legacy)", value: "kledning" },
      ],
    },
    { name: "message", type: "textarea" },
    {
      name: "language",
      type: "select",
      required: true,
      options: [
        { label: "Norwegian", value: "no" },
        { label: "English", value: "en" },
      ],
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Qualified", value: "qualified" },
        { label: "Closed", value: "closed" },
      ],
    },
  ],
};
