'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import Sidebar from '@/components/ui/sidebar';
import MobileNav from '@/components/ui/mobile-nav';

import {
    File,
    Home,
    LineChart,
    ListFilter,
    MoreHorizontal,
    Package,
    Package2,
    PanelLeft,
    PlusCircle,
    Search,
    Settings,
    ShoppingCart,
    Users2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import Link from 'next/link';

// Mock Data
const mockTransactions = [
    {
        id: '1',
        name: 'Grocery Shopping',
        amount: 150.50,
        dateCreated: new Date(), // Mock date
    },
    {
        id: '2',
        name: 'Electricity Bill',
        amount: 75.20,
        dateCreated: new Date(), // Mock date
    },
    {
        id: '3',
        name: 'Internet Subscription',
        amount: 60.00,
        dateCreated: new Date(), // Mock date
    },
];

export default function Transactions() {
    const [userTransactions, setUserTransactions] = useState([]);
    const [totalBudget, setTotalBudget] = useState(0.0);
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();

    useEffect(() => {
        const fetchTransactions = async () => {
            if (isLoaded && isSignedIn && user) {
                try {
                    // Use mock data for development
                    const transactions = mockTransactions;

                    let total = 0.0;
                    transactions.forEach((transaction) => {
                        total += transaction.amount;
                    });

                    setUserTransactions(transactions);
                    setTotalBudget(total);
                } catch (error) {
                    console.error('Error fetching transactions:', error);
                }
            } else {
                router.push('/login'); // Adjust the route as necessary
            }
        };

        fetchTransactions();
    }, [isLoaded, isSignedIn, user, router]);

    if (isLoaded && !isSignedIn) {
        router.push('/');
    }

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <MobileNav /> {/* Make sure MobileNav is imported and defined */}
                    <div className="w-full flex-1">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search transactions..."
                                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                                />
                            </div>
                        </form>
                    </div>
                    <UserButton />
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    <Breadcrumb className="hidden md:flex">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="#">Dashboard</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="#">Transactions</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>All Transactions</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1>Total Budget: ${totalBudget.toFixed(2)}</h1>

                    <ul>
                        {userTransactions.map((transaction) => (
                            <li key={transaction.id}>
                                {transaction.name} - ${transaction.amount} (Date: {transaction.dateCreated.toLocaleDateString()})
                            </li>
                        ))}
                    </ul>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction Name</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="hidden md:table-cell">Date</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell className="font-medium">{transaction.name}</TableCell>
                                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge variant="outline">{transaction.dateCreated.toLocaleDateString()}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </main>
            </div>
        </div>
    );
}
