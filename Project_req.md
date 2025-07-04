# Freelance Marketplace Platform - Complete Overview

## Core Features

### User Management
Registration, login, and profile management for both clients and freelancers

### Skill System
Freelancers can add/manage their skills and showcase related projects

### Job Posting & Applications
Clients can post jobs, freelancers can apply, and both sides can manage applications

### Project Portfolio
Freelancers can showcase their work organized by skills

### Contact System
Methods for clients and freelancers to communicate

### Job Saving
Users can bookmark jobs for later

### Public Discovery
Browse freelancers and jobs without logging in, plus search functionality

## User Types

### Clients
Post jobs, review applications, hire freelancers

### Freelancers
Create profiles, showcase skills/projects, apply to jobs

---

# UI/UX Design Tasks - Freelance Marketplace

## Task 1: Authentication & Onboarding

**API Routes:**
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

**Pages/Components to Design:**
- Login page
- Registration page (with user type selection: Client vs Freelancer)
- Forgot password flow
- Profile setup wizard for new users
- Account verification screens

---

## Task 2: User Profile Management

**API Routes:**
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id

**Pages/Components to Design:**
- User profile view (public-facing)
- Profile edit/settings page
- Account deletion confirmation
- Profile completion indicators
- Avatar/photo upload interface

---

## Task 3: Freelancer Skills & Portfolio

**API Routes:**
- POST /api/skills
- GET /api/skills/user/:userId
- PUT /api/skills/:id
- DELETE /api/skills/:id
- POST /api/projects
- GET /api/projects/skill/:skillId
- GET /api/projects/:id
- PUT /api/projects/:id
- DELETE /api/projects/:id

**Pages/Components to Design:**
- Skills management interface
- Add/edit skill modal/form
- Project portfolio gallery
- Add/edit project form
- Project detail view
- Skill-based project filtering
- Portfolio organization by skills

---

## Task 4: Job Management (Client Side)

**API Routes:**
- POST /api/jobs
- GET /api/jobs/:id
- PUT /api/jobs/:id
- DELETE /api/jobs/:id

**Pages/Components to Design:**
- Create job posting form
- Job posting dashboard (client's posted jobs)
- Edit job posting interface
- Job detail view (client perspective)
- Job status management
- Delete job confirmation

---

## Task 5: Job Applications & Hiring

**API Routes:**
- POST /api/job-applications
- GET /api/job-applications/job/:jobId
- GET /api/job-applications/user/:userId

**Pages/Components to Design:**
- Job application form (freelancer side)
- Application management dashboard (freelancer's applications)
- Applicant review interface (client side)
- Application status tracking
- Application detail view
- Hire/reject freelancer interface

---

## Task 6: Communication & Contact

**API Routes:**
- GET /api/contact-methods
- POST /api/freelancer-contacts
- GET /api/freelancer-contacts/:userId

**Pages/Components to Design:**
- Contact preferences setup
- Contact freelancer modal/form
- Communication history
- Contact method selection interface
- In-app messaging system (if applicable)

---

## Task 7: Job Discovery & Browsing

**API Routes:**
- GET /api/jobs (public)
- GET /api/saved-jobs
- POST /api/saved-jobs
- DELETE /api/saved-jobs/:id

**Pages/Components to Design:**
- Public job browse page
- Job search and filtering interface
- Job listing cards/tiles
- Save job functionality (heart/bookmark icon)
- Saved jobs dashboard
- Job categories and tags

---

## Task 8: Freelancer Discovery

**API Routes:**
- GET /api/freelancers
- GET /api/freelancers/:id
- GET /api/search?query=design

**Pages/Components to Design:**
- Freelancer browse page
- Freelancer profile cards/tiles
- Freelancer search and filtering
- Advanced search interface
- Freelancer detail view (public profile)
- Skill-based freelancer filtering

---

## Task 9: Navigation & Layout

**Cross-cutting concerns for all routes**

**Components to Design:**
- Main navigation/header (different states for logged in/out, client/freelancer)
- Mobile navigation/hamburger menu
- Footer
- Dashboard sidebar navigation
- Breadcrumb navigation
- User role switching (if users can be both client and freelancer)

---

## Task 10: Responsive & Mobile Experience

**All routes need mobile optimization**

**Focus Areas:**
- Mobile-first responsive design
- Touch-friendly interfaces
- Mobile job application flow
- Mobile portfolio browsing
- Mobile search and filtering
- Progressive web app considerations