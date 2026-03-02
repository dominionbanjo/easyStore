import { z } from "zod";

export const addProductSchema = z
  .object({
    /* ───────── BASIC INFO ───────── */
    name: z.string().min(3, "Product name must be at least 3 characters long"),

    category_id: z.string().min(1, "Please select a product category"),

    description: z.string().optional().nullable(),

    /* ───────── PRICING ───────── */
    price: z.coerce
      .number()
      .nonnegative("Price cannot be negative")
      .optional()
      .nullable(),

    discount_price: z.coerce
      .number()
      .nonnegative("Discount price cannot be negative")
      .optional()
      .nullable(),

    stock: z.coerce
      .number()
      .int("Stock must be a whole number")
      .nonnegative()
      .optional()
      .nullable(),

    /* ───────── SHIPPING (REQUIRED) ───────── */
    shipping_cost: z.coerce
      .number()
      .nonnegative("Shipping cost cannot be negative")
      .optional(),

    shipping_note: z.string().optional(),

    returns_note: z.string().optional(),

    /* ───────── OPTIONS & VARIANTS (CONDITIONAL) ───────── */
    options: z
      .array(
        z.object({
          name: z.string().min(1, "Option name is required"),
          values: z.array(z.string()).min(1, "At least one value is required"),
        }),
      )
      .optional()
      .nullable(),

    variants: z
      .array(
        z.object({
          sku: z.string().optional(),
          combinations: z.record(z.string(), z.string()),
          price: z.coerce
            .number()
            .nonnegative("Variant price cannot be negative"),
          stock: z.coerce
            .number()
            .int()
            .nonnegative("Stock cannot be negative"),
          discount_price: z.coerce.number().nonnegative().optional().nullable(),
        }),
      )
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    const hasVariants = data.variants && data.variants.length > 0;

    if (!hasVariants) {
      // Validate top-level price if no variants
      if (!data.price || data.price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Price must be greater than 0",
          path: ["price"],
        });
      }
      // Validate top-level stock if no variants
      if (!data.stock || data.stock <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Stock must be greater than 0",
          path: ["stock"],
        });
      }
    }
  });

/**
 * 🔹 INPUT type (what the form uses)
 */
export type AddProductFormInput = z.input<typeof addProductSchema>;

/**
 * 🔹 OUTPUT type (validated data)
 */
export type AddProductFormOutput = z.infer<typeof addProductSchema>;
