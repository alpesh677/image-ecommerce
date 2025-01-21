"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import { Home, Sun, User } from "lucide-react";
import ThemeSwitch from "./ThemeSwitch";

export default function Header() {
	const { data: session } = useSession();

	console.log("session in headers ",session)
	const handleSignOut = async () => {
		try {
			await signOut();
			toast.success("Signed out successfully");
		} catch (error) {
			toast.error("Failed to sign out");
		}
	};

	return (
		<header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-sky-200 bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-[#000000]/60">
			<div className="container mx-auto">
				<div className="py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
					<div className="flex items-center">
						<Link
							href="/"
							className="flex items-center space-x-2 text-xl font-bold text-slate-900 dark:text-[#b0a3f0]"
							onClick={() => {
								toast.info("Welcome to the ImageKit Shop!!");
							}}
						>
							<Home className="h-6 w-6" />
							<span>ImageKit Shop</span>
						</Link>
					</div>

					<div className="flex items-center space-x-4">
						<ThemeSwitch />
						<div className="relative">
							<button
								type="button"
								className="flex items-center space-x-1 text-slate-700 dark:text-sky-600 hover:text-slate-900 dark:hover:text-sky-400 font-semibold text-xl"
								onClick={() =>
									document
										.getElementById("user-menu")
										?.classList.toggle("hidden")
								}
							>
								<User className="h-6 w-6" />
								<span className="hidden sm:inline">
									{session
										? session.user.email?.split("@")[0]
										: "Guest"}
								</span>
							</button>
							<div
								id="user-menu"
								className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 hidden"
							>
								{session ? (
									<>
										<p className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300">
											{session.user.email}
										</p>
										<hr className="border-slate-200 dark:border-slate-700" />
										{session.user?.role === "admin" && (
											<Link
												href="/admin"
												className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
												onClick={() =>
													toast.info(
														"Welcome to Admin Dashboard",
													)
												}
											>
												Admin Dashboard
											</Link>
										)}
										<Link
											href="/orders"
											className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
										>
											My Orders
										</Link>
										<button
											type="button"
											onClick={handleSignOut}
											className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
										>
											Sign Out
										</button>
									</>
								) : (
									<Link
										href="/login"
										className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
										onClick={() =>
											toast.info(
												"Please login to continue",
											)
										}
									>
										Login
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
