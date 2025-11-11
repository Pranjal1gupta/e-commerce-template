import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string | null;
  base_price: number;
  actual_MRP?: number;
  discounted_price?: number;
  percentage_discount?: number;
  images: string[];
  tags: string[];
  rating: number;
  review_count: number;
  stock_quantity: number;
  variants: any;
  specifications: any;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_hot_deal?: boolean;
  has_offer?: boolean;
  sku?: string;
  brand?: string;
  tax_percentage?: number;
  offer_label?: string;
  video_url?: string;
  is_active?: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  threshold?: number;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category_id: { type: String, default: null },
  base_price: { type: Number, required: true },
  actual_MRP: { type: Number },
  discounted_price: { type: Number },
  percentage_discount: { type: Number },
  images: [{ type: String }],
  tags: [{ type: String }],
  rating: { type: Number, default: 0 },
  review_count: { type: Number, default: 0 },
  stock_quantity: { type: Number, default: 0 },
  variants: { type: Schema.Types.Mixed },
  specifications: { type: Schema.Types.Mixed },
  is_featured: { type: Boolean, default: false },
  is_new_arrival: { type: Boolean, default: false },
  is_hot_deal: { type: Boolean, default: false },
  has_offer: { type: Boolean, default: false },
  sku: { type: String },
  brand: { type: String },
  tax_percentage: { type: Number },
  offer_label: { type: String },
  video_url: { type: String },
  is_active: { type: Boolean, default: true },
  meta_title: { type: String },
  meta_description: { type: String },
  meta_keywords: { type: String },
  threshold: { type: Number },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
