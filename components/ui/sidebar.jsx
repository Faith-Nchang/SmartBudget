import { usePathname } from 'next/navigation';
import Link from "next/link";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Smart Budget</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
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
              href="/dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                pathname === "/subscriptions" ? "bg-muted text-primary" : "text-muted-foreground"
              }`}
            >
              <Users className="h-4 w-4" />
              Subscriptions
            </Link>
            <Link
              href="/budget-categories"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                pathname === "/bills-and-depts" ? "bg-muted text-primary" : "text-muted-foreground"
              }`}
            >
              <LineChart className="h-4 w-4" />
              Bills and Debts
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card x-chunk="dashboard-02-chunk-0">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full" onClick={() => alert('Feature coming soon')}>
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </aside>
  );
}
