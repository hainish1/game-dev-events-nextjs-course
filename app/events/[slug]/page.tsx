import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import type { EventAttrs } from "@/database/event.model";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const safeParseStringArray = (value: unknown): string[] => {
    try {
        if (typeof value !== "string") return [];
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((v) => typeof v === "string") as string[];
    } catch {
        return [];
    }
};

const EventDetailItem = ({icon, alt, label}: {icon: string; alt: string; label: string; }) => (
    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17}/>
        <p>{label}</p>
    </div>
);

const EventAgenda = ({agendaItems}: {agendaItems: string[]}) => (
    <div className="agenda">
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map((item, idx) => (
                <li key={`${idx}-${item}`}>{item}</li>
            ))}
        </ul>
    </div>
);

const EventTags =({tags}: {tags: string[]}) => (
    <div className="flex flex-row gap-1.5 flex-wrap">
        {tags.map((tag, idx) => (
            <div className="pill" key={`${idx}-${tag}`}>{tag}</div>
        ))}
    </div>
);


const EventDetailsPage = async ({params} : {params: Promise<{slug: string}>}) => {
    'use cache';
    cacheLife('hours');

    const {slug} = await params;
    const baseUrl = (BASE_URL ?? "").trim().replace(/\/$/, "");
    const apiUrl = baseUrl ? `${baseUrl}/api/events/${slug}` : `/api/events/${slug}`;
    const request = await fetch(apiUrl);

    if (!request.ok) return notFound();

    const data: unknown = await request.json();
    const event = (data as { event?: (EventAttrs & { _id?: unknown }) | null } | null)?.event ?? null;

    if (!event?.description) return notFound();

    const { description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } = event;
    const eventId = typeof event._id === 'string' ? event._id : '';

    const bookings = 10;

    const similarEvents: Pick<EventAttrs, "title" | "image" | "slug" | "location" | "date" | "time">[] =
        await getSimilarEventsBySlug(slug);

    return (
    <section id="event">
        <div className="header">
            <h1>Event Description</h1>
            <p>{description}</p>
        </div>   
        <div className="details">
        {/* LEFT SIDE - Event Content */}
        <div className="content">
            <Image src={image} alt="Event Banner" width={800} height={800} className="banner"/>

            <section className="flex-col-gap-2">
                <h2>Overview</h2>
                <p>{overview}</p>
            </section>

            <section className="flex-col-gap-2">
                <h2>Event Details</h2>

                <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date}/>
                <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time}/>
                <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location}/>
                <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode}/>
                <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience}/>
            </section>

            <EventAgenda agendaItems={safeParseStringArray(Array.isArray(agenda) ? agenda[0] : undefined)}/>

            <section className="flex-col-gap-2">
                <h2>About the Organizer</h2>
                <p>{organizer}</p>
            </section>

            <EventTags tags={safeParseStringArray(Array.isArray(tags) ? tags[0] : undefined)}/>
        </div>




        {/* RIGHT SIDE - Booking form */}
            <aside className="booking">
                <div className="signup-card">
                    <h2>Book Your Spot</h2>
                    {bookings > 0 ? (
                        <p className="text-sm">
                            Join {bookings} people who have already booked their spot!
                        </p>
                    ): (<p className="text-sm">Be the first to book your spot</p>
                    )}

                    <BookEvent eventID={eventId} slug={event.slug} />
                </div>
            </aside>

        </div>

        <div className="flex w-full flex-col gap-4 pt-20">
            <h2>Similar Events</h2>
            <div className="events">
                {similarEvents.length > 0 &&
                    similarEvents.map((similarEvent) => (
                        <EventCard
                            key={similarEvent.slug}
                            title={similarEvent.title}
                            image={similarEvent.image}
                            slug={similarEvent.slug}
                            location={similarEvent.location}
                            date={similarEvent.date}
                            time={similarEvent.time}
                        />
                    ))}
            </div>
        </div>
    </section>
  )
}

export default EventDetailsPage