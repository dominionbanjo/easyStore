"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";

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
  const { register, handleSubmit, reset } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues,
  });

  const onSubmit = (data: ProductFormValues) => {
    if (images.length < 3) {
      toast.error("Please upload at least 3 images.");
      return;
    }
    console.log("Product submitted:", { ...data, images });
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
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditing ? "Edit Product" : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label>Product Name</Label>
          <Input placeholder="Enter product name" {...register("name")} />
        </div>

        <div>
          <Label>Price</Label>
          <Input type="text" placeholder="$120" {...register("price")} />
        </div>

        <div>
          <Label>Category</Label>
          <Input placeholder="e.g. Fashion" {...register("category")} />
        </div>

        <div>
          <Label>Description</Label>
          <Input
            placeholder="Write a short description..."
            {...register("description")}
          />
        </div>

        <div>
          <Label>Product Images (min 3)</Label>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />
          <div className="mt-3 flex flex-wrap gap-4">
            {images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-white rounded-full hover:bg-primary/90"
        >
          {isEditing ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </div>
  );
}
