'use client';

import { useEffect, useState, useRef } from "react";
import { doc, collection, writeBatch, getDoc, updateDoc, increment } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import { SignedOut, SignedIn, UserButton, useUser } from '@clerk/nextjs';
import db from "@/firebase";
import { Label } from "@/components/ui/label"



import Link from "next/link"
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
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import Sidebar from "@/components/ui/sidebar";
import MobileNav from "@/components/ui/mobile-nav";


export default function Dashboard() {
  const router = useRouter();
  const user = useUser();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${user.name}! I'm your personal financial advisor ready to help you make smart financial decisions and achieve a SmartBudget`
    }
  ])

  const [userMessage, setUserMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  // const { data: session, status } = useSession()
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

 
  const sendMessage = async () => {
    console.log(process.env.OPENAI_API_KEY);
    if (!userMessage.trim()) return // Don't send empty messages
    setUserMessage('')
    setIsLoading(true)
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: '' },
    ])
    try {
      const response = await fetch('/api/financial-advising', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later."},
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <MobileNav /> {/* Corrected component name */}
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
           
            <div className="flex-1">
            {messages.map((message, index) => (
            <div
              key={index}
              display="flex"
              justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              <div
                    className="p-3 text-white rounded-lg text-lg"
                    style={{
                        backgroundColor: message.role === 'assistant' ? '#00FF00' : '#004d00' // Custom colors
                    }}
                >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
            </div>
            <form
              className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring" x-chunk="dashboard-03-chunk-1"
            >
              <Label htmlFor="message" className="sr-only">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                label="Message"
                // fullWidth
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center p-3 pt-0">
              
                
                <Button type="submit" size="sm" className="ml-auto gap-1.5" onClick={sendMessage}>
                  Send Message
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
