import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

export interface IAddress {
  id: string;
  user_id: string;
  full_name: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
}

export interface IOrder extends Document {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  items: IOrderItem[];
  shipping_address?: IAddress;
  payment_method?: string;
  delivery_method?: string;
}

const OrderItemSchema: Schema = new Schema({
  id: { type: String, required: true },
  order_id: { type: String, required: true },
  product_id: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const AddressSchema: Schema = new Schema({
  id: { type: String, required: true },
  user_id: { type: String, required: true },
  full_name: { type: String, required: true },
  street_address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postal_code: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  is_default: { type: Boolean, default: false },
});

const OrderSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  total: { type: Number, required: true },
  status: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  items: [OrderItemSchema],
  shipping_address: AddressSchema,
  payment_method: { type: String },
  delivery_method: { type: String },
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
