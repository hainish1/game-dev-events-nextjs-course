'use server';
import { Event, type EventAttrs } from '@/database/event.model';
import connectDB from '../mongodb';

export type SimilarEventCardData = Pick<
    EventAttrs,
    'title' | 'image' | 'slug' | 'location' | 'date' | 'time'
>;

export const getSimilarEventsBySlug = async (slug: string): Promise<SimilarEventCardData[]> => {
    try {
        await connectDB();
        const event = await Event.findOne({slug});

        if (!event) return [];

        // find all similar events
        return await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } })
            .select('title image slug location date time -_id')
            .lean<SimilarEventCardData[]>();
    } catch (error) {
        return [];
    }
}

