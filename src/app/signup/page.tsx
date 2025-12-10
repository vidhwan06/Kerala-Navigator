import { SignupForm } from '@/components/auth/AuthForms';
import Link from 'next/link';

export default function SignupPage() {
    return (
        <div className="container mx-auto flex flex-col items-center justify-center min-h-[80vh] py-12">
            <div className="w-full max-w-md">
                <SignupForm />
                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
