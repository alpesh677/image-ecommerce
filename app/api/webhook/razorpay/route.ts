import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDB } from "@/lib/db";
import Order from "@/models/Order.model";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
	try {
		const body = await req.text();
		const signature = req.headers.get("x-razorpay-signature");

		const expectedSignature = crypto
			.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
			.update(body)
			.digest("hex");

		if (signature !== expectedSignature) {
			return NextResponse.json(
				{ error: "Invalid signature" },
				{ status: 400 },
			);
		}

		const event = JSON.parse(body);
		await connectToDB();

		if (event.event === "payment.captured") {
			const payment = event.payload.payment.entity;

			console.log("Payment captured:", payment);

			const order = await Order.findOneAndUpdate(
				{ razorpayOrderId: payment.order_id }, // Query by Razorpay order ID
				{ razorpayPaymentId: payment.id, status: "COMPLETED" }, // Update fields
				{ new: true }, // Return the updated document
			).populate([
				{ path: "productID", select: "name" },
				{ path: "userID", select: "email" },
			]);


			console.log("ORDER IN PAYMENT CAPTURED", order);
			if (order) {
				const transporter = nodemailer.createTransport({
					service: "gmail",
					auth: {
						user: process.env.SMTP_USER,
						pass: process.env.SMTP_PASS,
					},
				});
				await transporter.sendMail({
					from: '"ImageKit Shop" <noreply@gmail.com>',
					to: payment.email,
					subject: "Payment Confirmation - ImageKit Shop",
					text: `
                                Thank you for your purchase!
        
                                Order Details:
                                - Order ID: ${order._id.toString().slice(-6)}
                                - Product: ${order.productID.name}
                                - Version: ${order.variant.type}
                                - License: ${order.variant.license}
                                - Price: $${order.amount.toFixed(2)}
        
                                Your image is now available in your orders page.
                                Thank you for shopping with ImageKit Shop!
                            `.trim(),
				});
			}
		}

        return NextResponse.json({received : true});
	} catch (error) {
        console.error("Razorpay webhook error:", error);
        return NextResponse.json({ error: "Failed to process Razorpay webhook" }, { status: 500 });
    }
}
