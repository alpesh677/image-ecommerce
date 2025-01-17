import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest,NextResponse } from "next/server";
import Razorpay from "razorpay";
import Order from "@/models/Order.model";

const razorpay = new Razorpay({
	key_id: "YOUR_KEY_ID",
	key_secret: "YOUR_KEY_SECRET",
});

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if(!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productID, variant } = await req.json();
        await connectToDB();

        const order = await razorpay.orders.create({
            amount : Math.round(variant.price * 100),
            currency : "USD",
            receipt : `receipt_${Date.now()}`,
            notes:{
                productID : productID.toString(),
            }
        });

        const newOrder = await Order.create({
			userID: session.user.id,
			productID,
			variant,
			price: variant.price,
			razorpayOrderId: order.id,
			amount: Math.round(variant.price * 100),
			status: "PENDING",
		});

        return NextResponse.json({
            orderID : order.id,
            amount : Math.round(variant.price * 100),
            currency : order.currency,
            dbOrderID : newOrder._id
        })
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}