"use client";
import { apiClient } from "@/lib/api-client";
import { IOrder } from "@/models/Order.model";
import { IMAGE_VARIANTS } from "@/models/Product.model";
import { IKImage } from "imagekitio-next";
import { Download, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function page() {
	const [loading, setLoading] = useState(false);
	const [orders, setOrders] = useState<IOrder[]>([]);

	const { data: session } = useSession();

	useEffect(() => {
		const fetchOrders = async () => {
			setLoading(true);
			try {
				const data = await apiClient.getUserOrders();
				setOrders(data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};

		if (session) fetchOrders();
	}, [session]);

	if (loading) {
		return (
			<div className="min-h-[70vh] flex justify-center items-center">
				<Loader2 className="w-12 h-12 animate-spin text-primary" />
			</div>
		);
	}
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
				My Orders
			</h1>
			<div className="space-y-6">
				{orders.map((order) => {
					const variantDimensions =
						IMAGE_VARIANTS[
							order.variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
						].dimension;

					const product = order.productID as any;

					return (
						<div
							key={order._id?.toString()}
							className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl"
						>
							<div className="p-6">
								<div className="flex flex-col md:flex-row gap-6">
									{/* Preview Image - Low Quality */}
									<div
										className="relative rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700"
										style={{
											width: "200px",
											aspectRatio: `${variantDimensions.width} / ${variantDimensions.height}`,
										}}
									>
										<IKImage
											urlEndpoint={
												process.env
													.NEXT_PUBLIC_URL_ENDPOINT
											}
											path={product.imageUrl}
											alt={`Order ${order._id
												?.toString()
												.slice(-6)}`}
											transformation={[
												{
													quality: "60",
													width: variantDimensions.width.toString(),
													height: variantDimensions.height.toString(),
													cropMode: "extract",
													focus: "center",
												},
											]}
											className="w-full h-full object-cover"
											loading="lazy"
										/>
									</div>

									<div className="flex-grow">
										<div className="flex flex-col md:flex-row justify-between items-start">
											<div>
												<h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
													Order #
													{order._id
														?.toString()
														.slice(-6)}
												</h2>
												<div className="space-y-1 text-gray-600 dark:text-gray-300">
													<p>
														Resolution:{" "}
														{
															variantDimensions.width
														}{" "}
														x{" "}
														{
															variantDimensions.height
														}
														px
													</p>
													<p>
														License Type:{" "}
														<span className="capitalize">
															{
																order.variant
																	.license
															}
														</span>
													</p>
													<p className="flex items-center">
														Status:{" "}
														<span
															className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
																order.status ===
																"COMPLETED"
																	? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
																	: order.status ===
																	  "FAILED"
																	? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
																	: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
															}`}
														>
															{order.status}
														</span>
													</p>
												</div>
											</div>

											<div className="mt-4 md:mt-0 text-right">
												<p className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
													${order.amount.toFixed(2)}
												</p>
												{order.status ===
													"COMPLETED" && (
													<a
														href={`${process.env.NEXT_PUBLIC_URL_ENDPOINT}/tr:q-100,w-${variantDimensions.width},h-${variantDimensions.height},cm-extract,fo-center/${product.imageUrl}`}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
														download={`image-${order._id
															?.toString()
															.slice(-6)}.jpg`}
													>
														<Download className="w-4 h-4 mr-2" />
														Download High Quality
													</a>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}

				{orders.length === 0 && (
					<div className="text-center py-12">
						<div className="text-gray-600 dark:text-gray-400 text-lg">
							No orders found
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
