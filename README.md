# WIA Project - Freelance Marketplace Platform

A full-stack web application connecting clients with freelancers. Clients can post jobs and hire talent, while freelancers can showcase their skills, build portfolios, and apply to opportunities.

## Features

### For Freelancers
- Create professional profiles with bio and profile picture
- Add and manage skills with detailed descriptions
- Build portfolio with projects linked to skills
- Browse and apply to job postings
- Save jobs for later review
- Track application status
- Configure contact methods (WhatsApp, Email, LinkedIn)

### For Clients
- Post job listings with title, description, budget, and deadlines
- Manage job postings (edit, delete, status updates)
- Review freelancer applications and proposals
- View freelancer profiles and portfolios
- Browse freelancer directory

### Core Features
- Secure authentication with email verification
- Role-based access (users can be both client and freelancer)
- Public job and freelancer discovery
- Real-time job search and filtering
- Rate limiting for API security

## Tech Stack

### Backend
- **Node.js** with **Express.js** - REST API server
- **PostgreSQL** - Database with connection pooling
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **Nodemailer/SendGrid** - Email services
- **Yup** - Input validation
- **Express-rate-limit** - API rate limiting

### Frontend
- **React 19** - UI framework with modern hooks
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **DaisyUI** - Component library
- **Framer Motion** - Animations
- **Formik** - Form management
- **Axios** - HTTP client
- **shadcn/ui** - UI components

## Project Structure

```
WIA-Project/
├── server/                    # Backend
│   ├── config/               # Database and mailer config
│   ├── routes/               # API route definitions
│   ├── controller/           # Request handlers
│   ├── middleware/           # Auth and rate limiting
│   ├── schemas/              # Input validation schemas
│   ├── utils/                # Helper functions
│   ├── schema.sql            # Database schema
│   └── server.js             # Express app entry
│
├── client/                   # Frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React Context (Auth)
│   │   ├── routes/          # Protected route wrapper
│   │   ├── lib/             # Utilities and helpers
│   │   └── App.jsx          # Main app component
│   └── public/              # Static assets
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Email service (Gmail or SendGrid)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WIA-Project
   ```

2. **Install dependencies**

   Backend:
   ```bash
   cd server
   npm install
   ```

   Frontend:
   ```bash
   cd client
   npm install
   ```

3. **Set up the database**
   - Create a PostgreSQL database
   - Run the schema file:
     ```bash
     psql -U your_user -d your_database -f server/schema.sql
     ```

4. **Configure environment variables**

   Create a `.env` file in the `server` directory:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@host:port/dbname

   # JWT Secrets
   ACCESS_TOKEN=your_access_token_secret
   REFRESH_TOKEN=your_refresh_token_secret
   VERIFICATION_TOKEN=your_verification_token_secret

   # Email Service (Gmail)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # OR SendGrid
   SENDGRID_API_KEY=your_sendgrid_api_key

   # Environment
   NODE_ENV=development
   PORT=3000
   CLIENT_URL=http://localhost:5173
   FRONTEND_ORIGIN=http://localhost:5173

   # Cloudinary
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   ```

5. **Run the application**

   Development mode (run both in separate terminals):

   Backend:
   ```bash
   cd server
   npm run dev
   ```

   Frontend:
   ```bash
   cd client
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`
   The backend API will be at `http://localhost:3000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get current user profile
- `POST /logout` - Logout user
- `GET /verify-email` - Verify email with token
- `POST /resend-verification` - Resend verification email

### Users (`/api/users`)
- `GET /freelancers` - Get all freelancers
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user profile

### Skills (`/api/skill`)
- `POST /` - Create new skill
- `GET /` - Get all skills
- `GET /user` - Get current user's skills
- `PUT /:id` - Update skill
- `DELETE /:id` - Delete skill

### Jobs (`/api/jobs`)
- `GET /jobposts` - Get all jobs
- `GET /user` - Get user's posted jobs
- `POST /job` - Create new job
- `PUT /:id` - Update job
- `DELETE /:id` - Delete job

### Job Applications (`/api/job-applications`)
- `POST /` - Apply to job
- `GET /job/:job_id` - Get applications for a job
- `GET /user` - Get user's applications
- `DELETE /user/:jobId` - Delete application

### Projects (`/api/projects`)
- `POST /` - Create project
- `GET /:id` - Get project by ID
- `PUT /:id` - Update project
- `DELETE /:id` - Delete project

### Saved Jobs (`/api/saved-jobs`)
- `GET /` - Get saved jobs
- `POST /` - Save/unsave a job
- `DELETE /delete/:job_id` - Delete saved job

### Contact Methods (`/api/contact`)
- `GET /:id` - Get contact methods
- `PUT /update` - Update contact methods

## Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User accounts with authentication
- **user_roles** - User role assignments (client/freelancer)
- **contact_methods** - User contact information
- **skills** - Freelancer skills with descriptions
- **projects** - Portfolio projects linked to skills
- **jobs** - Job postings by clients
- **job_applications** - Applications submitted by freelancers
- **saved_jobs** - Jobs saved by freelancers

## Security Features

- JWT-based authentication (15-min access tokens, 7-day refresh tokens)
- Email verification required for new accounts
- Password hashing with bcrypt
- Rate limiting (30 requests per 15 seconds)
- CORS protection
- Input validation on all endpoints
- Protected routes with middleware

## Development

### Build for Production
```bash
npm run build
```

### Run Production Server
```bash
node server.js
```

### Linting (Frontend)
```bash
cd client
npm run lint
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.