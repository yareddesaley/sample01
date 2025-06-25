'use client';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

export default function Page() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    
    useEffect(() => {
        axios.get<Product[]>("https://fakestoreapi.com/products")
        .then((response) => {
            setAllProducts(response.data);
        })
        .catch((error) => {
            console.error("Error fetching products:", error);
        });
    }, []); 

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2  w-full">
            {allProducts.map((product) => (
                <Card key={product.id} className="h-full w-full">
                    <CardHeader>
                        <h2 className="text-lg font-semibold line-clamp-2">{product.title}</h2>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <img 
                            src={product.image} 
                            alt={product.title} 
                            className="w-full h-32 object-contain"
                        />
                    </CardContent>
                    <CardFooter className="flex flex-col items-start gap-2">
                        <p className="font-bold">${product.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600 line-clamp-3">
                            {product.description}
                        </p>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}