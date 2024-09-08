'use client'
import React, { useState, useEffect, useTransition } from 'react';
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
  
    MoreHorizontal,
    Search,
    
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Label } from '@radix-ui/react-dropdown-menu';
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
import Sidebar from '@/components/ui/sidebar';
import MobileNav from '@/components/ui/mobile-nav';

import Link from 'next/link';

export default function Transactions() {
    const [userTransactions, setUserTransactions] = useState([]); // Mock data initialization

    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();

    const [total, setTotal] = useState(0.0);
    const [category, setCategory] = useState('');

    const [transaction, setTransaction] = useState('');
    const [amount, setAmount] = useState(0.0);


    const searchParams = useSearchParams() 
    const search = searchParams.get('id');
    

    if (isLoaded && !isSignedIn) {
        router.push('/');
      }

      useEffect(() => {
        async function getTransactions() {
            if (!search || !user) {
                return
            }




            if (!search || !user) return
            setCategory(search)  // Store the collection name in state


            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const transactions = []
            let total = 0.0;
            docs.forEach((doc) => {
                transactions.push({ id: doc.id, ...doc.data() })
                total+=doc.data().amount;
            })

          
            setUserTransactions(transactions)
            setTotal(total);

        }
        getTransactions()
    }, [search, user])

   
    const getTransactions =  async () => {
        if (!search || !user) return;
    
        setCategory(search); // Store the collection name in state
    
        try {
            const colRef = collection(doc(collection(db, 'users'), user.id), search);
            const docs = await getDocs(colRef);
            const transactions = [];
            let total = 0.0;
    
            docs.forEach((doc) => {
                const data = doc.data();
                transactions.push({ id: doc.id, ...data });
                total += data.amount; // Assuming `amount` is a field in your transaction documents
            });
    
            setUserTransactions(transactions);
            setTotal(total);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

   //ed out
    if (isLoaded && !isSignedIn) {
        router.push('/');
    }

    

    const addTransaction = async (userId, categoryName, transaction) => {
        setTransaction('');
        setAmount(0.0);

        if (!categoryName.trim()) {
          alert('Please enter the category name.');
          return;
        }
        if (!userId) {
          console.error('User ID is not defined.');
          return;
        }
        if (!transaction || !transaction.name || !transaction.amount || !transaction.createdAt) {
          console.error('Transaction data is incomplete.');
          return;
        }
      
        try {
          const batch = writeBatch(db);
          const userDocRef = doc(collection(db, 'users'), userId);
      
          const docSnap = await getDoc(userDocRef);
      
          if (docSnap.exists()) {
            const categoryCollection = docSnap.data().budgetCategories || [];
      
            if (categoryCollection.find((category) => category.name === categoryName)) {
              const columnRef = collection(userDocRef, categoryName);
      
              // Check if a transaction with the same name already exists
              const querySnapshot = await getDocs(columnRef);
              let existingTransactionDocRef = null;
              let updatedTotal = 0.0;
      
              querySnapshot.forEach((doc) => {
                const transactionData = doc.data();
                if (transactionData.name === transaction.name) {
                  existingTransactionDocRef = doc.ref;
                  // Increment the amount of the existing transaction
                  batch.update(existingTransactionDocRef, {
                    amount: transactionData.amount + transaction.amount,
                  });
                } else {
                  // Accumulate the total amount for recalculation
                  updatedTotal += transactionData.amount;
                }
              });
      
              if (!existingTransactionDocRef) {
                // Create a new transaction if none exists with the same name
                const newTransactionRef = doc(columnRef);
                batch.set(newTransactionRef, transaction);
              }
      
              // Recalculate total expenditure
              updatedTotal += transaction.amount; // Include new or updated transaction amount
      
              // Update the total expenditure in the category
              const updatedCategories = categoryCollection.map((cat) =>
                cat.name === categoryName ? { ...cat, expenditure: updatedTotal } : cat
              );
      
              batch.set(userDocRef, { budgetCategories: updatedCategories }, { merge: true });
      
              // Commit the batch to Firestore
              await batch.commit();
      
              // Fetch updated categories and update the UI
              await getTransactions();
      
              console.log('Transaction successfully added or updated.');
            } else {
              console.log("Category not found.");
            }
          } 
        } catch (error) {
          console.error('Error adding transaction:', error);
        }
      };
      

          
      
      const deleteTransaction = async (userId, categoryName, transaction, location) => {
        if (!userId) {
          console.error('User ID is not defined.');
          return;
        }
        if (!categoryName) {
          console.error('Category Name is not defined.');
          return;
        }
        if (!transaction || !transaction.name) {
          console.error('Transaction data is incomplete.');
          return;
        }

        let confirmation = false;
        if (location == "updated"){
            alert("Transaction successfully updated");
            confirmation = true;
          }
          else{
            confirmation = window.confirm("Are you sure you want to delete this?");
            
        }
        if (confirmation){
            try {
                const batch = writeBatch(db);
                const userDocRef = doc(collection(db, 'users'), userId);
            
                const docSnap = await getDoc(userDocRef);
            
                if (docSnap.exists()) {
                  const categoryCollection = docSnap.data().budgetCategories || [];
            
                  // Check if the category exists
                  const category = categoryCollection.find((cat) => cat.name === categoryName);
                  if (category) {
                    const columnRef = collection(userDocRef, categoryName);
            
                    // Find and delete the transaction by its name
                    const querySnapshot = await getDocs(columnRef);
                    let updatedTotal = 0.0;
            
                    querySnapshot.forEach((doc) => {
                      const transactionData = doc.data();
                      if (transactionData.name === transaction.name) {
                        batch.delete(doc.ref);
                      } else {
                        // Accumulate the total amount for recalculation
                        updatedTotal += transactionData.amount;
                      }
                    });
            
                    // Recalculate total expenditure
                    const updatedCategories = categoryCollection.map((cat) =>
                      cat.name === categoryName ? { ...cat, expenditure: updatedTotal } : cat
                    );
            
                    // Update the user's budgetCategories with the new total
                    batch.set(userDocRef, { budgetCategories: updatedCategories }, { merge: true });
            
                    // Commit the batch to Firestore
                    await batch.commit();
            
                    // Fetch updated categories and update the UI
                    await getTransactions();
            
                    console.log('Transaction successfully deleted.');

                    if (location == "main"){
                        alert("Transaction sucessfully deleted")
                    }
                   
                  } else {
                    console.log("Category not found.");
                  }
                } 
              } catch (error) {
                console.error('Error deleting transaction:', error);
              }
            };

          
        }
       
      
    const updateTransaction = async (userId, categoryId, updatedTransaction) => {
        if (!userId) {
            console.error('User ID is not defined.');
            return;
          }
          if (!categoryId) {
            console.error('Category Name is not defined.');
            return;
          }
          if (!updatedTransaction) {
            console.error('Transaction data is incomplete.');
            return;
          
        }

        deleteTransaction(userId, categoryId, updateTransaction, 'updated');
        addTransaction(userId, categoryId);

    };

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <MobileNav />
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  />
                </div>
              </form>
            </div>
            <UserButton />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">

          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl ">Total expenditure for {category}:<span className='text-green-500 text-5xl pl-10'>${total}</span> </h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() =>{ setTransaction(''); setAmount(0.0)}}>Add New Transaction</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                  <DialogDescription>Add a new transaction for this category</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="transaction" className="text-right">Transaction Name: </Label>
                    <Input
                      id="transaction"
                      className="col-span-3"
                      value={transaction}
                      onChange={(e) => setTransaction(e.target.value)}
                      placeholder="Enter transaction name"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">Total Budget</Label>
                    <Input
                      id="amount"
                      className="col-span-3"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value))} 
                      placeholder="Enter amout"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={() => addTransaction(user.id, category, {name: transaction, amount: amount, createdAt: new Date()})}>Add transaction</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
                

          <Table>
    <TableHeader>
        <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
            </TableHead>
            <TableHead>Transaction Name</TableHead>
            <TableHead>Budget Amount</TableHead>
            <TableHead className="hidden md:table-cell">Created At</TableHead>
            <TableHead>Actions</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        {userTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
                <TableCell className="hidden w-[100px] sm:table-cell">
                    {/* Placeholder for Image if needed */}
                </TableCell>
                <TableCell className="font-medium">{transaction.name}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
                <TableCell className="hidden md:table-cell">
                    {new Date(transaction.createdAt.seconds * 1000).toLocaleDateString()}
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
                            <DropdownMenuItem> 
  <Dialog>
    <DialogTrigger asChild>
      <Button  className="w-full"
        onClick={(e) => {
          e.stopPropagation(); // Prevent dropdown from closing
          setTransaction(transaction.name); 
          setAmount(transaction.amount);
        }}
      >
        Edit
      </Button>
    </DialogTrigger>

    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogDescription>Update the transaction for this category</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="transaction" className="text-right">Transaction Name:</Label>
          <Input
            id="transaction"
            className="col-span-3"
            value={transaction}
            onChange={(e) => setTransaction(e.target.value)}
            placeholder="Enter transaction name"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="amount" className="text-right">Total Budget</Label>
          <Input
            id="amount"
            className="col-span-3"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            placeholder="Enter amount"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" onClick={() => { updateTransaction(user.id, category, { name: transaction, amount: amount, createdAt: new Date() }) }}>
          Edit transaction
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</DropdownMenuItem>

                            <DropdownMenuItem> <Button className="w-full" onClick={()=>{deleteTransaction(user.id,category,transaction, "main")}}> Delete </Button></DropdownMenuItem>
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
