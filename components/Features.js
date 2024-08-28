import Image from 'next/image'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  

export default function Features() {
  const features = [
    {
      imgSrc: '/clock_icon.png',
      imgAlt: 'Real Time Monitoring',
      title: 'Real Time Debt Tracking',
      description: 'Track your debt instantly with live updates, ensuring you stay informed and in control of your finances.',
    },
    {
      imgSrc: '/percent.png',
      imgAlt: 'Interest Calculations and Alerts',
      title: 'Interest Calculations and Alerts',
      description: 'Get instant interest calculations and alerts, helping you manage costs and avoid unexpected charges.',
    },
    {
      imgSrc: '/insights_icon.png',
      imgAlt: 'Magnifying glass',
      title: 'Personalized Financial Insights',
      description: 'Receive personalized insights to optimize spending, helping you make smarter financial decisions daily.',
    },
    {
      imgSrc: '/lock_icon.png',
      imgAlt: 'Secure Data Management',
      title: 'Secure Data Management',
      description: 'Your data is protected with top-tier encryption, ensuring privacy and security in all your transactions.',
    },
    {
        imgSrc: '/budget_icon.png', // Replace with the actual path to the icon
        imgAlt: 'Budgeting and Spending Analysis',
        title: 'Budgeting and Spending Analysis',
        description: 'Gain insights into your spending habits with detailed budgeting analysis. Set custom budgets, track your expenses, and receive tailored advice.',
      },
      {
        imgSrc: '/scheduler_icon.png', // Replace with the actual path to the icon
        imgAlt: 'Debt Payment Scheduler',
        title: 'Debt Payment Scheduler',
        description: 'Plan and schedule your debt payments with ease. Receive reminders for upcoming payments and visualize your debt repayment progress.',
      },
  ];

  return (
    <section className='flex flex-col items-center gap-5'>
  <div>
    <h1 className='text-5xl gradientText font-bold mb-10'>Product Features</h1>
  </div>
  
  <Carousel
  opts={{
    align: "start",
  }}
  className="w-full max-w-md md:max-w-lg lg:max-w-3xl mx-auto"
>
  <CarouselContent>
    {features.map((feature, index) => (
      <CarouselItem key={index} className="w-full md:basis-1/2 lg:basis-1/2 p-2 mr-5">
        <div className="flex flex-col items-center bg-green-800 p-8 rounded-lg text-center w-full lg:max-w-sm mx-auto h-full"> {/* Fixed height */}
        <div className="w-[60px] p-1 rounded-full bg-mint mb-3 bg-green-300 text-white">
            <Image src={feature.imgSrc} width={60} height={60} alt={feature.imgAlt} />
          </div>
          <h1 className="text-white text-2xl font-medium">{feature.title}</h1>
          <p className="text-md text-off-white mt-2">
            {feature.description}
          </p>
        </div>
      </CarouselItem>
    ))}
  </CarouselContent >
  <CarouselPrevious className="bg-green-900 text-white text-2xl"/>
  <CarouselNext className="bg-green-900 text-white text-2xl" />
</Carousel>


    
</section>
  )}