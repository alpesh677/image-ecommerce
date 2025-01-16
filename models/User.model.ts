import mongoose,{models, Schema} from "mongoose";
import bcryptjs from "bcryptjs";

interface IUser{
    email : string,
    password : string,
    role : "user" | "admin",
    _id : mongoose.Types.ObjectId,
    createdAt : Date,
    updatedAt : Date
}

const userSchema = new Schema<IUser>({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ["user", "admin"],
        default : "user"
    }
},{timestamps : true});

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcryptjs.hash(this.password,10);
    }
    next()
});

const User = models?.user || mongoose.model<IUser>("User", userSchema);

export default User;