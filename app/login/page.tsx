'use client'
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false
        });

        if(result?.error) {
            toast.error(result.error);
        }else{
            toast.success("Login successful");
            router.push("/");
        }
    }
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
			<div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl transform transition-all hover:scale-105 duration-300">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
						Sign in to your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
						Welcome back! Please enter your details
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm space-y-4">
						<div>
							<label htmlFor="email-address" className="sr-only">
								Email address
							</label>
							<input
								id="email-address"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-200"
								placeholder="Email address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="relative">
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								autoComplete="current-password"
								required
								className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-200"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-3 flex items-center"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeOffIcon className="h-5 w-5 text-gray-400" />
								) : (
									<EyeIcon className="h-5 w-5 text-gray-400" />
								)}
							</button>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
							/>
							<label
								htmlFor="remember-me"
								className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
							>
								Remember me
							</label>
						</div>

						<div className="text-sm">
							<a
								href="#"
								className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
							>
								Forgot your password?
							</a>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105"
						>
							Sign in
						</button>
					</div>
				</form>
				<div className="text-center">
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
						Don't have an account?{" "}
						<Link
							href="/register"
							className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-300"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
