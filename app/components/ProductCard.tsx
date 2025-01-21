"use client";

import { IMAGE_VARIANTS, IProduct } from "@/models/Product.model";
import { IKImage } from "imagekitio-next";
import { Eye } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ProductCard({ product }: { product: IProduct }) {

	console.log(`PRODUCT CARD PAGE: ${typeof product._id}`);
	const lowestPrice = product.variants.reduce(
		(min, variant) => (variant.price < min ? variant.price : min),
		product.variants[0].price,
	);
	return (
		<div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow hover:shadow-lg transition-all duration-300 dark:hover:shadow-sky-500/20">
			<div className="relative p-4">
				<Link
					href={`/products/${product._id}`}
					className="relative group block w-full"
				>
					<div
						className="rounded-xl overflow-hidden relative w-full"
						style={{
							aspectRatio:
								IMAGE_VARIANTS.SQUARE.dimension.width /
								IMAGE_VARIANTS.SQUARE.dimension.height,
						}}
					>
						<IKImage
							path={product.imageUrl}
							alt="product image"
							loading="eager"
							transformation={[
								{
									height: IMAGE_VARIANTS.SQUARE.dimension.height.toString(),
									width: IMAGE_VARIANTS.SQUARE.dimension.width.toString(),
									cropMode: "extract",
									focus: "center",
									quality: "80",
								},
							]}
							className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
						/>
					</div>
					<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" />
				</Link>
			</div>
			<div className="p-4">
				<Link
					href={`/products/${product._id}`}
					className="hover:opacity-80 transition-opacity"
				>
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
						{product.name}
					</h2>
				</Link>

				<p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 min-h-[2.5rem] mt-2">
					{product.description}
				</p>

				<div className="flex justify-between items-center mt-4">
					<div className="flex flex-col">
						<span className="text-lg font-bold text-gray-900 dark:text-white">
							From ${lowestPrice.toFixed(2)}
						</span>
						<span className="text-xs text-gray-500 dark:text-gray-400">
							{product.variants.length} sizes available
						</span>
					</div>

					<Link
						href={`/products/${product._id}`}
						className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-[#4f4fdc] rounded-md hover:bg-[#6c63e1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
					>
						<Eye className="w-4 h-4 mr-2" />
						View Options
					</Link>
				</div>
			</div>
		</div>
	);
}
