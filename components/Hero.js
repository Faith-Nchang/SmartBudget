import Image from 'next/image'

export default function () {
  return (
    <section className="h-vh flex flex-col items-center">
      <div className="text-off-white flex flex-col gap-5">
          <h1 className="text-2xl text-center text-mint">Take Control of Your Credit Card Debt Today!</h1>
          <Image src={'/Mockup.png'} width={500} height={500} alt="Hero Img" className=''/>

          <p className="text-md text-center">Track debt easily with real-time updates, interesting insights, and personalized advice. Join the wait to gain control and achieve financial freedom today!</p>
          
          <input name="email" id="email" type="email" placeholder="Email goes here..." className="p-2 rounded-md outline focus:outline-mint"/>
          <button className="w-full py-2 text-lg rounded-md bg-mint shadow-md">Join the Wait</button>
      </div>
    </section>
  )
}
