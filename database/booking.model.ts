import mongoose, { type HydratedDocument, type Model, Schema, Types } from 'mongoose';

import { Event } from './event.model';

export interface BookingAttrs {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingDoc = HydratedDocument<BookingAttrs>;

function isValidEmail(email: string): boolean {
  // Email validation: pragmatic RFC-like check (sufficient for backend validation).
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const BookingSchema = new Schema<BookingAttrs>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string) => isValidEmail(value),
        message: 'email must be a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ eventId: 1 });

BookingSchema.pre<BookingDoc>('save', async function () {
  // Pre-save referential integrity: ensure eventId exists before creating a booking.
  if (this.isNew || this.isModified('eventId')) {
    const exists = await Event.exists({ _id: this.eventId });
    if (!exists) {
      throw new Error('eventId does not reference an existing Event');
    }
  }

  // Extra guard to ensure we never persist an invalid email.
  if (!isValidEmail(this.email)) {
    throw new Error('email must be a valid email address');
  }
});

export const Booking: Model<BookingAttrs> =
  (mongoose.models.Booking as Model<BookingAttrs> | undefined) ??
  mongoose.model<BookingAttrs>('Booking', BookingSchema);
