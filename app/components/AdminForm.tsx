"use client";
import { apiClient, ProductFormData } from "@/lib/api-client";
import { ImageVariantType, IMAGE_VARIANTS } from "@/models/Product.model";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import Fileupload from "./Fileupload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

export default function AdminForm() {
	const [loading, setLoading] = useState(false);

	const {
		register,
		control,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<ProductFormData>({
		defaultValues: {
			name: "",
			description: "",
			imageUrl: "",
			variants: [
				{
					type: "SQUARE" as ImageVariantType,
					price: 9.99,
					license: "personal",
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "variants",
	});

	const handleUploadSuccess = (response: IKUploadResponse) => {
		setValue("imageUrl", response.filePath);
		toast.success("Image uploaded successfully");
	};

	const submit = async (data: ProductFormData) => {
		setLoading(true);

		try {
			await apiClient.createProduct(data);

			toast.success("Product created successfully");

			setValue("name", "");
			setValue("description", "");
			setValue("imageUrl", "");
			setValue("variants", [
				{
					type: "SQUARE" as ImageVariantType,
					price: 9.99,
					license: "personal",
				},
			]);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Registration failed",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(submit)}
			className="space-y-6 max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
		>
			<div>
				<label
					htmlFor="name"
					className="block text-sm font-medium text-gray-700 dark:text-gray-200"
				>
					Product Name
				</label>
				<input
					type="text"
					id="name"
					className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
            ${
				errors.name
					? "border-red-300 text-red-900 placeholder-red-300"
					: "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
			}
        `}
					{...register("name", { required: "Name is required" })}
				/>
				{errors.name && (
					<p className="mt-2 text-sm text-red-600 dark:text-red-400">
						{errors.name.message}
					</p>
				)}
			</div>

			<div>
				<label
					htmlFor="description"
					className="block text-sm font-medium text-gray-700 dark:text-gray-200"
				>
					Description
				</label>
				<textarea
					id="description"
					rows={3}
					className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
            ${
				errors.description
					? "border-red-300 text-red-900 placeholder-red-300"
					: "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
			}
        `}
					{...register("description", {
						required: "Description is required",
					})}
				/>
				{errors.description && (
					<p className="mt-2 text-sm text-red-600 dark:text-red-400">
						{errors.description.message}
					</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
					Product Image
				</label>
				<Fileupload onSuccess={handleUploadSuccess} />
			</div>

			<div className="relative">
				<div
					className="absolute inset-0 flex items-center"
					aria-hidden="true"
				>
					<div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
				</div>
				<div className="relative flex justify-center">
					<span className="px-2 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
						Image Variants
					</span>
				</div>
			</div>

			{fields.map((field, index) => (
				<div
					key={field.id}
					className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
				>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
								Size & Aspect Ratio
							</label>
							<select
								className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
								{...register(`variants.${index}.type`)}
							>
								{Object.entries(IMAGE_VARIANTS).map(
									([key, value]) => (
										<option key={key} value={value.type}>
											{value.label} (
											{value.dimension.width}x
											{value.dimension.height})
										</option>
									),
								)}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
								License
							</label>
							<select
								className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
								{...register(`variants.${index}.license`)}
							>
								<option value="personal">Personal Use</option>
								<option value="commercial">
									Commercial Use
								</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
								Price ($)
							</label>
							<input
								type="number"
								step="0.01"
								min="0.01"
								className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
								{...register(`variants.${index}.price`, {
									valueAsNumber: true,
									required: "Price is required",
									min: {
										value: 0.01,
										message: "Price must be greater than 0",
									},
								})}
							/>
							{errors.variants?.[index]?.price && (
								<p className="mt-2 text-sm text-red-600 dark:text-red-400">
									{errors.variants[index]?.price?.message}
								</p>
							)}
						</div>
					</div>
					<div className="mt-4 flex justify-end">
						<button
							type="button"
							className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
							onClick={() => remove(index)}
							disabled={fields.length === 1}
						>
							Remove
						</button>
					</div>
				</div>
			))}

			<button
				type="button"
				className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				onClick={() =>
					append({ type: "SQUARE", price: 9.99, license: "personal" })
				}
			>
				Add Variant
			</button>

			<button
				type="submit"
				className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
				disabled={loading}
			>
				{loading ? (
					<>
						<svg
							className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Creating Product...
					</>
				) : (
					"Create Product"
				)}
			</button>
		</form>
	);
}
