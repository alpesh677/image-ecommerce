import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import path from "path";

export default withAuth(

	function middleware(req) {
		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({ token,req }) => {
                const {pathname} = req.nextUrl;

                if(pathname.startsWith("/api/webhook")){
                    return true;
                }

                if(pathname.startsWith("/api/auth") || pathname === "/login" || pathname === "/register"){
                    return true;
                }

                if (
					pathname === "/" ||
					pathname.startsWith("/api/products") ||
					pathname.startsWith("/products")
				) {
					return true;
				}

                if (pathname.startsWith("/admin")) {
					return token?.role === "admin";
				}

                return !!token;
            }
		},
	},
);

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!_next/static|_next/image|favicon.ico|public/).*)",
	],
};
