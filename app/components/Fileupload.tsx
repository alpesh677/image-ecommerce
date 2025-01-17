'use client';
import { IKImage, IKUpload } from 'imagekitio-next';
import { IKUploadResponse } from 'imagekitio-next/dist/types/components/IKUpload/props';
import React, { useState } from 'react'

export default function Fileupload({onSuccess} : {onSuccess : (res:IKUploadResponse) => void}) {

    const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const acceptedFileTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeMB = 5;

    const onError = (error: {message : string}) => {
        setError(error.message); 
        setIsUploading(false);
    }

    const handleSuccess = (res : IKUploadResponse) => {
        setIsUploading(false);
        setError(null);
        onSuccess(res);
    };

    const handleStartUpload = () =>{
        setIsUploading(true);
        setError(null);
    }
  return (
		<div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
			<div className="flex items-center justify-between">
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
					Upload Image
				</label>
				{uploadedFileId && (
					<button
						onClick={() => setUploadedFileId(null)}
						className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
					>
						Remove
					</button>
				)}
			</div>

			{!uploadedFileId && (
				<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
					<div className="space-y-1 text-center">
						<svg
							className="mx-auto h-12 w-12 text-gray-400"
							stroke="currentColor"
							fill="none"
							viewBox="0 0 48 48"
							aria-hidden="true"
						>
							<path
								d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						<div className="flex text-sm text-gray-600 dark:text-gray-400">
							<IKUpload
								fileName="product-image"
								onError={onError}
								onSuccess={handleSuccess}
								onUploadStart={handleStartUpload}
								validateFile={(file: File) => {
									if (
										!acceptedFileTypes.includes(file.type)
									) {
										setError(
											`Please upload a valid image file (${acceptedFileTypes.join(
												", ",
											)})`,
										);
										return false;
									}
									if (file.size > maxSizeMB * 1024 * 1024) {
										setError(
											`File size must be less than ${maxSizeMB}MB`,
										);
										return false;
									}
									return true;
								}}
								style={{ display: "none" }}
								id="file-upload"
							/>
							<label
								htmlFor="file-upload"
								className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
							>
								<span>Upload a file</span>
							</label>
							<p className="pl-1">or drag and drop</p>
						</div>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							PNG, JPG, WebP up to {maxSizeMB}MB
						</p>
					</div>
				</div>
			)}

			{isUploading && (
				<div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
					<svg
						className="animate-spin h-5 w-5"
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
					<span className="text-sm">Uploading...</span>
				</div>
			)}

			{error && <div className="text-red-500 text-sm">{error}</div>}

			{uploadedFileId && (
				<div className="mt-2 space-y-2">
					<div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
						<IKImage
							path={uploadedFileId}
							width = "300"
                            height = "200"
							lqip={{ active: true, quality: 80 }}
							loading="lazy"
                            alt='Uploaded image'
							className="w-full h-full object-cover"
						/>
					</div>
					<p className="text-xs text-gray-500 dark:text-gray-400">
						Image uploaded successfully
					</p>
				</div>
			)}
		</div>
  );
}
