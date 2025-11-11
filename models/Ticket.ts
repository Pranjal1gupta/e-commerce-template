import mongoose, { Schema, Document } from 'mongoose';

export interface ITicketReply {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  attachments?: string[];
  created_at: Date;
}

export interface ITicket extends Document {
  id: string;
  user_id: string;
  order_id?: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assigned_admin_id?: string;
  created_at: Date;
  updated_at: Date;
  attachments?: string[];
}

const TicketReplySchema: Schema = new Schema({
  id: { type: String, required: true },
  ticket_id: { type: String, required: true },
  user_id: { type: String, required: true },
  message: { type: String, required: true },
  attachments: [{ type: String }],
  created_at: { type: Date, default: Date.now },
});

const TicketSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  order_id: { type: String },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
  assigned_admin_id: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  attachments: [{ type: String }],
});

export default mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);
