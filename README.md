

# Townhall - Civic Engagement Platform

## Team members and roles

1) Yesha - Product Owner
2) Jose - Scrum Master
3) Smit - Developer
4) Evan - Developer
5) Nandni - QA and document manager



## Product Backlog
Our backlog is maintained in Pivotal Tracker: https://github.com/users/sd2389/projects/3



## product vision

** A distant vision: **
Townhall is a civilian engagement hub that builds the inhabitants, government officials and business owners. This simplifies complex government proposals with AI-borne summaries, brings together structured social reactions and promotes local businesses and incidents. The long -term goal is to make local governance transparent, accessible and participated.

** Foundation Vision (MVP): **
For the first repetition, we will distribute active problems (with AI summaries), easy vote and comment, and a resident feed of an administrator portal, where the authorities can upload the proposals and see the reaction together with the diagram.



## Stakeholder

1. Residents- Easy access to local problems requires easy access and is a way to vote to their opinion.
2. Government official (gratitude) -Guidance of decision-making requires structured response and analysis.
3. Business owner- Permissions/events require visibility for their businesses and step-by-step guides.


## User Personality (resident)

- Name: Maria Lopez
- Age: 34
- Neighborhood: Ward 3
- Background: Full time work, local schools have two children.
- Need: wants to understand the government's proposal quickly, vote on issues affecting his neighborhood and sometimes discovering local events.
- Pain points: Long -proposal documents, limited time, vague response channel.
- Objective: Use regular English sums, share meaning with minimal attempts, feel his voice is counted.


## User Personality (business owner)

- Name: Priya Singh
- Age: 42
- Business: Priya's Café
- Neighborhood: Ward 2
- Background: Runs a small café, employs 5 people, active in local business association.
- Need: Wants to stay informed about new regulations, apply for event permits, and promote her business to residents.
- Pain points: Difficult permit processes, lack of clear communication from city officials, limited ways to reach local customers.
- Objective: Easily access step-by-step guides for permits, receive timely updates on regulations, and advertise local events or promotions.

## User Personality (government official)

- Name: David Kim
- Age: 50
- Role: City Planning Officer
- Department: Urban Development
- Background: Oversees local development proposals, responsible for community outreach and feedback collection.
- Need: Needs a structured way to present proposals, gather resident feedback, and analyze public sentiment efficiently.
- Pain points: Low engagement from residents, unstructured feedback, time-consuming manual analysis.
- Objective: Use AI-generated summaries to communicate proposals, visualize community responses, and make data-driven decisions quickly.

__________________


## User stories for Townhall

### 1. See local events

User Story: Like A Citizen, I want to see a list of local events so I can be informed of social events.

Acceptance criteria:

* Events appear in the chronological list.
* Each event shows the title, date, time and short description.
* Events can be clicked for details.
* Estimate: 3 points



### 2. Reply to events

User Story: As a citizen, I will respond to an event (eg/dislike) so I can express my opinion.

Acceptance criteria:

* Each event map button shows the choice/disliking button.
* Reactions are updated in real time.
* The user can react only once, but can change the response.
* Estimate: 2 points



### 3. Comment events

User Story: Like A Citizen, I want to comment on events so I can share my thoughts.

Acceptance criteria:

* The comment box is available on the event details page.
* The user must be logged in to comment.
* Comments are displayed in reverse chronological order.
* Estimate: 5 points



### 4. Create a business event

User Story: As a master in a business, I want to create an event so that the citizens can know about my offers.

Acceptance criteria:

* Professional role can reach the form "Event Create Event".
* Forms include title, details, date and alternative image.
* The incident must be approved by the administrator before publishing.
* Estimate: 5 points



### 5. Post a bill offer

User Story: Like A politician, I want to post a bill offer so that the citizens can review it.

Acceptance criteria:

* The role of a politician can submit a proposal with a title, summary and full lesson.
* The proposal is displayed on the citizen dashboard.
* Show the date of submission of the proposal and the name of the spokesman.
* Estimate: 8 points

### 6. Comment on the bill offer

User Story: Like A Citizen, I want to comment on a bill offer so I can give an answer.

Acceptance criteria:

* Login companies can post.
* Comments are shown in the threaded format under the proposal.
* Moderation system flag Incorrect material.
* Estimate: 5 points



### 7. Support/Oppose the bill

User Story: Like A Citizen, I will vote for a bill "support" or "protest" so that my attitude is recorded.

Acceptance criteria:

* Each bill has support/opposition stake.
* Residents can only vote per bill once.
* The results are shown as a single percentage diagram.
* Estimate: 3 points


### 8. Dashboard for business engagement

User Story: As a master in a business, I want to see characters on my events so I can measure efficiency.

Acceptance criteria:

* The Dashboard event shows the number of views, choices/disapproves and comments.
* Statistics update at least daily.
* Only available for the event Creator.
* Estimate: 8 points



### 9. Safe login and roles

User Story: As A User, I will safely log in to confirm my identity and role.

Acceptance criteria:

* Log in with e-mail + password encrypted storage.
* The rolls assigned (Civil / Business / Politician / Administrator).
* Users only see the features allowed by their role.
* Estimate: 8 points



### 10. Administrator moderation equipment

User Story: As A Administrator, I will create moderate content so that misinformation and abuse are prevented.

Acceptance criteria:

* The administrator may approve/reject business events.
* The administrator can remove inappropriate comments.
* Administrators can suspend users if necessary.
* Estimate: 13 ​​points

### Backlog Ordering Rationale
We preferred our backlog based on *core purposes and impact *:
- MVP first - citizens who look at citizens, officers who submit suggestions.
- The characteristics of the engagement next - reactions, comments, support/opposition mood.
- Analysis and dashboards previous - Business and Politician Metrics.
This order ensures that the product is immediately usable, so advanced features can settle in subsequent repetitions.


## Definition of Ready (DoR)
A Product Backlog item (PBI) is considered "clear" when it completes everyone:
- Title - short and descriptive.
- User Story - It is written as: "As a < stakehold>, I want <function> so that <the flavor>."
- Details / approval criteria - Clear testable conditions are listed.
Story point estimate - Relative trial was recorded in the approximate and crucial tracker.


## estimate approach
We estimated our PBI by using story points Planning poker Activity.
- The values ​​are from 1 (trivial) to 13 (complex).
- Estimates were made by the entire team to ensure shared understanding.

---

## Quick Start

For detailed setup instructions, please see [setup.md](setup.md)

**TL;DR:**
1. Clone the repository: `git clone https://github.com/sd2389/TownHall.git`
2. Follow the setup guide in `setup.md`
3. Start the backend: `python manage.py runserver`
4. Start the frontend: `cd frontend && npm run dev`

## Technology Stack

- **Backend**: Django (Python)
- **Frontend**: Next.js 15 (React + TypeScript)
- **Database**: MySQL
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion

## Project Structure

```
TownHall/
├── frontend/          # Next.js React application
├── businessowner/     # Django app for business owners
├── citizen/           # Django app for citizens
├── government/        # Django app for government officials
├── townhall_project/  # Django project settings
├── manage.py         # Django management script
├── requirements.txt  # Python dependencies
├── setup.md         # Detailed setup instructions
└── README.md        # This file
```

## Features

### Citizen Portal
- File and track complaints
- Vote on community proposals
- View announcements
- Access municipal services

### Business Portal
- Manage business licenses
- Submit permit applications
- View business-related announcements
- Track application status

### Government Portal
- Manage citizen complaints
- Create announcements
- Review business applications
- Generate reports
