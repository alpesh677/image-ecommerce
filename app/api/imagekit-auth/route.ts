import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";

const imagekit = new ImageKit({
	publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
	privateKey: process.env.PRIVATE_KEY!,
	urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function GET(request: NextRequest) {
	try {
		const authenticateParameters = imagekit.getAuthenticationParameters();
		return NextResponse.json(authenticateParameters);
	} catch (error) {
		console.error("ImageKit auth error:", error);
		return NextResponse.json(
			{ error: "Failed to get Imagekit authentication parameters" },
			{ status: 500 },
		);
	}
}
