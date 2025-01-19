import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
console.log("Resolved Path:", path.resolve(process.cwd(), ".env.local"));

const uri = process.env.MONGODB_URI;

if (!uri) {
	throw new Error("Please add your MongoDB URI to .env.local");
}

// Create Product Schema matching Product.ts
const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		price: { type: Number, required: true },
		imageUrl: { type: String, required: true },
	},
	{ timestamps: true },
);

// Create the model
const Product =
	mongoose.models.Product || mongoose.model("Product", productSchema);

const dummyProducts = [
	{
		name: "Classic Camera",
		description: "A vintage-style camera with modern features",
		price: 599.99,
		imageUrl:
			"https://ik.imagekit.io/zxqfhtkrz/photo-camera-subject-photographer-51383.jpeg?updatedAt=1737216228846",
	},
	{
		name: "Professional Lens",
		description: "High-quality lens for professional photography",
		price: 899.99,
		imageUrl:
			"https://ik.imagekit.io/zxqfhtkrz/pexels-photo-2226386.webp?updatedAt=1737216228401",
	},
	{
		name: "Camera Tripod",
		description: "Sturdy tripod for stable shots",
		price: 149.99,
		imageUrl:
			"https://ik.imagekit.io/zxqfhtkrz/pexels-photo-1797089.jpeg?updatedAt=1737216228268",
	},
	{
		name: "Camera Bag",
		description: "Spacious bag for all your photography gear",
		price: 79.99,
		imageUrl:
			"https://ik.imagekit.io/zxqfhtkrz/pexels-photo-842959.webp?updatedAt=1737216228850",
	},
	{
		name: "LED Light Kit",
		description: "Professional lighting kit for studio photography",
		price: 299.99,
		imageUrl:
			"https://ik.imagekit.io/zxqfhtkrz/pexels-photo-29877910.webp?updatedAt=1737216228341",
	},
];

async function seed() {
	try {
		await mongoose.connect(uri, {
			maxPoolSize: 10,
		});
		console.log("Connected to database");

		// Clear existing data
		await Product.deleteMany({});
		console.log("Cleared existing products");

		// // Add dummy products
		// const result = await Product.insertMany(dummyProducts);
		// console.log(`Added ${result.length} dummy products`);

		// console.log("Seeding completed successfully");
	} catch (error) {
		console.error("Error seeding database:", error);
	} finally {
		await mongoose.connection.close();
		process.exit(0);
	}
}

// Run the seed function
seed();
