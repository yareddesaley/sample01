'use client'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import Link from "next/link";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

interface ProductFormData {
  title: string;
  price: number;
  description: string;
  category: string;
  image?: string;
}

export default function Navbar() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const productData = {
        ...data,
        image: selectedImage || "https://via.placeholder.com/150"
      };

      const response = await axios.post('http://localhost:3001/products', productData);
      
      toast.success("Product created successfully", {
        description: `${data.title} has been added to your store`,
      });

      reset();
      setSelectedImage(null);
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to create product", {
        description: "There was an error while creating the product",
      });
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="shadow-md p-4 w-full mb-3 flex justify-between">
      <Link href="/">buyHere</Link>
      <NavigationMenu className="font-semibold">
        <Toaster richColors position="top-right" />
        <NavigationMenuList className="w-full">
          <NavigationMenuLink asChild>
            <Link href="/" className="px-4 py-2">Home</Link>
          </NavigationMenuLink>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white w-auto">
              <ul className="grid gap-3 p-4 w-[200px]">
                <li>
                  <Link href="/?category=electronics" className="block p-2 hover:bg-gray-100 rounded">
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link href="/?category=jewelery" className="block p-2 hover:bg-gray-100 rounded">
                    Jewelery
                  </Link>
                </li>
                <li>
                  <Link href="/?category=men's clothing" className="block p-2 hover:bg-gray-100 rounded">
                    Men's clothing
                  </Link>
                </li>
                <li>
                  <Link href="/?category=women's clothing" className="block p-2 hover:bg-gray-100 rounded">
                    Women's clothing
                  </Link>
                </li>
                <li>
                  <Link href="/" className="block p-2 hover:bg-gray-100 rounded">
                    All Categories
                  </Link>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Link href="/" className="px-4 py-2">Add Product</Link>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-black text-white">
                <DialogHeader>
                  <DialogTitle>Add Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new product.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="title">Product Name</Label>
                    <Input 
                      id="title" 
                      {...register("title", { required: "Product name is required" })}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm">{errors.title.message}</p>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="price">Price</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      {...register("price", { 
                        required: "Price is required",
                        min: { value: 0, message: "Price must be positive" }
                      })}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm">{errors.price.message}</p>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Input 
                      id="description" 
                      {...register("description", { required: "Description is required" })}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm">{errors.description.message}</p>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="image">Product Image</Label>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={triggerFileInput}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Image
                      </Button>
                      {selectedImage && (
                        <div className="mt-2">
                          <img 
                            src={selectedImage} 
                            alt="Preview" 
                            className="h-32 w-full object-contain rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="category">Category</Label>
                    <Input 
                      id="category" 
                      {...register("category", { required: "Category is required" })}
                    />
                    {errors.category && (
                      <p className="text-red-500 text-sm">{errors.category.message}</p>
                    )}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" type="button">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Product"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </NavigationMenuLink>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}