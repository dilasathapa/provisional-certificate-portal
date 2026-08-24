# Provisional Certificate Portal

A full-stack web application for submitting and managing provisional certificate applications online.

The portal provides a secure workflow where applicants can create an application, enter personal and registration details, upload required PDF documents, review their information, submit the application, and receive a professionally generated acknowledgment PDF.

The application is deployed using **Vercel** for the frontend and **Render** for the backend, with **MongoDB Atlas** for persistent data storage and **Amazon S3** for document storage.

---

### Live Application

**Frontend:**
https://provisional-certificate-portal.vercel.app/login

**Backend API:**
https://provisional-certificate-portal.onrender.com/

**API Health Check:**
https://provisional-certificate-portal.onrender.com/api/health

---

### Features

#### Authentication

* User registration
* User login
* User logout
* Authentication using JWT
* HTTP-only authentication cookies
* Protected application routes
* Current-user session restoration
* Password hashing using bcrypt

#### Application Management

* Create provisional certificate applications
* Save applicant information
* Application reference number generation
* Draft and submitted application states
* View all applications belonging to the authenticated user
* View individual application details
* Ownership-based access control

#### Multi-Step Application Form

The application process is divided into three steps:

1. **Personal Details**

   * Full name
   * Date of birth
   * Registration number
   * Address

2. **Documents**

   * ID Proof
   * Degree Certificate
   * PDF-only uploads
   * Maximum file size of 5 MB per document

3. **Review & Submit**

   * Review applicant information
   * Review uploaded documents
   * Submit the application

#### Validation

Frontend validation is implemented using:

* React Hook Form
* Zod
* Browser-level date restrictions
* File type validation
* File size validation


Backend validation and error handling are implemented independently so that the API does not rely solely on frontend validation.

#### Document Storage

Uploaded documents are stored in Amazon S3.

Documents are organized using a structured key:

```text
users/
  {userId}/
    applications/
      {applicationId}/
        {documentType}-{timestamp}-{filename}
```

The application stores document metadata in MongoDB while the actual files are stored in S3.

#### Acknowledgment PDF

After an application is successfully submitted:

1. A unique application reference number is generated.
2. The application status changes from `Draft` to `Submitted`.
3. An acknowledgment PDF is generated using PDFKit.
4. The PDF is uploaded to Amazon S3.
5. The generated document is recorded in MongoDB.
6. The user can download the acknowledgment through a temporary signed URL.

The acknowledgment PDF contains:

* Application reference number
* Applicant details
* Date of birth
* Registration number
* Address
* Application status
* Submission timestamp
* Submitted document information
* System-generated footer

#### Dashboard

Authenticated users can:

* View their submitted applications
* See application status
* View application reference numbers
* Download acknowledgment PDFs

#### UI

The frontend uses a clean professional interface designed around a blue, teal, and neutral color palette.

The application includes:

* Responsive layouts
* Sticky navigation
* Multi-step progress indicator
* Consistent form styling
* Document upload cards
* Review sections
* Status badges
* Responsive mobile layouts
* Loading and error states

---

### Tech Stack

#### Frontend

* React
* Vite
* React Router
* Tailwind CSS
* React Hook Form
* Zod
* Axios

#### Backend

* Node.js
* Express
* MongoDB
* Mongoose
* JWT
* bcrypt
* Zod
* Multer
* PDFKit

#### Cloud & Infrastructure

* MongoDB Atlas
* Amazon S3
* Vercel
* Render

#### Security

* Helmet
* Express Rate Limit
* HTTP-only cookies
* JWT authentication
* Password hashing
* CORS configuration
* User/application ownership checks
* S3 signed URLs

---

### Architecture

```text
                         ┌─────────────────────────┐
                         │        User             │
                         │     Web Browser         │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │      Vercel             │
                         │   React + Vite          │
                         │   Tailwind CSS          │
                         └────────────┬────────────┘
                                      │
                              HTTPS / REST API
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │       Render            │
                         │   Node.js + Express     │
                         │                         │
                         │ Authentication          │
                         │ Application APIs        │
                         │ Document APIs           │
                         │ PDF generation          │
                         └───────┬─────────┬───────┘
                                 │         │
                    ┌────────────┘         └────────────┐
                    ▼                                   ▼
          ┌──────────────────┐                ┌──────────────────┐
          │  MongoDB Atlas   │                │    Amazon S3     │
          │                  │                │                  │
          │ Users            │                │ Uploaded PDFs    │
          │ Applications     │                │ Acknowledgments  │
          │ Documents        │                │                  │
          └──────────────────┘                └──────────────────┘
```

---

### Application Flow

#### 1. Registration

The user creates an account using an email address and password.

```text
User
  ↓
POST /api/auth/register
  ↓
Validate input
  ↓
Hash password
  ↓
Create User
  ↓
Generate JWT
  ↓
Set HTTP-only cookie
```

#### 2. Login

```text
User
  ↓
POST /api/auth/login
  ↓
Validate credentials
  ↓
Compare hashed password
  ↓
Generate JWT
  ↓
Set authentication cookie
```

#### 3. Create Application

The authenticated user completes the first step of the application.

```text
Personal Details
       ↓
POST /api/applications
       ↓
Create Draft Application
       ↓
Return Application ID
```

#### 4. Upload Documents

Each required document is uploaded separately.

```text
PDF File
   ↓
Multer memory storage
   ↓
Validate file type/size
   ↓
Generate S3 object key
   ↓
Upload to Amazon S3
   ↓
Save document metadata in MongoDB
```

#### 5. Submit Application

```text
Draft Application
       ↓
POST /api/applications/:id/submit
       ↓
Verify ownership
       ↓
Generate reference number
       ↓
Change status → Submitted
       ↓
Generate acknowledgment PDF
       ↓
Upload PDF to S3
       ↓
Create acknowledgment document record
       ↓
Return submission response
```

#### 6. Download Acknowledgment

The application does not expose the S3 object directly.

Instead:

```text
User
  ↓
GET /api/applications/:id/acknowledgment
  ↓
Verify authenticated user
  ↓
Verify application ownership
  ↓
Generate temporary S3 signed URL
  ↓
Return URL
```

> This allows documents to remain private while still providing temporary download access.

---

### Project Structure

```text
provisional-certificate-portal/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── s3.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── application.controller.js
│   │   │   ├── auth.controller.js
│   │   │   └── document.controller.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── upload.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── Application.js
│   │   │   ├── Document.js
│   │   │   └── User.js
│   │   │
│   │   ├── routes/
│   │   │   ├── application.routes.js
│   │   │   ├── auth.routes.js
│   │   │   └── document.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── application-pdf.service.js
│   │   │   ├── application.service.js
│   │   │   ├── auth.service.js
│   │   │   ├── document.service.js
│   │   │   ├── pdf.service.js
│   │   │   └── storage.service.js
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── referenceNumber.js
│   │   │   └── reference.util.js
│   │   │
│   │   ├── validators/
│   │   │   ├── application.validator.js
│   │   │   └── auth.validator.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── application.api.js
│   │   │   ├── axios.js
│   │   │   └── document.api.js
│   │   │
│   │   ├── components/
│   │   │   └── StatusBadge.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── AppLayout.jsx
│   │   │   └── AuthLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── applications/
│   │   │       ├── NewApplication.jsx
│   │   │       ├── components/
│   │   │       └── steps/
│   │   │
│   │   └── routes/
│   │       ├── AppRoutes.jsx
│   │       └── ProtectedRoute.jsx
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

---

### API Endpoints

#### Authentication

| Method | Endpoint             | Description         | Auth |
| ------ | -------------------- | ------------------- | ---- |
| POST   | `/api/auth/register` | Register a new user | No   |
| POST   | `/api/auth/login`    | Login user          | No   |
| POST   | `/api/auth/logout`   | Logout user         | Yes  |
| GET    | `/api/auth/me`       | Get current user    | Yes  |

#### Applications

| Method | Endpoint                               | Description                   | Auth |
| ------ | -------------------------------------- | ----------------------------- | ---- |
| POST   | `/api/applications`                    | Create draft application      | Yes  |
| GET    | `/api/applications`                    | Get user's applications       | Yes  |
| GET    | `/api/applications/:id`                | Get application details       | Yes  |
| POST   | `/api/applications/:id/submit`         | Submit application            | Yes  |
| GET    | `/api/applications/:id/acknowledgment` | Get signed acknowledgment URL | Yes  |

#### Documents

| Method | Endpoint                                     | Description                 | Auth |
| ------ | -------------------------------------------- | --------------------------- | ---- |
| POST   | `/api/documents/applications/:applicationId` | Upload application document | Yes  |
| GET    | `/api/documents/:documentId/download`        | Get signed document URL     | Yes  |

#### Health

| Method | Endpoint      | Description      |
| ------ | ------------- | ---------------- |
| GET    | `/api/health` | API health check |

---

### Environment Variables

#### Backend

Create:

```text
backend/.env
```

```env
PORT=

FRONTEND_URL=

MONGODB_URI=

JWT_SECRET=

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
```

#### Frontend

Create:

```text
frontend/.env
```

```env
VITE_API_URL=http://localhost:5001/api
```

> For production:

```env
VITE_API_URL=https://provisional-certificate-portal.onrender.com/api
```

---

### Local Development

#### Prerequisites

Make sure you have:

* Node.js
* npm
* MongoDB Atlas account
* AWS account with an S3 bucket
* Git

#### Clone the repository

```bash
git clone https://github.com/dilasathapa/provisional-certificate-portal.git

cd provisional-certificate-portal
```

---

#### Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5001
FRONTEND_URL=http://localhost:5173

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name
```

Start development server:

```bash
npm run dev
```

Backend:

```text
http://localhost:5001
```

Health check:

```text
http://localhost:5001/api/health
```

---

#### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

Start the development server:

```bash
npm run dev
```

The Vite development server will provide the local frontend URL.

---

### Production Deployment

#### Frontend — Vercel

The frontend is deployed on Vercel.

Configuration:

```text
Framework: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Production environment variable:

```env
VITE_API_URL=https://provisional-certificate-portal.onrender.com/api
```

#### Backend — Render

The backend is deployed on Render.

Configuration:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

The backend receives its production environment variables through Render's environment configuration.

#### Database — MongoDB Atlas

MongoDB Atlas stores:

* User accounts
* Application records
* Document metadata

#### File Storage — Amazon S3

Amazon S3 stores:

* ID proofs
* Degree certificates
* Generated acknowledgment PDFs

---

### Security

Several security practices are implemented in the application.

#### Authentication

Passwords are hashed using bcrypt rather than stored as plaintext.

Authentication tokens are stored in HTTP-only cookies to reduce exposure to client-side JavaScript.

#### Authorization

Protected endpoints verify:

```text
Authenticated user
        +
Resource ownership
```

For example, a user can only access applications where:

```text
application.userId === authenticatedUser._id
```

#### File Validation

Uploaded documents are restricted to:

```text
PDF
Maximum 5 MB
```

#### Signed URLs

S3 files are not publicly exposed.

Temporary signed URLs are generated when a user requests a document.

#### HTTP Security Headers

Helmet is used to add common HTTP security headers.

#### Rate Limiting

The API uses `express-rate-limit` to limit excessive requests.

#### CORS

The production backend only accepts requests from the configured frontend origin.

---

### Application States

Applications currently support the following states:

```text
Draft
  │
  ▼
Submitted
  │
  ▼
Completed
```

The current submission workflow transitions an application from:

```text
Draft → Submitted
```

The `Completed` state is reserved for future processing workflows.

---

### Future Improvements

Potential future improvements include:

* Admin dashboard
* Application review workflow
* Application status tracking
* Email notifications
* OTP/email verification
* Application editing before submission
* Document replacement functionality
* Audit logs
* PDF digital signatures
* Automated document verification
* Automated testing
* CI/CD pipeline
* Role-based access control
* Pagination for applications
* Advanced application search and filtering

---

### Screens & Workflow

The primary user journey is:

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
New Application
   ↓
Personal Details
   ↓
Upload Documents
   ↓
Review
   ↓
Submit
   ↓
Application Submitted
   ↓
Acknowledgment PDF
   ↓
Dashboard
   ↓
Download PDF
```

---

Built using React, Node.js, Express, MongoDB, AWS S3, and modern deployment infrastructure.

---

### License

This project is intended for demonstration and portfolio purposes.
