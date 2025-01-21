"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function ThemeSwitch() {
	const [mounted, setMounted] = useState(false);
	const { setTheme, resolvedTheme } = useTheme();

	useEffect(() => setMounted(true), []);

	if (!mounted)
		return (
			<Image
				src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
				width={36}
				height={36}
				sizes="36x36"
				alt="Loading Light/Dark Toggle"
				priority={false}
				title="Loading Light/Dark Toggle"
			/>
		);

	if (resolvedTheme === "dark") {
		return (
			<div
				className="p-2 cursor-pointer rounded-full font-outfit text-blue-900 dark:text-blue-950 bg-blue-100 dark:bg-white dark:hover:bg-blue-300 hover:bg-blue-200 transition duration-700 ease-in-out my-auto"
				onClick={() => setTheme("light")}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					className="w-5"
					onClick={() => setTheme("light")}
				>
					<path d="M12 3v1"></path>
					<path d="M12 20v1"></path>
					<path d="M3 12h1"></path>
					<circle cx="12" cy="12" r="4"></circle>
					<path d="M20 12h1"></path>
					<path d="m18.364 5.636-.707.707"></path>
					<path d="m6.343 17.657-.707.707"></path>
					<path d="m5.636 5.636.707.707"></path>
					<path d="m17.657 17.657.707.707"></path>
				</svg>
			</div>
		);
	}

	if (resolvedTheme === "light") {
		return (
			<div
				className="p-2 cursor-pointer rounded-full font-outfit text-blue-900 dark:text-blue-100 bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 hover:bg-blue-200 transition duration-700 ease-in-out my-auto"
				onClick={() => setTheme("dark")}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					className="w-5"
					onClick={() => setTheme("dark")}
				>
					<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
					<path d="M19 3v4"></path>
					<path d="M21 5h-4"></path>
				</svg>
			</div>
		);
	}
}
