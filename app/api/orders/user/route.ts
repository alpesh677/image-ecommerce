import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse,NextRequest } from "next/server";
import Order from "@/models/Order.model";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if(!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();
        const orders = await Order.find({ userID: session.user.id })
            .populate({
                path : "productID",
                select : "name imageUrl",
                options : {
                    strictQuery : false
                }
            })
            .sort({ createdAt : -1 })
            .lean();

            const validOrders = orders.map((order)=>({
                ...order,
                productID: order.productID || {
                    imageUrl: null,
                    name : "no product available"
                }
            }));

            return NextResponse.json(validOrders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}