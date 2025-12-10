import { LoginForm } from '@/components/auth/AuthForms';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="container mx-auto flex flex-col items-center justify-center min-h-[80vh] py-12">
            <div className="w-full max-w-md">
                <LoginForm />
                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-primary hover:underline font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
