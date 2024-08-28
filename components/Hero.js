import Image from 'next/image'
import { Button } from './ui/button'

export default function Home() {
  return (
<section className="flex flex-col lg:flex-row justify-between items-center pl-16 pr-20">
  <div className="flex flex-col gap-5 w-full lg:w-1/2 text-center lg:text-left">
    <h1 className="gradientText text-5xl font-bold italic">SmartBudget</h1>
    <h1 className="text-3xl text-green-400 mt-10 text-bold">Take Control of Your Credit Card Debt Today!</h1>
    <p className="text-2xl  mt-30 w-full">Track debt easily with real-time updates, interesting insights, personalized advice, and budget predictions!</p>
    
    <Button className="rounded-full bg-green-200 text-black text-1xl w-full lg:w-40 p-6 transition-all duration-300 transform hover:bg-green-400 hover:scale-105 hover:ring-4 hover:ring-green-300 hover:shadow-glow mt-8 mx-auto lg:mx-0" variant="secondary">
      Get started
    </Button>
  </div>
  
  <div className="hidden lg:block">
    <Image src={'/Mockup.png'} width={600} height={600} alt="Hero Img" className='rotate-y mt-8'/>
  </div>
</section>

  )
}
