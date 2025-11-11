import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  status: 'Approved' | 'Pending' | 'Flagged';
  created_at: Date;
  updated_at: Date;
  reply?: string;
  reply_date?: Date;
}

const ReviewSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  product_id: { type: String, required: true },
  user_id: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  status: { type: String, enum: ['Approved', 'Pending', 'Flagged'], default: 'Pending' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  reply: { type: String },
  reply_date: { type: Date },
});

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
