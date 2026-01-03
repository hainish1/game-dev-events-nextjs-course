import mongoose, { type HydratedDocument, type Model, Schema } from 'mongoose';

export interface EventAttrs {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type EventDoc = HydratedDocument<EventAttrs>;

function toSlug(input: string): string {
  // Slug generation: lowercase, trim, collapse non-alphanumerics into single hyphens.
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function assertNonEmptyString(value: unknown, fieldName: string): asserts value is string {
  // Required field validation: reject empty or whitespace-only strings.
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${fieldName} is required`);
  }
}

function assertNonEmptyStringArray(value: unknown, fieldName: string): asserts value is string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${fieldName} must be a non-empty array`);
  }
  for (const item of value) {
    if (typeof item !== 'string' || item.trim().length === 0) {
      throw new Error(`${fieldName} must contain non-empty strings`);
    }
  }
}

function normalizeDateToISO(dateStr: string): string {
  // Date formatting: store as ISO-8601 string for consistent sorting and parsing.
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('date must be a valid date string');
  }
  return parsed.toISOString();
}

function normalizeTime(timeStr: string): string {
  // Time formatting: normalize to 24-hour HH:mm.
  const raw = timeStr.trim();

  const hhmm = raw.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (hhmm) {
    const hours = hhmm[1].padStart(2, '0');
    const minutes = hhmm[2];
    return `${hours}:${minutes}`;
  }

  const ampm = raw.match(/^(\d{1,2}):([0-5]\d)\s*([aApP][mM])$/);
  if (ampm) {
    let hours = Number(ampm[1]);
    const minutes = ampm[2];
    const meridiem = ampm[3].toLowerCase();

    if (hours < 1 || hours > 12) {
      throw new Error('time must be a valid 12-hour time');
    }

    if (meridiem === 'pm' && hours !== 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;

    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  throw new Error('time must be in HH:mm or h:mm AM/PM format');
}

const EventSchema = new Schema<EventAttrs>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    mode: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: {
      type: [String],
      required: true,
      default: undefined,
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.index({ slug: 1 }, { unique: true });

EventSchema.pre<EventDoc>('save', function () {
  // Pre-save validation + normalization (slug/date/time) before persisting.
  assertNonEmptyString(this.title, 'title');
  assertNonEmptyString(this.description, 'description');
  assertNonEmptyString(this.overview, 'overview');
  assertNonEmptyString(this.image, 'image');
  assertNonEmptyString(this.venue, 'venue');
  assertNonEmptyString(this.location, 'location');
  assertNonEmptyString(this.date, 'date');
  assertNonEmptyString(this.time, 'time');
  assertNonEmptyString(this.mode, 'mode');
  assertNonEmptyString(this.audience, 'audience');
  assertNonEmptyString(this.organizer, 'organizer');
  assertNonEmptyStringArray(this.agenda, 'agenda');
  assertNonEmptyStringArray(this.tags, 'tags');

  if (this.isModified('title') || !this.slug) {
    this.slug = toSlug(this.title);
    if (!this.slug) {
      throw new Error('slug could not be generated from title');
    }
  }

  // Normalize date + time for consistent storage.
  this.date = normalizeDateToISO(this.date);
  this.time = normalizeTime(this.time);
});

export const Event: Model<EventAttrs> =
  (mongoose.models.Event as Model<EventAttrs> | undefined) ??
  mongoose.model<EventAttrs>('Event', EventSchema);
