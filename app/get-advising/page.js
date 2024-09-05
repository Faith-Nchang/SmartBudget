'use client';

import { useEffect, useState, useRef } from "react";
import { doc, collection, writeBatch, getDoc, updateDoc, increment } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import { SignedOut, SignedIn, UserButton, useUser } from '@clerk/nextjs';
import db from "@/firebase";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
  Bell,
  CornerDownLeft,
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
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/ui/sidebar";
import MobileNav from "@/components/ui/mobile-nav";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useUser();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${user?.firstName || 'there'}! I'm your personal financial advisor ready to help you make smart financial decisions and achieve a SmartBudget.`,
    },
  ]);

  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!userMessage.trim()) return; // Don't send empty messages
    setIsLoading(true);
  
    // Set initial state for user and assistant messages
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: '' }, // Placeholder for the assistant's response
    ]);
  
    setUserMessage('');
  
    try {
      // Fetch the response from your API route
      const response = await fetch('/api/financial_adivising', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: userMessage }]),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Read the streamed response from the API
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = ''; // Temporary buffer for the assistant's message
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break; // Exit the loop when done
  
        // Decode and append the partial response to the buffer
        assistantMessage += decoder.decode(value, { stream: true });
  
        // Temporarily store the message without updating state for each chunk
        setMessages((prevMessages) => {
          const otherMessages = prevMessages.slice(0, prevMessages.length - 1); // All messages except the last one
          return [
            ...otherMessages,
            { role: 'assistant', content: assistantMessage }, // Update only the last message
          ];
        });
      }
  
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
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
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Your Personal Financial Advisor</h1>
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className="p-3 text-white rounded-lg text-lg mb-5"
                    style={{
                      backgroundColor: message.role === 'assistant' ? 'green' : '#004d00',
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="sticky bottom-0 bg-muted/50 p-4">
              <form className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
                <Label htmlFor="message" className="sr-only">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                />
                <div className="flex items-center p-3 pt-0">
                  <Button type="button" size="sm" className="ml-auto gap-1.5" onClick={sendMessage}>
                    Send Message
                    <CornerDownLeft size={20} />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
