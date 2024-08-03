'use client'

export default function Nav() {
  return (
    <header className="w-full grid grid-cols-2">
      <div className="w-1/3 text-off-white text-3xl font-bold">LOGO</div>
      <nav className="hidden md:flex md:justify-end md:w-full">
          <ul className="text-off-white flex items-center gap-8">  
            <li className="text-md font-medium">Features</li>
            <li className="text-md font-medium">Pricing</li>
            <li className="text-md font-medium">Contact</li>
            <li className="py-3 px-5 text-lg bg-mint rounded-full shadow-md">Join the Wait</li>
          </ul>
      </nav>
    </header>
  )
}
