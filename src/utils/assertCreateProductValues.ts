type RequiredCreateFields = {
  price: number;
  stock: number;
};

export function assertCreateProductValues(
  values: Partial<RequiredCreateFields>,
): asserts values is RequiredCreateFields {
  if (values.price == null) {
    throw new Error("Price is required");
  }

  if (values.stock == null) {
    throw new Error("Stock is required");
  }
}
