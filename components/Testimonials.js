
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function Testimonials() {
    const testimonials = [
       
        {
          name: 'Faith Nchang',
          imgAlt: 'Faith testimonial',
          image: '/faith.jpg',
          description: '"This app has completely transformed how I manage my finances. Its intuitive design and powerful features make budgeting and tracking expenses effortless. It\'s a game-changer for anyone looking to get a handle on their finances!"',
        },
        {
            name: 'Faith Nchang',
            imgAlt: 'Real Time Monitoring',
            image: '',
            description: 'Track your debt instantly with live updates, ensuring you stay informed and in control of your finances.',
          },
    ]
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
      )
    
      return (
        <div className="flex  flex-col justify-center items-center mb-20">
            <h1 className="text-5xl gradientText font-bold text-center ">
                Testimonials
            </h1>
            <p className="text-center text-lg text-gray-700 mt-2 px-6 mb-12">
                Our app is trusted by many
            </p>

  <Carousel
    plugins={[plugin.current]}
    className="w-full max-w-md text-center"
    onMouseEnter={plugin.current.stop}
    onMouseLeave={plugin.current.reset}
  >
    <CarouselContent>
      {testimonials.map((testimonial, index) => (
        <CarouselItem key={index} className="flex justify-center">
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6 hover:bg-gray-900">
                <div className="flex flex-col items-center">
                    <Image src={testimonial.image} alt={testimonial.imgAlt} width={80} height={80} className="rounded-full"/>
                    <p className="text-green-500 text-3xl m-5">
                        {testimonial.name}
                    </p>
                    <span className="text-2xl font-semibold">{testimonial.description}</span>
                </div>
                
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</div>

      )
}

