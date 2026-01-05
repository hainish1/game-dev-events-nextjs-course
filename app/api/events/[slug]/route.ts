import { NextResponse, type NextRequest } from 'next/server';
import { Types } from 'mongoose';

import connectDB from '@/lib/mongodb';
import { Event, type EventAttrs } from '@/database/event.model';

type RouteContext = {
  // In newer Next versions, `params` may be async (Promise).
  params: { slug?: string } | Promise<{ slug?: string }>;
};

type ErrorResponse = {
  message: string;
};

type SuccessResponse = {
  message: string;
  event: EventAttrs & { _id: Types.ObjectId };
};

function isValidSlug(slug: string): boolean {
  // Slug validation: keep it URL-safe and consistent with our slug generator.
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

async function resolveParams(ctx: RouteContext): Promise<{ slug?: string }> {
  // Normalizes Next's route context across versions (sync vs async params).
  return await Promise.resolve(ctx.params);
}

export async function GET(_req: NextRequest, ctx: RouteContext): Promise<NextResponse> {
  try {
    const { slug: slugRaw } = await resolveParams(ctx);

    if (typeof slugRaw !== 'string' || slugRaw.trim().length === 0) {
      return NextResponse.json<ErrorResponse>({ message: 'Missing slug parameter' }, { status: 400 });
    }
    
    // sanitising the slug
    const slug = slugRaw.trim().toLowerCase();

    if (!isValidSlug(slug)) {
      return NextResponse.json<ErrorResponse>(
        { message: 'Invalid slug format' },
        { status: 400 }
      );
    }

    // connecting to the database
    await connectDB();

    const event = await Event.findOne({ slug }).select('-__v').lean<
      EventAttrs & { _id: Types.ObjectId }
    >();

    if (!event) {
      return NextResponse.json<ErrorResponse>({ message: 'Event not found' }, { status: 404 });
    }

    // if event is found
    return NextResponse.json<SuccessResponse>(
      { message: 'Event fetched successfully', event },
      { status: 200 }
    );
  } catch (err: unknown) {
    // Unexpected errors: avoid leaking internals while keeping a clear message.
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json<ErrorResponse>(
      { message: `Failed to fetch event: ${message}` },
      { status: 500 }
    );
  }
}
