import mongoose, { Schema } from "mongoose";
import { ImageVariantType } from "./Product.model";
import { IImageVariant } from "./Product.model";

interface PopulatedUser{
    _id : mongoose.Types.ObjectId,
    email : string
}

interface PopulatedProduct{
    _id : mongoose.Types.ObjectId,
    name : string,
    imageUrl : string
}

export interface IOrder {
    _id? : mongoose.Types.ObjectId, 
    userID : mongoose.Types.ObjectId | PopulatedUser,
    productID : mongoose.Types.ObjectId | PopulatedProduct,
    variant : IImageVariant,
    price : number,
    license : "personal" | "commercial",
    razorpayOrderId : string,
    razorpayPaymentId? : string,
    amount : number,
    status : "PENDING" | "COMPLETED" | "FAILED",
    downloadURL? : string,
    previewURL? : string,
    createdAt? : Date,
    updatedAt? : Date
}

const orderSchema = new Schema({
    userID : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true
    },
    productID : {
        type : mongoose.Types.ObjectId,
        ref : "Product",
        required : true
    },
    variant : {
        type : String,
        required : true,
        enum : ["SQUARE", "WIDE", "PORTRAIT"] as ImageVariantType[],
        set: (v:string) => v.toUpperCase()
    },
    price : {
        type : Number,
        required : true
    },
    license:{
        type : String,
        required : true,
        enum : ["personal", "commercial"]
    },
    razorpayOrderId : {
        type : String,
        required : true
    },
    razorpayPaymentId : {
        type : String
    },
    amount : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        required : true,
        enum : ["PENDING", "COMPLETED", "FAILED"],
        default : "PENDING"
    },
    downloadURL : {type : String},
    previewURL : {type : String},
},{timestamps : true});

const Order = mongoose.models?.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;