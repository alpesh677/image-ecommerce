"use client";

import { apiClient } from "@/lib/api-client";
import {
	IImageVariant,
	IMAGE_VARIANTS,
	ImageVariantType,
	IProduct,
} from "@/models/Product.model";
import { IKImage } from "imagekitio-next";
import { AlertCircle, ImageIcon, Loader2 } from "lucide-react";
import { set } from "mongoose";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProductPage() {
	const params = useParams();
	const [product, setProduct] = useState<IProduct | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [selectedVariant, setSelectedVariant] =
		useState<IImageVariant | null>(null);

	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		const fetchProduct = async () => {
			setIsLoading(true);
			const id = params?.id;
			if (!id) {
				setError("ProductID is missing");
				setIsLoading(false);
				return;
			}

			try {
				const data = await apiClient.getProduct(id.toString());
				setProduct(data);
			} catch (error) {
				console.error("Error fetching product:", error);
				toast.error(
					error instanceof Error
						? error.message
						: "Failed to load product",
				);
			}
		};

		fetchProduct();
	}, [params?.id]);

	const handlePurchase = async (variant: IImageVariant) => {
		if (!session) {
			toast.info("Please login to purchase this product");
			router.push("/login");
			return;
		}

		if (!product?._id) {
			toast.error("Product not found");
			return;
		}

		try {
			const { orderID, amount } = await apiClient.createOrder({
				variant,
				productID: product._id,
			});

			const options = {
				key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
				amount: amount.toString(),
				currency: "USD",
				name: "Imagekit Ecommerce",
				description: `${product._id} variant is ${variant.type}`,
				image: product.imageUrl,
				order_id: orderID,
				handler: function (response: any) {
					toast.success("Payment successful");
					router.push("/orders");
				},
				prefill: {
					email: session.user?.email,
				},
			};

			const rzr = new (window as any).Razorpay(options);
			rzr.open();
		} catch (error) {
			console.error("Error creating order:", error);
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to create order",
			);
		}
	};

	const getTransformation = (variantType: ImageVariantType) => {
		const variant = IMAGE_VARIANTS[variantType];
		return [
			{
				width: variant.dimension.width.toString(),
				height: variant.dimension.height.toString(),
				cropMode: "extract",
				focus: "center",
				quality: "60",
			},
		];
	};

	if (isLoading)
		return (
			<div className="min-h-[70vh] flex justify-center items-center">
				<Loader2 className="w-12 h-12 animate-spin text-primary" />
			</div>
		);

	if (error || !product)
		return (
			<div className="alert alert-error max-w-md mx-auto my-8">
				<AlertCircle className="w-6 h-6" />
				<span>{error || "Product not found"}</span>
			</div>
		);
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="space-y-6">
					<div
						className="relative rounded-lg overflow-hidden"
						style={{
							aspectRatio: selectedVariant
								? `IMAGE_VARIANTS.${selectedVariant.type}.dimension.width / IMAGE_VARIANTS.${selectedVariant.type}.dimension.height`
								: "1:1",
						}}
					>
						<IKImage
							urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
							path={product.imageUrl}
							alt={product.name}
							transformation={
								selectedVariant
									? getTransformation(selectedVariant.type)
									: getTransformation("SQUARE")
							}
							className="w-full h-full object-cover"
							loading="eager"
						/>
					</div>
					{selectedVariant && (
						<div className="text-sm text-center text-base-content/70">
							Preview :{" "}
							{
								IMAGE_VARIANTS[selectedVariant.type].dimension
									.width
							}{" "}
							x{" "}
							{
								IMAGE_VARIANTS[selectedVariant.type].dimension
									.height
							}{" "}
							px
						</div>
					)}
				</div>
				<div className="space-y-6">
					<div>
						<h1 className="text-4xl font-bold mb-2">
							{product.name}
						</h1>
						<p className="text-base-content/80 text-lg">
							{product.description}
						</p>
					</div>

					<div className="space-y-4">
						<h2 className="text-xl font-semibold">
							Available Versions
						</h2>
						{product.variants.map((variant) => (
							<div
								key={variant.type}
								className={`card bg-base-200 cursor-pointer hover:bg-base-300 transition-colors ${
									selectedVariant?.type === variant.type
										? "ring-2 ring-primary"
										: ""
								}`}
								onClick={() => setSelectedVariant(variant)}
							>
								<div className="flex flex-col space-y-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4">
									<div className="flex justify-between items-center">
										<div className="flex items-center gap-3">
											<ImageIcon className="w-5 h-5" />
											<div>
												<h3 className="font-semibold">
													{
														IMAGE_VARIANTS[
															variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
														].label
													}
												</h3>
												<p className="text-sm text-base-content/70">
													{
														IMAGE_VARIANTS[
															variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
														].dimension.width
													}{" "}
													x{" "}
													{
														IMAGE_VARIANTS[
															variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
														].dimension.height
													}
													px • {variant.license}{" "}
													license
												</p>
											</div>
										</div>
										<div className="flex items-center gap-4">
											<span className="text-xl font-bold">
												${variant.price.toFixed(2)}
											</span>
											<button
												className="btn btn-primary btn-sm"
												onClick={(e) => {
													e.stopPropagation();
													handlePurchase(variant);
												}}
											>
												Buy Now
											</button>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg">
						<div className="p-6">
							<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
								License Information
							</h3>
							<ul className="space-y-3">
								<li className="flex items-center gap-3">
									<svg
										className="w-5 h-5 text-green-500 flex-shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									<span className="text-gray-700 dark:text-gray-300">
										Personal: Use in personal projects
									</span>
								</li>
								<li className="flex items-center gap-3">
									<svg
										className="w-5 h-5 text-green-500 flex-shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									<span className="text-gray-700 dark:text-gray-300">
										Commercial: Use in commercial projects
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
