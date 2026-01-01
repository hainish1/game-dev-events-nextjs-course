# PostHog post-wizard report

The wizard has completed a deep integration of your GameDevEvent Hub project. PostHog has been configured using the `instrumentation-client.ts` approach recommended for Next.js 15.3+ (including Next.js 16.x). The integration includes automatic pageview capture, session replay, error tracking, and custom event tracking for key user interactions.

## Integration Summary

### Files Created
- `.env` - Environment variables for PostHog API key and host
- `instrumentation-client.ts` - Client-side PostHog initialization

### Files Modified
- `components/ExploreBtn.tsx` - Added `explore_events_clicked` event capture
- `components/EventCard.tsx` - Added `event_card_clicked` event capture with event properties
- `components/Navbar.tsx` - Added navigation click event captures (logo, home, events, create events)

## Events Tracked

| Event Name | Description | File |
|------------|-------------|------|
| `explore_events_clicked` | User clicks the 'Explore Events' button on the homepage to scroll to events section | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card to view event details - tracks which event they're interested in | `components/EventCard.tsx` |
| `logo_clicked` | User clicks the logo in the navigation bar to return to homepage | `components/Navbar.tsx` |
| `nav_home_clicked` | User clicks the Home link in the navigation bar | `components/Navbar.tsx` |
| `nav_events_clicked` | User clicks the Events link in the navigation bar | `components/Navbar.tsx` |
| `nav_create_events_clicked` | User clicks the Create Events link in the navigation bar - indicates intent to create content | `components/Navbar.tsx` |

## Event Properties

### `event_card_clicked`
- `event_title` - Title of the clicked event
- `event_slug` - URL slug for the event
- `event_location` - Location of the event
- `event_date` - Date of the event

### `explore_events_clicked`
- `button_location` - Where the button is located (homepage_hero)

### Navigation Events
- `nav_location` - Where the navigation item is located (header)
- `nav_item` - Which navigation item was clicked

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/275944/dashboard/962712) - Main analytics dashboard with all insights

### Insights
- [Event Card Clicks Over Time](https://us.posthog.com/project/275944/insights/JlgB9jg9) - Tracks how often users click on event cards
- [Most Popular Events](https://us.posthog.com/project/275944/insights/jZ2Sbb7b) - Shows which game dev events get the most clicks
- [Homepage to Event Interest Funnel](https://us.posthog.com/project/275944/insights/qQYpUOK3) - Conversion funnel from exploring events to clicking on an event
- [Navigation Usage](https://us.posthog.com/project/275944/insights/fhWhHCPS) - Shows how users navigate the site
- [Events by Location Interest](https://us.posthog.com/project/275944/insights/wucVb6Ro) - Shows which event locations attract the most interest

## Configuration

PostHog is configured with:
- **API Host**: `https://us.i.posthog.com`
- **Defaults**: `2025-05-24` (latest recommended settings)
- **Error Tracking**: Enabled (`capture_exceptions: true`)
- **Debug Mode**: Enabled in development environment

## Getting Started

1. Run your development server: `npm run dev`
2. Interact with your app to generate events
3. View your analytics at [PostHog Dashboard](https://us.posthog.com/project/275944/dashboard/962712)
