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

export default function Navbar() {
    return (
        <div className="shadow-md p-4 w-full mb-3 flex justify-between">
           <Link href="/">buyHere</Link>
            <NavigationMenu className="font-semibold">
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
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}