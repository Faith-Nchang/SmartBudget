'use client'
import * as React from "react"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"


import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Nav() {
  const { setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [state, setState] = React.useState(false);

     // Updated paths for the navigation
     const navigation = [
      { title: "Team", path: "/team" },
      { title: "Transcripts", path: "/transcripts" },
      { title: "Files", path: "/files" },
      { title: "Chat", path: "/chat" },
  ];

  return (
    <header className="">
        <nav className="w-full border-b md:border-0 md:static">
            <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8 justify-between">
                <div className="flex justify-between  md:block text-end">
                    <Link href="/" passHref>
                            <h1 className='font-bold text-5xl cursor-pointer'>
                            LOGO
                            </h1>
                    </Link>
                    <div className="md:hidden">
                        <button
                            className=" outline-none p-2 rounded-md focus:border"
                            onClick={() => setState(!state)}
                        >
                            {state ? <X size={24} /> : <Menu size={24} />} {/* Use Lucide's Menu and X icons */}
                        </button>
                    </div>
                </div>
                <div className={` justify-end md:w-full  pb-3 mt-8 md:block md:pb-0 md:mt-0 ${state ? 'block' : 'hidden'}`}>
                <ul className="justify-end items-center space-y-8 md:flex md:space-x-6 md:space-y-0">  
                  <li className="text-md font-medium">
                    <a href="#features">Features</a>
                  </li>
                  <li className="text-md font-medium">
                    <a href="#pricing">Pricing</a>
                  </li>
                  <li className="text-md font-medium">
                    <a href="#contact">Contact</a>
                  </li>
                  <li>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                          <span className="sr-only">Toggle theme</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                          Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                          Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                          System
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>

                  <li>
                    <Button>
                    Signin
                    </Button>
                    
                  </li>

                  <li>
                  <Button>
                    Sign Up
                    </Button>
                  </li>
                  
                </ul>
                </div>
            </div>
        </nav>
    </header>
  )
}
