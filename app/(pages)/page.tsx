'use client';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

function ProductList() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const productsPerPage = 8;
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors },
    setValue
  } = useForm<Product>();

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>("http://localhost:3001/products");
      setAllProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (category) {
      const filtered = allProducts.filter(product => product.category === category);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
    setCurrentPage(1);
  }, [category, allProducts]);

  const handleDelete = async () => {
    if (productToDelete) {
      try {
        await axios.delete(`http://localhost:3001/products/${productToDelete}`);
        fetchProducts(); 
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const onSubmit = async (data: Product) => {
    try {
      await axios.put(`http://localhost:3001/products/${data.id}`, data);
      fetchProducts(); 
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const openEditDialog = (product: Product) => {
    setValue('id', product.id);
    setValue('title', product.title);
    setValue('price', product.price);
    setValue('description', product.description);
    setValue('image', product.image);
    setValue('category', product.category);
    setEditDialogOpen(true);
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2 w-full">
        {currentProducts.map((product) => (
          <Card key={product.id} className="h-full w-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <h2 className="text-lg font-semibold line-clamp-2">{product.title}</h2>
            </CardHeader>
            <CardContent 
              className="flex justify-center cursor-pointer"
              onClick={() => router.push(`/${product.id}`)}
            >
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-32 object-contain"
              />
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
              <p className="font-bold">${product.price}</p>
              <p className="text-sm text-gray-600 line-clamp-3">
                {product.description}
              </p>
              <div className="flex gap-2 mt-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditDialog(product);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProductToDelete(product.id);
                    setDeleteDialogOpen(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-black text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 cursor-pointer">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={editDialogOpen} onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) reset();
      }}>
        <AlertDialogContent className="bg-black text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Product</AlertDialogTitle>
          </AlertDialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register('id')} />
            
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                {...register('image', { 
                  required: 'Image URL is required',
                  pattern: {
                    value: /^(https?:\/\/).+$/i,
                    message: 'Please enter a valid URL starting with http:// or https://'
                  }
                })}
              />
              {errors.image && <p className="text-sm text-red-500">{errors.image.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                {...register('category', { required: 'Category is required' })}
              />
              {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <Button type="submit">Save Changes</Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {totalPages > 1 && (
        <Pagination className="my-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(index + 1);
                  }}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductList />
    </Suspense>
  );
}