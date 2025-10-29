import { z } from "zod";

/* ---------------- Schema ---------------- */
export const SignupSchema = z
  .object({
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone_number: z.string().min(7, "Enter a valid phone number"),
    account_type: z.enum(["user", "vendor"]),
    store_name: z.string().optional(),
    username: z.string().optional(),
    referral_code: z.string().optional(),
    current_sales_channel: z.string().optional(),
    agree_to_terms: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // 🧠 Ensure terms accepted
    if (!data.agree_to_terms) {
      ctx.addIssue({
        path: ["agree_to_terms"],
        message: "You must agree to the terms & conditions",
        code: z.ZodIssueCode.custom,
      });
    }

    // 🏪 Vendor-specific required fields
    if (data.account_type === "vendor") {
      if (!data.store_name || data.store_name.trim().length < 2) {
        ctx.addIssue({
          path: ["store_name"],
          message: "Store name is required for vendors",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.username || data.username.trim().length < 2) {
        ctx.addIssue({
          path: ["username"],
          message: "Username is required for vendors",
          code: z.ZodIssueCode.custom,
        });
      }

      if (
        !data.current_sales_channel ||
        data.current_sales_channel.trim().length < 2
      ) {
        ctx.addIssue({
          path: ["current_sales_channel"],
          message: "Please specify at least one sales channel",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export type SignupFormValues = z.infer<typeof SignupSchema>;
