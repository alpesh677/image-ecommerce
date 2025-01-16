import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import Product, { IProduct } from "@/models/Product.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await connectToDB();

        const products = await Product.find({}).lean();

        if(!products || products.length === 0) {
            return NextResponse.json({ error: "No products found" }, { status: 404 });
        }

        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(req:NextRequest){
    try{
        const session = await getServerSession(authOptions);
        if(!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();
        const body:IProduct = await req.json();

        if (
			!body.name ||
			!body.imageUrl ||
			!body.variants ||
			body.variants.length === 0
		) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

        for(const variant of body.variants) {
            if(!variant.type || !variant.price || !variant.license) {
                return NextResponse.json(
                    { error: "Missing required fields" },
                    { status: 400 },
                );
            }
        }

        const newProduct = await Product.create(body);
        return NextResponse.json(newProduct);
    }catch(error){
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}