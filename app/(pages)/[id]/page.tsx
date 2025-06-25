'use client'
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
}
    const [product, setProduct] = useState<Product>();

    const {id}=useParams();
    useEffect(()=>{
        axios.get(`http://localhost:3001/products/${id}`)
        .then((response) => {
            setProduct(response.data);
           
        }   
)
        .catch((error) => {
            console.error("Error fetching product details:", error);
        });
    }, [id]);

  return (
    <div className="flex items-center justify-center h-auto ">
        {
            product ? (
                <div className="max-w-md mt-5 p-6 bg-white shadow-md rounded-lg">
                    <h1 className="text-2xl font-bold">{product.title}</h1>
                    <p className="mt-2">{product.description}</p>
                    <p className="mt-2 font-bold">${product.price}</p>
                    <img src={product.image} alt={product.title} className="mt-4" />
                </div>
            ) : (
                <p>Loading...</p>
            )
        }
    </div>
  );
}