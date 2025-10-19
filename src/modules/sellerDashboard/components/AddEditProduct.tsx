"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import UploadArea from "@/components/shared/UploadArea";

const ProductSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  price: z.string().min(1, "Price is required"),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(10, "Description is too short"),
});

type ProductFormValues = z.infer<typeof ProductSchema>;

export default function AddEditProductForm({
  defaultValues,
  isEditing = false,
}: {
  defaultValues?: ProductFormValues;
  isEditing?: boolean;
}) {
  const [images, setImages] = useState<File[]>([]);
  const { register, handleSubmit, reset, formState } =
    useForm<ProductFormValues>({
      resolver: zodResolver(ProductSchema),
      defaultValues,
    });

  const { errors } = formState;

  const onSubmit = (data: ProductFormValues) => {
    if (images.length < 3) {
      toast.error("Please upload at least 3 images.");
      return;
    }

    console.log("Submitted Product:", { ...data, images });

    toast.success(
      isEditing
        ? "Product updated successfully!"
        : "Product added successfully!"
    );

    reset();
    setImages([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }
    setImages([...images, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        {isEditing ? "Edit Product" : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Product Name */}
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">Product Name</Label>
          <Input
            placeholder="Enter product name"
            {...register("name")}
            className="rounded-md h-11"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">Price</Label>
          <Input
            type="text"
            placeholder="$120"
            {...register("price")}
            className="rounded-md h-11"
          />
          {errors.price && (
            <p className="text-red-500 text-xs">{errors.price.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">Category</Label>
          <Input
            placeholder="e.g. Fashion, Electronics"
            {...register("category")}
            className="rounded-md h-11"
          />
          {errors.category && (
            <p className="text-red-500 text-xs">{errors.category.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">Description</Label>
          <textarea
            {...register("description")}
            placeholder="Write a short description..."
            className="w-full h-28 border rounded-md p-3 resize-none focus:ring-2 focus:ring-primary focus:outline-none"
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>

        {/* Image Upload Section */}
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">
            Product Images (min 3)
          </Label>

          <UploadArea
            id="product-images"
            label="Upload Product Images"
            onChange={handleImageUpload}
          />

          {images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {images.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded-lg border shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-primary text-white rounded-full py-3 text-base font-medium hover:bg-primary/90 transition"
        >
          {isEditing ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </div>
  );
}
