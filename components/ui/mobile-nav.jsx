import Link from "next/link";
import { usePathname } from 'next/navigation'; // Import usePathname
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function MobileNav() {
  const pathname = usePathname(); // Get the current pathname

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              pathname === "/dashboard" ? "bg-muted text-primary" : "text-muted-foreground"
            }`}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/budget-categories"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              pathname === "/budget-categories" ? "bg-muted text-primary" : "text-muted-foreground"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            Budgets
          </Link>
          <Link
            href="/get-advising"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              pathname === "/get-advising" ? "bg-muted text-primary" : "text-muted-foreground"
            }`}
          >
            <Package className="h-4 w-4" />
            Get Financial Advising
          </Link>
          <Link
            href="/subscriptions"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              pathname === "/subscriptions" ? "bg-muted text-primary" : "text-muted-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            Subscriptions
          </Link>
          <Link
            href="/bills-and-depts"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              pathname === "/bills-and-depts" ? "bg-muted text-primary" : "text-muted-foreground"
            }`}
          >
            <LineChart className="h-4 w-4" />
            Bills and Debts
          </Link>
        </nav>
        <div className="mt-auto">
          <Card>
            <CardHeader>
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="sm" className="w-full" onClick={() => alert('Feature coming soon')}>
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
