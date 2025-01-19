import { IOrder } from "@/models/Order.model";
import { IImageVariant, IProduct } from "@/models/Product.model";
import { Types } from "mongoose";

export type productFormData = Omit<IProduct, "_id">;
type FetchOptions = {
	method?: "GET" | "POST" | "PUT" | "DELETE";
	body?: any;
	headers?: Record<string, string>;
};

export interface createOrderData {
	productID: Types.ObjectId | string;
	variant: IImageVariant;
}

class ApiClient {
	private async fetch<T>(
		endpoint: string,
		options: FetchOptions = {},
	): Promise<T> {
		const { method = "GET", body, headers = {} } = options;

		const defaultHeaders = {
			"Content-Type": "application/json",
			...headers,
		};

		const response = await fetch(`/api${endpoint}`, {
			method,
			headers: defaultHeaders,
			body: body ? JSON.stringify(body) : undefined,
		});

		if (!response.ok) {
			throw new Error(await response.text());
		}

		return response.json();
	}

	async getProducts() {
		return this.fetch<IProduct[]>("products");
	}

	async getProduct(id: string) {
		return this.fetch<IProduct>(`products/${id}`);
	}

	async createProduct(product: productFormData) {
		return this.fetch<IProduct>("products", {
			method: "POST",
			body: product,
		});
	}

	async getUserOrders() {
		return this.fetch<IOrder[]>("/orders/user");
	}

	async createOrder(orderData: createOrderData) {
		const senitizedOrderData = {
			...orderData,
			productID: orderData.productID.toString(),
		};
		return this.fetch<{ orderID: string; amount: number }>(`/orders`, {
			method: "POST",
			body: senitizedOrderData,
		});
	}
}

export const apiClient = new ApiClient();
