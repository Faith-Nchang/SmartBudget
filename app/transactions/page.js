'use client'
import React, { useState, useEffect } from 'react';
import { doc, collection, writeBatch, getDoc, updateDoc, increment, getDocs, query } from 'firebase/firestore';
import db from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import { useRouter, useSearchParams } from "next/navigation";


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

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
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function Transactions() {
    const [userTransactions, setUserTransactions] = useState([
        {
            id: '1',
            name: 'Grocery Shopping',
            amount: 50.75,
            dateCreated: new Date(),
        },
        {
            id: '2',
            name: 'Electricity Bill',
            amount: 120.99,
            dateCreated: new Date(),
        },
        {
            id: '3',
            name: 'Subscription Service',
            amount: 15.00,
            dateCreated: new Date(),
        },
    ]); // Mock data initialization

    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();

    const [totalBudget, setTotalBudget] = useState(0.0);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (isLoaded && isSignedIn && user) {
                try {
                    const userId = user.id;

                    // Reference to the specific category's transactions collection
                    const transactionsRef = collection(db, 'users', userId, 'budgetCategories', 'categoryId', 'transactions');
                    const q = query(transactionsRef);
                    const querySnapshot = await getDocs(q);

                    const transactions = [];
                    let total = 0.0;

                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        transactions.push({
                            ...data,
                            id: doc.id, // include the document ID for future reference
                        });
                        total += data.amount; // Assuming `amount` is a field in your transaction documents
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

    // redirects the user to the home page when logged out
    if (isLoaded && !isSignedIn) {
        router.push('/');
    }

    // add a new transaction to a specific category
    const addTransaction = async (userId, categoryId, transaction) => {
        const batch = writeBatch(db);

        const userDocRef = doc(db, 'users', userId);
        const categoryDocRef = doc(collection(userDocRef, 'budgetCategories'), categoryId);
        const transactionsRef = collection(categoryDocRef, 'transactions');

        // Add the transaction
        const transactionDocRef = doc(transactionsRef);
        batch.set(transactionDocRef, transaction);

        // Update the category total
        const categorySnap = await getDoc(categoryDocRef);
        const categoryData = categorySnap.data();
        const newTotal = (categoryData.total || 0) + transaction.amount;
        batch.update(categoryDocRef, { total: newTotal });

        // Update the user's total budget
        const userSnap = await getDoc(userDocRef);
        const userData = userSnap.data();
        const newUserTotal = (userData.totalBudget || 0) + transaction.amount;
        batch.update(userDocRef, { totalBudget: newUserTotal });

        await batch.commit();
    };

    // delete a specific transaction
    const deleteTransaction = async (userId, categoryId, transactionId) => {
        const batch = writeBatch(db);

        const userDocRef = doc(db, 'users', userId);
        const categoryDocRef = doc(collection(userDocRef, 'budgetCategories'), categoryId);
        const transactionDocRef = doc(collection(categoryDocRef, 'transactions'), transactionId);

        // Get the transaction details
        const transactionSnap = await getDoc(transactionDocRef);
        const transactionData = transactionSnap.data();

        if (transactionData) {
            // Remove the transaction
            batch.delete(transactionDocRef);

            // Update the category total
            batch.update(categoryDocRef, {
                total: increment(-transactionData.amount),
            });

            // Update the user's total budget
            batch.update(userDocRef, {
                totalBudget: increment(-transactionData.amount),
            });

            await batch.commit();
        } else {
            console.error('Transaction not found');
        }
    };

    // update a transaction
    const updateTransaction = async (userId, categoryId, transactionId, updatedTransaction) => {
        const batch = writeBatch(db);

        const userDocRef = doc(db, 'users', userId);
        const categoryDocRef = doc(collection(userDocRef, 'budgetCategories'), categoryId);
        const transactionDocRef = doc(collection(categoryDocRef, 'transactions'), transactionId);

        // Get the old transaction details
        const transactionSnap = await getDoc(transactionDocRef);
        const oldTransactionData = transactionSnap.data();

        if (oldTransactionData) {
            const oldAmount = oldTransactionData.amount;
            const newAmount = updatedTransaction.amount;

            // Update the transaction document with new details
            batch.update(transactionDocRef, updatedTransaction);

            // Adjust the category total
            batch.update(categoryDocRef, {
                total: increment(newAmount - oldAmount), // Adjust category total
            });

            // Adjust the user's total budget
            batch.update(userDocRef, {
                totalBudget: increment(newAmount - oldAmount), // Adjust user total budget
            });

            await batch.commit();
        } else {
            console.error('Transaction not found');
        }
    };

    return (
        <div>
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
                            <Link href="#">Products</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>All Products</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1>Total Budget for Category: ${totalBudget.toFixed(2)}</h1>
            {/* Render userTransactions here */}
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
                        <TableHead className="hidden w-[100px] sm:table-cell">
                            <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Transaction Name</TableHead>
                        <TableHead>Budget amount </TableHead>
                        <TableHead className="hidden md:table-cell">Created at</TableHead>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {userTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell className="font-medium">{transaction.name}</TableCell>
                            <TableCell className="hidden md:table-cell">${transaction.amount}</TableCell>
                            <TableCell>
                                <Badge variant="outline">(Date: {transaction.dateCreated.toLocaleDateString()})</Badge>
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
        </div>
    );
}
