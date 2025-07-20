import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: Number,
}, { timestamps: true });

const List = mongoose.model('List', listSchema);
export default List;
