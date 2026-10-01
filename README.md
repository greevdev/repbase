# RepBase

RepBase is a personal training management application built for fitness coaches to manage clients, track workouts, create reusable workout templates, and schedule training sessions from one workspace.

The project was built as a full-stack portfolio application using Next.js, Supabase, TypeScript, and shadcn/ui.

[View RepBase](https://repbaseapp.vercel.app/)

## Screenshots

### - Dashboard
<table>
  <tr>
    <td>
      <img width="2880" height="1567" alt="dashboard" src="https://github.com/user-attachments/assets/a0e388f0-267a-4881-940c-0c019b199df9" />
    </td>
  </tr>
</table>


### - Client Details
<table>
  <tr>
    <td>
      <img width="2880" height="1567" alt="client-page" src="https://github.com/user-attachments/assets/2b79c60c-a4e4-489c-bfcb-85e931741b16" />
    </td>
  </tr>
</table>


### - Workout View
<table>
  <tr>
    <td>
      <img width="2880" height="1567" alt="workout-view" src="https://github.com/user-attachments/assets/61c4ef17-ee6f-438b-a830-c6168206c5b0" />
    </td>
  </tr>
</table>


### - Workout Logging
<table>
  <tr>
    <td>
      <img width="2880" height="1567" alt="log-workout" src="https://github.com/user-attachments/assets/c11825d0-54ab-4a77-8731-602af8b58309" />
    </td>
  </tr>
</table>


## Features

- Secure user authentication
- Client management
  - Add, edit, and delete clients
  - Client goals, notes, and year of birth
  - Workout activity tracking
- Workout logging
  - Exercises, sets, reps, and weight
  - Workout duration
  - Automatic workout volume and set count
  - Exercise notes
  - Previous workout performance shown as placeholders
- Exercise library
  - Searchable predefined exercise list
  - Exercise categories and equipment
  - Support for custom exercises
- Workout templates
  - Create reusable client-specific templates
  - Edit and delete templates
  - Start workouts directly from a template
- Workout scheduling
  - Schedule sessions with date, time, duration, and notes
  - Edit and delete scheduled sessions
  - Add scheduled sessions to Google Calendar
- Dashboard
  - Active clients
  - Weekly sessions
  - Monthly revenue
  - Next scheduled session
  - Recent workout activity
- Responsive interface for desktop and mobile

## Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Supabase**
  - PostgreSQL
  - Authentication
  - Row Level Security
- **Lucide React**
- **Sonner**

## Database

RepBase uses Supabase PostgreSQL for data storage.
The main entities include:
- Clients
- Workouts
- Workout exercises
- Exercise sets
- Workout templates
- Template exercises
- Template sets
- Scheduled workouts

Row Level Security is used to ensure users can only access their own clients and related data.

## Google Calendar

Scheduled workouts can be opened as pre-filled Google Calendar events.

RepBase generates a Google Calendar event link containing the workout title, client, date, time, duration, and notes. The user can then save the event to their own calendar.

## Future Improvements

Possible future additions include:
- Direct Google Calendar API synchronization
- Client accounts
- Training programs and recurring schedules
- Exercise progress charts
- Personal records tracking
- Additional workout analytics
- Notifications and reminders
