📅 Parish Event Scheduling System with Email Notification

A full-stack web application designed to streamline the scheduling of parish events and improve communication through automated email notifications. Built as a capstone project to address manual scheduling issues and ensure parishioners and staff are always informed and organized.

📌 Features
📆 Event Scheduling – Create, update, cancel, and restore parish events.

🔁 Recurring Events – Support for weekly/monthly events with optional end dates.

✉️ Email Notifications – Automatic email updates for upcoming events, cancellations, or changes.

🧑‍🤝‍🧑 Role-based Access – Admin and Super Admin roles with different permissions.

🧑 User Positions – Parish-based roles such as Sacristan, Choir Member, Lector, etc.

🕵️ Authentication – Secure login with JWT-based access control.

♻️ Soft Deletion – Canceled events are archived and can be restored.

📊 Dashboards – Track events by type, date, and frequency.

🗺️ Interactive Map Integration – Users can view the exact venue location of an event using Leaflet.js. Clicking the event’s venue will redirect them to a dynamic map page showing the location based on the scheduled event’s data.



🚧 Project Status
This project is finished but still open for improvement.



🛠️ Tech Stack

Frontend:

React.js

Tailwind CSS

Axios

React Hook Form + Zod (for validation)

Leaflet.js (interactive map)


Backend:

NestJS (Node.js)

PostgreSQL

Prisma or Drizzle ORM

Nodemailer

JWT (JSON Web Token)



Tools & DevOps:

Postman (API testing)

Git & GitHub

VS Code



🗃️ Database Schema
The system uses PostgreSQL and includes tables such as:
users
events
canceled_events
roles
positions
notifications



⚙️ How to Run Locally
Clone the repo:

bash
Copy
Edit
git clone https://github.com/your-username/parish-event-scheduler.git
Install dependencies:

bash
Copy
Edit
cd server
npm install
cd ../client
npm install
Set up environment variables in .env files for both client and server:

DB connection string

JWT secrets

Email credentials

Run backend and frontend:

bash
Copy
Edit
# In server/
npm run start:dev

# In client/
npm run dev



👥 Team Members
Wendel Rom – Full Stack Development and Documentation

Others - Documentation



🎯 Objectives

Eliminate manual event scheduling using a centralized system.

Improve communication using automatic email alerts.

Allow granular control of user access based on roles and positions.

Provide a visual reference for event venues via interactive maps.



✅ Future Improvements

SMS Notifications via third-party API (e.g., Twilio or Semaphore)

Calendar view with drag-and-drop scheduling

Map route planning (e.g., directions from user’s location to event venue)

Integration with parish Facebook page or Google Calendar
