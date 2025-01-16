import mongoose,{Schema,models} from "mongoose";

export const IMAGE_VARIANTS = { 
    SQUARE :{
        type : "SQUARE",
        dimension : {width: 1200, height: 1200},
        label : "Square(1:1)",
        aspectRatio : "1:1" 
    },
    WIDE :{
        type : "WIDE",
        dimension : {width: 1920, height: 1080},
        label : "Widescreen(16:9)",
        aspectRatio : "16:9" 
    },
    PORTRAIT :{
        type : "PORTRAIT",
        dimension : {width: 1080, height: 1440},
        label : "Portrait(3:4)",
        aspectRatio : "3:4" 
    }
}

export type ImageVariantType = keyof typeof IMAGE_VARIANTS;

export interface IImageVariant {
	type: ImageVariantType;
    price : number,
    license : "personal" | "commercial"
}

const imageVariantSchema = new Schema<IImageVariant>({
    type : {
        type : String,
        required : true,
        enum : ["SQUARE", "WIDE", "PORTRAIT"]
    },
    price : {
        type : Number,
        required : true,
        min : 0
    },
    license: {
        type : String,
        required : true,
        enum : ["personal", "commercial"]
    }
});

export interface IProduct {
    _id? : mongoose.Types.ObjectId,
    name : string,
    description : string,
    imageUrl : string,
    variants : IImageVariant[],
    createdAt? : Date,
    updatedAt? : Date
}


const productSchema = new Schema<IProduct>({
    name :{
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    imageUrl : {
        type : String,
        required : true
    },
    variants : {
        type : [imageVariantSchema]
    }
},{timestamps : true});

const Product = models?.product || mongoose.model<IProduct>("product", productSchema);

export default Product