import type { CollectionConfig } from "payload";

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "inquiryType", "language", "createdAt"],
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text" },
    { name: "address", type: "text", required: true },
    { name: "houseNumber", type: "text", required: true },
    { name: "postal", type: "text", required: true },
    { name: "city", type: "text", required: true },
    {
      name: "inquiryType",
      type: "select",
      required: true,
      options: [
        { label: "Renewal", value: "vedlikehold" },
        { label: "New roof", value: "nytt_tak" },
        { label: "Cladding", value: "kledning" },
      ],
    },
    { name: "message", type: "textarea", required: true },
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
