import mongoose from "mongoose";

const Schema = mongoose.Schema;

const entrySchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
        minlength: 30, 
        maxlength: 300
    },
    title: {
        type: String,
        required: true,
        minlength: 10, 
        maxlength: 80
    }
},
{timestamps: true}
)


export default mongoose.model('Entry',entrySchema);