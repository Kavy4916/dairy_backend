import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 8,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
},
{timestamps: true}
)


export default mongoose.model('User',userSchema);