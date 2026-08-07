# TownHall

A role-based civic engagement platform for residents, local businesses, and government staff.

TownHall is a team project built to make local proposals, services, complaints, events, and public feedback easier to manage in one system. The repository combines a Django backend with a Next.js frontend and organizes workflows around the people who use them.

## What the platform supports

### Residents

- File and track community complaints
- Read announcements and local proposals
- Comment on proposals and record support or opposition
- Discover local events and municipal services

### Business owners

- Create events for administrative review
- Manage license and permit workflows
- Track application status
- View business-related announcements

### Government staff

- Publish proposals and announcements
- Review complaints and business submissions
- Moderate user-generated content
- Manage departments, users, permissions, and reporting

## Engineering highlights

- Role-based authentication for resident, business, government, and administrator accounts
- Django domain apps for authentication, citizens, businesses, government workflows, and towns
- Next.js 15 frontend using React, TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion
- RESTful integration between the frontend and Django backend
- File-upload validation and documented security controls
- Admin approval workflows for public-facing business content
- Structured comments, voting, complaint tracking, and proposal management

## Stack

| Layer | Technology |
|---|---|
| Backend | Python, Django, Django REST Framework |
| Frontend | Next.js 15, React, TypeScript |
| Database | MySQL |
| UI | Tailwind CSS, shadcn/ui, Framer Motion |

## Project structure

~~~text
TownHall/
├── authentication/     # Login, profiles, roles, and permissions
├── citizen/            # Resident-facing workflows
├── businessowner/      # Business events and applications
├── government/         # Proposals, moderation, and administration
├── towns/              # Town and department data
├── frontend/           # Next.js application
└── townhall_project/   # Django configuration and routing
~~~

## Run locally

See [setup.md](setup.md) for the full environment and database setup.

~~~bash
python manage.py runserver
cd frontend
npm run dev
~~~

## Supporting documentation

- [Security overview](SECURITY.md)
- [File upload security](FILE_UPLOAD_SECURITY.md)
- [REST API notes](RESTFUL_API_COMPLETE.md)
- [Business workflow integration](BUSINESS_INTEGRATION_COMPLETE.md)

## Team

- Yesha - Product Owner and Scrum Master
- Smit - Developer
- Evan - Developer
- Nandni - QA and documentation
