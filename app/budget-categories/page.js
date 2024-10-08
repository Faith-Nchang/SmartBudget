'use client';

import { useUser } from "@clerk/nextjs";

import { useEffect, useState } from "react";
import { doc, collection, writeBatch, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import { UserButton } from '@clerk/nextjs';
import db from "@/firebase";
import {
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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


export default function BudgetCategories() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [totalBudget, setTotalBudget] = useState(0.0);
  const [expenditure, setTotalExpenditure] = useState(0.0);
  const [totalCategories, setTotalCategories] = useState(0);
  const { isLoaded, isSignedIn, user } = useUser()

  const getTransactions = (categoryId) => {
    if(!categoryId) alert('errpr/')
    router.push(`/transactions?id=${categoryId}`);
  };

  // Add a new category
const addCategory = async (userId, categoryName) => {
  setCategory('');
  setTotalBudget(0.0);

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
    const userDocRef = doc(collection(db, 'users'), userId);

    const docSnap = await getDoc(userDocRef);

    // Check if the user document exists
    if (docSnap.exists()) {
      const categoryCollection = docSnap.data().budgetCategories || [];

      // Check if the category already exists in Firebase
      if (categoryCollection.find((category) => category.name === categoryName)) {
        alert("You already have an existing budget category with that name");
        return;
      } else {
        // Add the new category to the existing array in Firestore
        categoryCollection.push({ name: categoryName, total: totalBudget, expenditure: expenditure, createdAt: new Date() });
        batch.set(userDocRef, {budgetCategories: categoryCollection }, { merge: true });
      }
    } else {
      // If the document doesn't exist, create a new array with the category
      const newBudgetCategories = [{ name: categoryName, total: 0, createdAt: new Date() }];
      batch.set(userDocRef, { budgetCategories: newBudgetCategories });
    }


  

    // Commit the batch to Firestore
    await batch.commit();

    // Fetch updated categories and update the UI
    const fetchedCategories = await fetchCategories(userId);
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


  useEffect(() => {
    async function getCategories() {
      if (!user) 
      {
       return
      }
      const docRef = doc(collection(db, 'users'), user.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const budgets = docSnap.data().budgetCategories || []
        setCategories(budgets)
        console.log(budgets)
      } else {
        await setDoc(docRef, { budgetCategories: [] })
      }
    }
    getCategories()
  }, [user])

  // Fetch categories and listen for real-time updates
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.id);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const updatedCategories = docSnap.data().budgetCategories || [];
        setCategories(updatedCategories);
        console.log('Categories updated:', updatedCategories);
      } else {
        console.error('No categories found for user.');
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="budget" className="text-right">Total Budget</Label>
                    <Input
                      id="budget"
                      className="col-span-3"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(parseFloat(e.target.value))} 
                      placeholder="Enter budget"
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
                    <CardTitle>{cat.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      <p>Total Budget:<span className="text-green-400 pl-6">${cat.total} </span> </p>
                      <p>Current expenditures: <span className="text-green-400 pl-6">${cat.expenditure}</span></p>
                    </CardDescription>
                    <div className="mt-5">
                      <Button className="mb-5" onClick={() => getTransactions(cat.name)}>View Transactions</Button>
                      {
                      cat.total > cat.expenditure ? (
                        <p className="text-1xl"> You have <span className="text-green-400">${cat.total - cat.expenditure}</span> to reach your budget</p>
                      ) : (
                        <p className="text-red-400">You are currently at a {cat.total - cat.expenditure} budget. You need to be mindful of your expenditure</p>
                      )
                    }
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
