import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "./db";
import bcrypt from "bcryptjs";
import User from "@/models/User.model";

if(!process.env.NEXTAUTH_SECRET) {
    throw new Error("NEXTAUTH_SECRET is not defined");
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "abc@gmail.com",
				},
				password: {
					label: "Password",
					type: "password",
					placeholder: "Enter your password",
				},
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) {
					throw new Error("Missing credentials");
				}

				console.log("Email:", credentials.email);

				try {
					await connectToDB();
					const user = await User.findOne({
						email: credentials.email,
					});
					console.log("User fetched:", user);

					if (!user) {
						throw new Error("User not found");
					}

					const isValid = await bcrypt.compare(
						credentials.password,
						user.password,
					);
					console.log("Password valid:", isValid);

					if (!isValid) {
						throw new Error("Invalid password");
					}
					return {
						id: user._id.toString(),
						role: user.role,
						email: user.email,
					};
				} catch (error) {
					console.error("Auth error:", error);
					throw error;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
            console.log("JWT Callback - Token:", token, "User:", user);
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
            if (session.user) {
                console.log(
                    "Session Callback - Session:",
                    session,
                    "Token:",
                    token,
                );
				session.user.id = token.id as string;
				session.user.role = token.role as string;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
		error: "/login",
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60,
	},
	secret: process.env.NEXTAUTH_SECRET,
};
