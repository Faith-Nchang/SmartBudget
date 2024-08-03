import Image from 'next/image'

export default function Features() {
  return (
    <section className='flex flex-col items-center gap-14'>
        <h1 className='text-3xl text-off-white'>Product Features</h1>

        <div className='flex flex-col items-center'>
            <div className='w-[60px] p-1 rounded-full bg-mint mb-3'>
                <Image src={'/clock_icon.png'} width={60} height={60} alt='Real Time Monitoring'/>
            </div>
            <h1 className='text-off-white text-lg font-medium'>Real Time Debt Tracking</h1>
            <p className='text-center text-md text-off-white mt-2'>            
                Track your debt instantly with live updates, ensuring you stay informed and in control of your finances.
            </p>
        </div>

        <div className='flex flex-col items-center'>
            <div className='w-[60px] p-1 rounded-full bg-mint mb-3'>
                <Image src={'/percent.png'} width={60} height={60} alt='Interest Calculations and Alerts'/>
            </div>
            <h1 className='text-off-white text-lg font-medium'>Interest Calculations and Alerts</h1>
            <p className='text-center text-md text-off-white mt-2'>            
            Get instant interest calculations and alerts, helping you manage costs and avoid unexpected charges.
            </p>
        </div>

        <div className='flex flex-col items-center'>
            <div className='w-[60px] p-1 rounded-full bg-mint mb-3'>
                <Image src={'/insights_icon.png'} width={60} height={60} alt='Magnifying glass'/>
            </div>
            <h1 className='text-off-white text-lg font-medium'>Personalized Financial Insights</h1>
            <p className='text-center text-md text-off-white mt-2'>            
            Receive personalized insights to optimize spending, helping you make smarter financial decisions daily.
            </p>
        </div>

        <div className='flex flex-col items-center'>
            <div className='w-[60px] p-1 rounded-full bg-mint mb-3'>
                <Image src={'/lock_icon.png'} width={60} height={60} alt='Secure Data Management'/>
            </div>
            <h1 className='text-off-white text-lg font-medium'>Secure Data Management</h1>
            <p className='text-center text-md text-off-white mt-2'>            
            Your data is protected with top-tier encryption, ensuring privacy and security in all your transactions.
            </p>
        </div>
        
    </section>
  )
}
