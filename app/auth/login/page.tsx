'use client';

import { signUpWithGoogle } from '../actions';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full text-center">
                <h1 className="text-4xl font-bold text-neutral-800 dark:text-white mb-4">Welcome Back</h1>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8">Sign in to continue to your study hub.</p>
                <form action={signUpWithGoogle}>
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-neutral-200 dark:border-neutral-700"
                    >
                        <FcGoogle size={24} />
                        <span>Sign in with Google</span>
                    </button>
                </form>
            </div>
        </div>
    );
}