'use client';

import { useEffect, useState } from "react";
import { doc, collection, writeBatch, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import { UserButton, useUser } from '@clerk/nextjs';
import db from "@/firebase";
import {
  Search,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Sidebar from "@/components/ui/sidebar";
import MobileNav from "@/components/ui/mobile-nav";

// Mock Data
const mockCategories = [
  { id: 'Groceries', total: 0 },
  { id: 'Utilities', total: 0 },
  { id: 'Rent/Mortgage', total: 0 },
  { id: 'Transportation', total: 0 },
  { id: 'Entertainment', total: 0 },
  { id: 'Health & Wellness', total: 0 },
  { id: 'Education', total: 0 },
  { id: 'Dining Out', total: 0 },
  { id: 'Savings', total: 0 },
  { id: 'Miscellaneous', total: 0 }
];

export default function BudgetCategories() {
  const [categories, setCategories] = useState(mockCategories);
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [totalBudget, setTotalBudget] = useState(0.0);
  const [totalCategories, setTotalCategories] = useState(0);
  const user = useUser();

  const getTransactions = (categoryId) => {
    router.push(`/transactions?id=${categoryId}`);
  };

  // Add a new category
  const addCategory = async (userId, categoryName) => {

    if (!categoryName.trim()) {
      alert('Please enter the category name.');
      return;
    }
    if (!userId) {
      console.error('User ID is not defined.');
      return;
    }
    try {
      const batch = writeBatch(db);
      const userDocRef = doc(db, 'users', userId);
      const categoriesRef = collection(userDocRef, 'budgetCategories');
      const categoryDocRef = doc(categoriesRef, categoryName);
      batch.set(categoryDocRef, {
        name: categoryName,
        total: 0,
        createdAt: new Date(),
      });
      await batch.commit();
      const fetchedCategories = await fetchCategories(user.id);
      setCategories(fetchedCategories);
      console.log('Budget category successfully added with ID:', categoryName);
    } catch (error) {
      console.error('Error adding budget category:', error);
    } finally {
      setCategory('');
    }
  };

  // Fetch all categories
  const fetchCategories = async (userId) => {
    if (!userId) {
      console.error('User ID is not available.');
      return [];
    }
    try {
      const userDocRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        return userSnap.data().budgetCategories || [];
      } else {
        console.error('No categories found for user.');
        return [];
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  // Get all categories when the page loads
  useEffect(() => {
    async function getCategories() {
      if (!user?.id) {
        console.error('User ID is not available.');
        return;
      }
      try {
        const categories = await fetchCategories(user.id);
        if (categories.length > 0) {
          setCategories(categories);
        } else {
          // Set initial mock data if Firebase data is not available
          setCategories(mockCategories);
        }
      } catch (error) {
        console.error('Error getting categories:', error);
        setCategories(mockCategories);
      }
    }
    getCategories();
  }, [user]);

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
            <h1 className="text-lg font-semibold md:text-2xl text-green-500">Budget Categories</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add New Category</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>Add a new budget category</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="categoryName" className="text-right">Category Name</Label>
                    <Input
                      id="categoryName"
                      className="col-span-3"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Enter category name"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={() => addCategory(user.id, category)}>Add category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex justify-between flex-wrap items-center">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <Card key={cat.id} className="w-72 h-46 flex flex-col justify-between mb-5 ">
                  <CardHeader>
                    <CardTitle>{cat.id}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Total: ${cat.total}</CardDescription>
                    <div className="mt-5">
                      <Button onClick={() => getTransactions(cat.id)}>View Transactions</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No categories found.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
