import { z } from "zod";

export const addProductSchema = z.object({
  /* ───────── BASIC INFO ───────── */
  name: z.string().min(3, "Product name must be at least 3 characters long"),

  category_id: z.string().min(1, "Please select a product category"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),

  /* ───────── PRICING ───────── */
  price: z.coerce
    .number()
    .positive("Price must be greater than 0")
    .min(1, "Price is required"),

  discount_price: z.coerce
    .number()
    .nonnegative("Discount price cannot be negative")
    .optional()
    .nullable(),

  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .positive("Stock must be greater than 0"),

  // /* ───────── SHIPPING (REQUIRED) ───────── */
  // shipping_cost: z
  //   .number()
  //   .refine((v) => v >= 0, "Shipping cost cannot be negative"),

  // shipping_note: z
  //   .string()
  //   .min(3, "Shipping note must be at least 3 characters long"),

  // returns_note: z
  //   .string()
  //   .min(5, "Returns policy must be at least 5 characters long"),

  /* ───────── COLORS (OPTIONAL) ───────── */
  colors: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        hex: z.string(),
      }),
    )
    .optional(),
});

/**
 * 🔹 INPUT type (what the form uses)
 */
export type AddProductFormInput = z.input<typeof addProductSchema>;

/**
 * 🔹 OUTPUT type (validated data)
 */
export type AddProductFormOutput = z.infer<typeof addProductSchema>;
