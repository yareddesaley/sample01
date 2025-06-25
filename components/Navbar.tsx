import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import Link from "next/link";
export default function Navbar() {
    return (
        <div className="shadow-md p-4 w-full mb-3 flex justify-between">
            <div>
               buyHere
            </div>
            <NavigationMenu className="font-semibold">
  <NavigationMenuList className=" w-full">
    <NavigationMenuLink asChild >
            <Link href="/docs">Home</Link>
          </NavigationMenuLink>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
      <NavigationMenuContent className="bg-white w-[300px]">
                   <ul className="grid gap-4 w-full bg-white">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="#">
                    <div className="font-medium">Electronics</div>
                    
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#">
                    <div className="font-medium">Jewellery</div>
                    
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#">
                    <div className="font-medium">Cloths</div>
                   
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>

      </NavigationMenuContent>
    </NavigationMenuItem>
    {/* <NavigationMenuItem>
      <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink>Link</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem> */}
  </NavigationMenuList>
</NavigationMenu>
        </div>
    );
}