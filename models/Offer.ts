import mongoose, { Schema, Document } from 'mongoose';

export interface IOffer extends Document {
  id: string;
  title: string;
  description: string;
  type: string;
  discount_type: string;
  discount_value: number;
  valid_from: Date;
  valid_until: Date;
  is_active: boolean;
  image_url?: string;
  code?: string;
  min_purchase?: number;
  usage_limit?: number;
}

const OfferSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  discount_type: { type: String, required: true },
  discount_value: { type: Number, required: true },
  valid_from: { type: Date, required: true },
  valid_until: { type: Date, required: true },
  is_active: { type: Boolean, default: true },
  image_url: { type: String },
  code: { type: String },
  min_purchase: { type: Number },
  usage_limit: { type: Number },
});

export default mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);
