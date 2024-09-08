'use client'

import { SignUp } from '@clerk/nextjs'; 
import { useRouter } from 'next/navigation';


export default function SignUpPage() {

    const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen">
        <SignUp  />

    </div>
  );
}
