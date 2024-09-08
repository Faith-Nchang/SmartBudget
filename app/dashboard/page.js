'use client';

import { doc, collection, writeBatch, getDoc } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import { SignedOut, SignedIn, UserButton, useUser } from '@clerk/nextjs';
import db from "@/firebase";
import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin
import { CircularProgressbar, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels); // Register the plugin

import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/ui/sidebar";
import MobileNav from "@/components/ui/mobile-nav";


export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [financialData, setFinancialData] = useState('');
  const router = useRouter();
  const { user } = useUser()
  const [token, setToken] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setIsloading] = useState(false);

  const userName = user?.fullName || user?.firstName || user?.lastName || "User";

  // useEffect(() => {
  //   const createLinkToken = async () => {
  //     try {
  //       const response = await fetch('/api/create-link-token', {
  //         method: 'POST',
  //       });

  //       if (!response.ok) {
  //         throw new Error(response.error);
  //       }

  //       const { link_token } = await response.json();
  //       setToken(link_token);
  //       saveToken(user.id, link_token);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   createLinkToken();
  // }, []);

  // const onSuccess = useCallback(async (publicToken) => {
  //   await fetch('/api/exchange-public-token', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ public_token: publicToken }),
  //   });
  //   router.push('/budget-categories');
  // }, []);

  // const saveToken = async (userId, token) => {
  //   if (!token.trim()) {
  //     alert('No token generated');
  //     return;
  //   }
  //   if (!userId) {
  //     console.error('User ID is not defined.');
  //     return;
  //   }

  //   try {
  //     const batch = writeBatch(db);
  //     const userDocRef = doc(collection(db, 'users'), userId);

  //     const docSnap = await getDoc(userDocRef);

  //     if (docSnap.exists()) {
  //       batch.set(userDocRef, { public_token: token }, { merge: true });
  //     } else {
  //       batch.set(userDocRef, { public_token: token });
  //     }

  //     await batch.commit();
  //     console.log('Token saved successfully');
  //   } catch (error) {
  //     console.error('Error saving token:', error);
  //   }
  // };

  // const { open, ready } = usePlaidLink({
  //   token,
  //   onSuccess,
  // });

  


  const handleSubmit = async () => {
    setIsloading(true);

    try {
      // Wait for fetchCategories to complete and set categories
      const fetchedCategories = await fetchCategories(user.id);
      setCategories(fetchedCategories);


      // Generate the financial data string
      setFinancialData(concatenateCategories()); // Ensure categories is populated before this call

      // Fetch investments
      const response = await fetch('/api/get-investments', {
        method: 'POST',
        body: JSON.stringify({ query: `top 10 things an individual with the following financial budgets and expenditure compared to their budgets can make ${financialData}. in ${new Date().getFullYear}`}),
      });

      if (!response.ok) {
        throw new Error('Failed to generate investments');
      }

      const data = await response.json();
      setInvestments(data || []);
    } catch (error) {
      console.error('Error generating investments:', error);
      setInvestments([
        {
          "name": "TechGrowth Fund",
          "profits": 65,
          "losses": 35,
          "skillsRequired": ["Market Analysis", "Portfolio Management"],
          "howToGetStarted": "Research tech mutual funds, open a brokerage account, and invest in diversified tech-focused funds.",
          "advantages": "Potential for high growth, especially if the individual has a higher risk tolerance and is focused on long-term returns.",
          "risks": "Tech sector volatility could lead to significant short-term losses, especially for those with low diversification."
        },
        {
          "name": "Green Energy ETF",
          "profits": 70,
          "losses": 30,
          "skillsRequired": ["Sustainable Investing", "Basic Finance"],
          "howToGetStarted": "Open a brokerage account, choose an ETF focused on renewable energy, and make regular contributions.",
          "advantages": "Strong growth potential in the renewable energy sector, aligns with socially responsible investment goals.",
          "risks": "Dependent on government policies and public sentiment, could face downturns during economic slowdowns."
        },
        {
          "name": "Crypto Alpha",
          "profits": 80,
          "losses": 20,
          "skillsRequired": ["Blockchain Knowledge", "Risk Management"],
          "howToGetStarted": "Learn about cryptocurrencies, choose a secure exchange, and start with a small investment in leading cryptos.",
          "advantages": "High potential for rapid gains, fits those with higher disposable income and a willingness to take significant risks.",
          "risks": "Highly volatile market, can result in large and sudden losses, requires constant monitoring."
        },
        {
          "name": "Real Estate Trust",
          "profits": 60,
          "losses": 40,
          "skillsRequired": ["Real Estate Valuation", "Long-term Investing"],
          "howToGetStarted": "Research REITs, open an investment account, and select a REIT that fits your financial goals.",
          "advantages": "Stable income and diversification, ideal for those seeking regular passive income with moderate risk.",
          "risks": "Real estate market downturns or rising interest rates can negatively impact returns."
        },
        {
          "name": "BlueChip Stock Fund",
          "profits": 75,
          "losses": 25,
          "skillsRequired": ["Stock Market Basics", "Equity Analysis"],
          "howToGetStarted": "Open a brokerage account, select a portfolio of blue-chip stocks, and make regular investments.",
          "advantages": "Lower risk compared to smaller companies, steady growth for those with long-term financial stability.",
          "risks": "Lower potential for rapid gains, dependent on general market conditions."
        }
      ]
      )
    } finally {
      setIsloading(false);
    
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
  const concatenateCategories = () => {
    let result = '';
    categories.forEach(category => {
      result += `Name: ${category.name}\nTotal Budget: ${category.total}\nTotal Expenditure: ${category.expenditure}\n\n`;
    });
    return result;
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
          <div className="flex items-center justify-between flex-wrap">
            <h1 className="text-lg font-semibold md:text-2xl pr-1">Welcome {userName} to SmartBudget</h1>
            <Button onClick={handleSubmit}>Generate investments</Button>
            {/* <Button className="mt-4" onClick={() => open()} disabled={!ready}>Link bank account</Button> */}
          </div>

          <div className="p-4 space-y-6">
          {loading ? (
          <div className="flex items-center justify-center">
            <CircularProgressbar
            value={50} // Example value
            text={`Loading...`}
            strokeWidth={10}
            styles={buildStyles({
              pathColor: '#4caf50', // Green color
              textColor: '#4caf50', // Green color
              trailColor: '#d6d6d6', // Light grey color for the background
            })}
            className="w-24 h-24" // Adjust size as needed
      />
          </div>
        ) : (
          investments.map((investment, index) => (
            <div key={index} className="flex flex-wrap items-center justify-between space-x-4 p-4 rounded-lg shadow-md">
  <div className="w-48 h-48">
    <Pie
      data={{
        labels: ['Profits', 'Losses'],
        datasets: [{
          data: [investment.profits, investment.losses],
          backgroundColor: ['#4caf50', '#f44336'],
        }],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}%`,
            },
          },
          datalabels: {
            color: '#fff',
            display: true,
            formatter: (value) => `${value}%`,
            font: {
              weight: 'bold',
              size: 14,
            },
            anchor: 'center',
            align: 'center',
          },
        },
      }}
    />
  </div>
  <div className="flex-1 min-w-[200px]">
    <h2 className="text-lg font-semibold mb-2 text-3xl">{investment.name}</h2>
    <p className="text-gray-400"><strong className='text-green-200'>Skills Required:</strong> {investment.skillsRequired.join(', ')}</p>
    <p className="text-gray-400 mt-2"><strong className='text-green-200'>How to Get Started:</strong> {investment.howToGetStarted}</p>
    <p className="text-gray-400 mt-2"><strong className='text-green-200'>Advantages based on your financial standing:</strong> {investment.advantages}</p>
    <p className="text-gray-400 mt-2"><strong className='text-green-200'>Risks based on your financial profile:</strong> {investment.risks}</p>
  </div>
</div>

          
          ))
        )}
      </div>
        </main>
      </div>
    </div>
  );
}
