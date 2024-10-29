import mongoose from "mongoose";

const Schema = mongoose.Schema;

const goalSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  goal: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 200
  },
  remark: {
    type: String,
    default: null,
    minlength: 10,
    maxlength: 100
  },
  score: {
    type: Number,
    required: true,
    min: [1,"Score can't be less than 1."],
    max: [10,"Score can't be more than 10."]
  },
  status: {
    type: Boolean,
    required: true,
  },
  deadline: {
    type: String,
    required: true,
    min: ["2024-10-01", "Date is invalid."],
    max: ["2030-12-31", "Date is invalid."]
  }
},
{timestamps: true}
)


export default mongoose.model('Goal',goalSchema);