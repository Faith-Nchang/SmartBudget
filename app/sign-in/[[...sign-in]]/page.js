'use client'
import { SignIn } from '@clerk/nextjs'; 
import { useRouter } from 'next/navigation';


export default function SignInPage() {

    const router = useRouter();
  
  return (
    <div className="flex items-center justify-center min-h-screen">
          <SignIn  />

    </div>
  );
}
