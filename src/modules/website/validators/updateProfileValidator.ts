import { z } from "zod";

export const EditProfileSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  phone_number: z.string().optional(),

  username: z.string().min(3).optional(),
  address: z
    .object({
      city: z.string().min(1),
      state: z.string().min(1),
      country: z.string().min(1),
      street: z.string().min(1),
      postal_code: z.string().min(1),
    })
    .optional(),

  // Bank Info
  bank_code: z.string().optional().or(z.literal("")),
  account_number: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || val.length === 10, {
      message: "Account number must be 10 digits",
    }),

  avatar: z.any().optional(), // handled via FormData
});

export type EditProfileFormValues = z.infer<typeof EditProfileSchema>;
