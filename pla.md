# 🚀 Dayflow - HRMS Implementation Plan

> **Every workday, perfectly aligned.**

---

## 📋 Project Overview

| Attribute | Details |
|-----------|---------|
| **Project Name** | Dayflow - Human Resource Management System |
| **Team Size** | 3 Developers |
| **Timeline** | 8 Hours |
| **Architecture** | Monolithic (Next.js + Express.js) |
| **Frontend** | Next.js (React) |
| **Backend** | Express.js (Node.js) |

---

## 👥 Team Allocation

### 🧑‍💻 Developer 1 - Frontend Lead
**Focus Areas:** UI/UX, Authentication Pages, Dashboard
- **Hours 1-2:** Authentication UI (Sign Up, Sign In)
- **Hours 3-4:** Employee Dashboard & Admin Dashboard
- **Hours 5-6:** Profile Management UI
- **Hours 7-8:** Final Integration & Polish

### 🧑‍💻 Developer 2 - Backend Lead
**Focus Areas:** API Development, Database, Authentication
- **Hours 1-2:** Database Schema, Authentication APIs
- **Hours 3-4:** Employee & Profile APIs
- **Hours 5-6:** Attendance & Leave APIs
- **Hours 7-8:** Payroll APIs & Testing

### 🧑‍💻 Developer 3 - Full Stack Support
**Focus Areas:** Attendance UI, Leave Management, Payroll Views
- **Hours 1-2:** Attendance Tracking UI
- **Hours 3-4:** Leave Management UI
- **Hours 5-6:** Payroll View UI
- **Hours 7-8:** Integration & Bug Fixes

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React Framework with App Router |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | Styling |
| **Shadcn/UI** | Component Library |
| **React Hook Form** | Form Handling |
| **Zod** | Validation |
| **Axios** | HTTP Client |

### Backend
| Technology | Purpose |
|------------|---------|
| **Express.js** | REST API Server |
| **TypeScript** | Type Safety |
| **Prisma** | ORM |
| **PostgreSQL** | Database |
| **JWT** | Authentication |
| **Bcrypt** | Password Hashing |
| **Zod** | Validation |

### DevOps
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization (Optional) |
| **Vercel** | Frontend Deployment |
| **Railway/Render** | Backend Deployment |

---

## 📁 Project Structure

```
dayflow/
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── signup/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── employees/
│   │   │   │   │   ├── attendance/
│   │   │   │   │   ├── leave-requests/
│   │   │   │   │   └── payroll/
│   │   │   │   ├── employee/
│   │   │   │   │   ├── profile/
│   │   │   │   │   ├── attendance/
│   │   │   │   │   ├── leave/
│   │   │   │   │   └── salary/
│   │   │   │   └── layout.tsx
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/             # Shadcn components
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── attendance/
│   │   │   ├── leave/
│   │   │   └── payroll/
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── utils.ts
│   │   ├── hooks/
│   │   ├── types/
│   │   └── context/
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
└── backend/                    # Express.js Backend
    ├── src/
    │   ├── controllers/
    │   │   ├── auth.controller.ts
    │   │   ├── employee.controller.ts
    │   │   ├── attendance.controller.ts
    │   │   ├── leave.controller.ts
    │   │   └── payroll.controller.ts
    │   ├── routes/
    │   │   ├── auth.routes.ts
    │   │   ├── employee.routes.ts
    │   │   ├── attendance.routes.ts
    │   │   ├── leave.routes.ts
    │   │   └── payroll.routes.ts
    │   ├── middleware/
    │   │   ├── auth.middleware.ts
    │   │   └── role.middleware.ts
    │   ├── services/
    │   ├── utils/
    │   ├── validations/
    │   ├── prisma/
    │   │   └── schema.prisma
    │   └── index.ts
    ├── package.json
    └── tsconfig.json
```

---

## 🗄️ Database Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  HR
  EMPLOYEE
}

enum LeaveType {
  PAID
  SICK
  UNPAID
  CASUAL
}

enum LeaveStatus {
  PENDING
  APPROVED
  REJECTED
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  HALF_DAY
  LEAVE
}

model User {
  id            String         @id @default(uuid())
  employeeId    String         @unique
  email         String         @unique
  password      String
  role          Role           @default(EMPLOYEE)
  isVerified    Boolean        @default(false)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  
  profile       Profile?
  attendance    Attendance[]
  leaveRequests LeaveRequest[]
  
  @@map("users")
}

model Profile {
  id            String   @id @default(uuid())
  userId        String   @unique
  firstName     String
  lastName      String
  phone         String?
  address       String?
  dateOfBirth   DateTime?
  department    String?
  designation   String?
  joiningDate   DateTime?
  profilePicture String?
  
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  salary        Salary?
  documents     Document[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("profiles")
}

model Salary {
  id            String   @id @default(uuid())
  profileId     String   @unique
  basicSalary   Float
  allowances    Float    @default(0)
  deductions    Float    @default(0)
  netSalary     Float
  
  profile       Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("salaries")
}

model Document {
  id            String   @id @default(uuid())
  profileId     String
  name          String
  type          String
  url           String
  
  profile       Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime @default(now())
  
  @@map("documents")
}

model Attendance {
  id            String           @id @default(uuid())
  userId        String
  date          DateTime         @db.Date
  checkIn       DateTime?
  checkOut      DateTime?
  status        AttendanceStatus @default(PRESENT)
  workHours     Float?
  
  user          User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
  
  @@unique([userId, date])
  @@map("attendance")
}

model LeaveRequest {
  id            String      @id @default(uuid())
  userId        String
  leaveType     LeaveType
  startDate     DateTime    @db.Date
  endDate       DateTime    @db.Date
  reason        String
  status        LeaveStatus @default(PENDING)
  adminComment  String?
  reviewedBy    String?
  reviewedAt    DateTime?
  
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  @@map("leave_requests")
}
```

---

## 🔌 API Endpoints

### 1. Authentication APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/signup` | Register new user | Public |
| `POST` | `/api/auth/login` | User login | Public |
| `POST` | `/api/auth/logout` | User logout | Authenticated |
| `GET` | `/api/auth/me` | Get current user | Authenticated |
| `POST` | `/api/auth/verify-email` | Verify email | Public |
| `POST` | `/api/auth/forgot-password` | Request password reset | Public |
| `POST` | `/api/auth/reset-password` | Reset password | Public |

### 2. Employee/Profile APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/employees` | Get all employees | Admin/HR |
| `GET` | `/api/employees/:id` | Get employee by ID | Admin/HR/Self |
| `PUT` | `/api/employees/:id` | Update employee | Admin/HR |
| `DELETE` | `/api/employees/:id` | Delete employee | Admin |
| `GET` | `/api/profile` | Get own profile | Authenticated |
| `PUT` | `/api/profile` | Update own profile (limited) | Authenticated |
| `POST` | `/api/profile/picture` | Upload profile picture | Authenticated |

### 3. Attendance APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/attendance/check-in` | Mark check-in | Employee |
| `POST` | `/api/attendance/check-out` | Mark check-out | Employee |
| `GET` | `/api/attendance` | Get own attendance | Authenticated |
| `GET` | `/api/attendance/daily` | Get today's attendance | Authenticated |
| `GET` | `/api/attendance/weekly` | Get weekly attendance | Authenticated |
| `GET` | `/api/attendance/monthly` | Get monthly attendance | Authenticated |
| `GET` | `/api/admin/attendance` | Get all employees' attendance | Admin/HR |
| `GET` | `/api/admin/attendance/:userId` | Get specific employee attendance | Admin/HR |
| `PUT` | `/api/admin/attendance/:id` | Update attendance record | Admin/HR |

### 4. Leave Management APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/leave` | Apply for leave | Employee |
| `GET` | `/api/leave` | Get own leave requests | Authenticated |
| `GET` | `/api/leave/:id` | Get leave request details | Authenticated |
| `PUT` | `/api/leave/:id` | Update leave request | Employee (Pending only) |
| `DELETE` | `/api/leave/:id` | Cancel leave request | Employee (Pending only) |
| `GET` | `/api/admin/leave` | Get all leave requests | Admin/HR |
| `GET` | `/api/admin/leave/pending` | Get pending leave requests | Admin/HR |
| `PUT` | `/api/admin/leave/:id/approve` | Approve leave request | Admin/HR |
| `PUT` | `/api/admin/leave/:id/reject` | Reject leave request | Admin/HR |

### 5. Payroll/Salary APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/salary` | Get own salary details | Authenticated |
| `GET` | `/api/admin/salary` | Get all employees' salary | Admin/HR |
| `GET` | `/api/admin/salary/:userId` | Get specific employee salary | Admin/HR |
| `PUT` | `/api/admin/salary/:userId` | Update employee salary | Admin |
| `POST` | `/api/admin/salary/:userId` | Create salary record | Admin |

---

## 📱 UI Pages & Components

### Authentication Pages

#### 1. Sign Up Page (`/signup`)
**Components:**
- Form with fields: Employee ID, Email, Password, Confirm Password, Role selection
- Password strength indicator
- Terms & Conditions checkbox
- Submit button
- Link to Login page

#### 2. Sign In Page (`/login`)
**Components:**
- Form with fields: Email, Password
- Remember me checkbox
- Forgot Password link
- Submit button
- Link to Sign Up page

---

### Employee Dashboard (`/employee/dashboard`)
**Components:**
- Welcome banner with profile picture
- Quick access cards:
  - 📊 Profile Card (View/Edit Profile)
  - 📅 Attendance Card (Today's status, Check-in/out buttons)
  - 📝 Leave Card (Pending requests count, Apply button)
  - 💰 Salary Card (Current month salary info)
- Recent activity feed
- Current date/time display
- Logout button

---

### Admin/HR Dashboard (`/admin/dashboard`)
**Components:**
- Overview statistics cards:
  - Total Employees
  - Present Today
  - Pending Leave Requests
  - Monthly Payroll
- Quick action buttons
- Employee list table (paginated)
- Leave requests widget (pending)
- Attendance summary chart
- Navigation sidebar

---

### Profile Pages

#### Employee Profile View (`/employee/profile`)
**Sections:**
- Personal Information (Name, Email, Phone, DOB, Address)
- Job Information (Employee ID, Department, Designation, Joining Date)
- Salary Structure (Read-only)
- Documents list
- Profile picture with edit option

#### Admin Employee Edit (`/admin/employees/:id`)
**Features:**
- All profile fields editable
- Salary structure management
- Document upload/management
- Delete employee option

---

### Attendance Pages

#### Employee Attendance (`/employee/attendance`)
**Components:**
- Check-in/Check-out buttons with time display
- Today's status
- Calendar view (monthly)
- Weekly attendance table
- Status legend (Present, Absent, Half-day, Leave)

#### Admin Attendance (`/admin/attendance`)
**Components:**
- Employee selector dropdown
- Date range filter
- Attendance table with all employees
- Edit attendance modal
- Export options
- Statistics summary

---

### Leave Management Pages

#### Apply Leave (`/employee/leave`)
**Components:**
- Leave request form:
  - Leave type selector (Paid, Sick, Unpaid, Casual)
  - Date range picker (Start/End date)
  - Reason textarea
  - Submit button
- Leave history table
- Leave balance display
- Status badges (Pending, Approved, Rejected)

#### Leave Approvals (`/admin/leave-requests`)
**Components:**
- Tab navigation (All, Pending, Approved, Rejected)
- Leave requests table
- Employee info with request details
- Approve/Reject buttons
- Comment input for rejection
- Filter by date range
- Filter by leave type

---

### Payroll Pages

#### Employee Salary View (`/employee/salary`)
**Components:**
- Current month salary breakdown card
- Basic salary, Allowances, Deductions display
- Net salary calculation
- Payment history table (if applicable)
- Download salary slip button (future)

#### Admin Payroll Management (`/admin/payroll`)
**Components:**
- Employee list with salary info
- Edit salary modal:
  - Basic salary input
  - Allowances input
  - Deductions input
  - Auto-calculated net salary
- Payroll summary statistics
- Export options

---

## ⏰ Implementation Timeline (8 Hours)

### Hour 1-2: Foundation & Authentication

| Developer | Tasks |
|-----------|-------|
| **Dev 1** | Setup Next.js project, Tailwind, Shadcn/UI, Create Login/Signup pages |
| **Dev 2** | Setup Express.js, Prisma, Database schema, Auth APIs (signup, login, JWT) |
| **Dev 3** | Create shared UI components (Button, Input, Card, Form) |

### Hour 3-4: Dashboards & Profile

| Developer | Tasks |
|-----------|-------|
| **Dev 1** | Employee Dashboard UI, Admin Dashboard UI, Navigation/Sidebar |
| **Dev 2** | Employee CRUD APIs, Profile APIs, Role middleware |
| **Dev 3** | Profile view/edit pages, Document upload component |

### Hour 5-6: Attendance & Leave

| Developer | Tasks |
|-----------|-------|
| **Dev 1** | Polish dashboards, Integrate APIs, Fix bugs |
| **Dev 2** | Attendance APIs, Leave request APIs, Leave approval APIs |
| **Dev 3** | Attendance tracking UI, Leave management UI, Calendar component |

### Hour 7-8: Payroll & Final Integration

| Developer | Tasks |
|-----------|-------|
| **Dev 1** | Full integration testing, UI polish, Responsive fixes |
| **Dev 2** | Payroll APIs, Final API testing, Bug fixes |
| **Dev 3** | Payroll view UI, Admin payroll management, Final testing |

---

## ✅ MVP Features Checklist

### Must Have (Core MVP)
- [x] User Registration (Sign Up)
- [x] User Login (Sign In)
- [x] Role-based access (Admin/HR vs Employee)
- [x] Employee Dashboard
- [x] Admin Dashboard
- [x] View Profile
- [x] Edit Profile (limited for employees)
- [x] Daily attendance check-in/check-out
- [x] View attendance (daily/weekly)
- [x] Apply for leave
- [x] View leave requests
- [x] Approve/Reject leave (Admin)
- [x] View salary details (read-only for employee)

### Nice to Have (If Time Permits)
- [ ] Email verification
- [ ] Password reset flow
- [ ] Document upload/management
- [ ] Monthly attendance calendar view
- [ ] Leave balance tracking
- [ ] Payroll editing (Admin)
- [ ] Export to PDF/Excel

### Future Enhancements (Post-Hackathon)
- [ ] Email & notification alerts
- [ ] Analytics & reports dashboard
- [ ] Salary slips generation
- [ ] Attendance reports export
- [ ] Mobile responsive optimization
- [ ] Dark mode support

---

## 🔐 Security Considerations

1. **Password Security:** Bcrypt hashing with salt rounds
2. **JWT Tokens:** Secure token generation with expiry
3. **Input Validation:** Zod schemas for all inputs
4. **Role-based Access:** Middleware for route protection
5. **CORS:** Proper CORS configuration
6. **Environment Variables:** Sensitive data in .env files

---

## 📝 Notes

### Excalidraw Reference
> **Link:** [Excalidraw Design](https://link.excalidraw.com/l/65VNwvy7c4X/58RLEJ4oOwh)
> 
> ⚠️ **Note:** Unable to access Excalidraw link programmatically. Please manually review the design reference and adjust UI implementations accordingly.

### Quick Start Commands

```bash
# Frontend Setup
cd frontend
npm install
npm run dev

# Backend Setup
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Backend (.env):**
```
DATABASE_URL=postgresql://user:password@localhost:5432/dayflow
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=5000
```

---

## 🎯 Success Criteria

1. ✅ Users can register and login successfully
2. ✅ Role-based dashboards are functional
3. ✅ Employees can view/edit their profile
4. ✅ Employees can check-in/check-out for attendance
5. ✅ Employees can apply for leave
6. ✅ Admin/HR can view all employees
7. ✅ Admin/HR can approve/reject leave requests
8. ✅ Salary information is viewable
9. ✅ Application is deployable and demo-ready

---

**Good luck with the hackathon! 🚀**