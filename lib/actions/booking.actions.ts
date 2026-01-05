'use server';
import {Booking} from "@/database/booking.model"
import connectDB from "../mongodb";

export const createBooking = async ({eventId: eventID, slug, email}: {eventId: string; slug: string; email: string; })=>{
    try {
        await connectDB();
        await Booking.create({eventId: eventID, slug, email});

        return {success: true};
    } catch (error) {
        console.error('create booking failed', error);
        return{success: false};
    }
}