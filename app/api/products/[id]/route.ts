import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/db";
import Product from "@/models/Product.model";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { id } = params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ error: "Invalid product ID" },
				{ status: 400 },
			);
		}

		await connectToDB();

		const product = await Product.findById(id).lean();
		console.log("Product in API call:", product);
		if (!product) {
			return NextResponse.json(
				{ error: "Product not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(product);
	} catch (error) {
		console.error("Error fetching product:", error);
		return NextResponse.json(
			{ error: "Failed to fetch product" },
			{ status: 500 },
		);
	}
}
