import { z } from "zod";

/**
 * Safe numeric preprocessor — converts any empty / null / NaN input to 0
 * before Zod validates. This prevents the "expected number, received NaN"
 * error that occurs when the user clears a number input field.
 */
const safeNum = (rules: z.ZodNumber = z.number()) =>
  z.coerce.number().pipe(rules);

export const addProductSchema = z
  .object({
    id: z.string().optional(),
    /* ───────── BASIC INFO ───────── */
    name: z.string().min(3, "Product name must be at least 3 characters long"),

    category_id: z.string().min(1, "Please select a product category"),

    description: z.string().optional().nullable(),

    barcode: z.string().max(100).optional().nullable(),

    /* ───────── PRICING ───────── */
    price: safeNum(z.number().nonnegative("Price cannot be negative"))
      .optional()
      .nullable(),

    discount_price: safeNum(
      z.number().nonnegative("Discount price cannot be negative"),
    )
      .optional()
      .nullable(),

    stock: safeNum(z.number().int("Stock must be a whole number").nonnegative())
      .optional()
      .nullable(),

    /* ───────── SHIPPING (OPTIONAL) ───────── */
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
          id: z.string().uuid().optional(),
          sku: z.string().optional(),
          image_url: z.string().optional().nullable(),
          image_public_id: z.string().optional().nullable(),
          combinations: z.record(z.string(), z.string()),
          price: safeNum(
            z.number().nonnegative("Variant price cannot be negative"),
          ),
          stock: safeNum(
            z.number().int().nonnegative("Stock cannot be negative"),
          ),
          discount_price: safeNum(z.number().nonnegative())
            .optional()
            .nullable(),
        }),
      )
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    const hasVariants = data.variants && data.variants.length > 0;

    if (!hasVariants) {
      // Validate top-level price if no variants
      if (data.price === undefined || data.price === null || data.price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Price must be greater than 0",
          path: ["price"],
        });
      }
      // Validate top-level stock if no variants (Allow 0)
      if (data.stock === undefined || data.stock === null || data.stock < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Stock cannot be negative",
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
