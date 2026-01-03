# DayFlow Server - Employee Authentication & Management API

A robust, secure, and scalable employee authentication and management system built with Express.js, MongoDB, and TypeScript.

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Authentication Flow](#-authentication-flow)
- [Role-Based Access Control](#-role-based-access-control)
- [Login ID Format](#-login-id-format)

## 🚀 Features

- ✅ **Role-Based Authentication** - Three roles: Employee, HR, Admin
- ✅ **Auto-Generated Login ID** - Unique format based on company, name, year, and serial number
- ✅ **Auto-Generated Secure Password** - System generates initial password for new employees
- ✅ **JWT Authentication** - Access tokens and refresh tokens for secure sessions
- ✅ **Zod Validation** - Comprehensive request validation
- ✅ **Password Management** - Force password change on first login, password reset by HR/Admin
- ✅ **Employee Management** - CRUD operations with role-based permissions
- ✅ **Rate Limiting** - Protection against brute force attacks

## 🛠 Technology Stack

| Technology | Purpose |
|------------|---------|
| Express.js | Web framework |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database |
| JWT | Token-based authentication |
| Bcrypt | Password hashing |
| Zod | Schema validation |

## 📁 Project Structure

```
src/
├── controllers/
│   ├── employee.controller.ts    # HTTP request handlers
│   └── index.ts
├── db/
│   ├── connection.ts            # MongoDB connection
│   └── index.ts
├── middleware/
│   ├── auth.middleware.ts       # Authentication & authorization
│   ├── error.middleware.ts      # Error handling
│   ├── validation.middleware.ts # Request validation
│   └── index.ts
├── models/
│   ├── employee.model.ts        # Employee mongoose schema
│   └── index.ts
├── routes/
│   ├── employee.routes.ts       # Employee API routes
│   └── index.ts
├── services/
│   ├── employee.service.ts      # Business logic
│   └── index.ts
├── utils/
│   ├── auth.utils.ts            # JWT, password, login ID utilities
│   ├── response.utils.ts        # Response helpers & error classes
│   └── index.ts
├── validations/
│   ├── employee.validation.ts   # Zod validation schemas
│   └── index.ts
├── app.ts                       # Express app configuration
└── server.ts                    # Server entry point
```

## 🔑 Environment Variables

Add the following variables to your `.env` file:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/database"

# JWT Secrets (IMPORTANT: Generate secure random strings for production)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-at-least-32-characters-long

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:3000
```

### Generating Secure JWT Secrets

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64
```

## 📦 Installation

```bash
# Install dependencies
bun install

# Build TypeScript
bun run build

# Start server
bun run start
```

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Response Format
All API responses follow this structure:

```json
{
  "success": true|false,
  "message": "Human readable message",
  "data": { ... },           // Optional: Response data
  "errors": ["..."],         // Optional: Validation errors
  "meta": {                  // Optional: Pagination info
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

### 🔓 Public Routes

#### Login
```http
POST /api/employees/login
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",  // OR use loginId
  "loginId": "TSIJODO202601",        // OR use email
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful. Please change your password.",
}
```

#### Refresh Token
```http
POST /api/employees/refresh-token
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbG..."
}
```

---

### 🔐 Authenticated Routes (Require Bearer Token)

**Headers:**
```
Authorization: Bearer <access_token>
```

#### Get Profile
```http
GET /api/employees/me
```

#### Update Profile
```http
PATCH /api/employees/me
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+1234567890",
  "imageUrl": "https://example.com/photo.jpg"
}
```

#### Change Password
```http
POST /api/employees/change-password
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "NewP@ssw0rd!",
  "confirmPassword": "NewP@ssw0rd!"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

#### Logout
```http
POST /api/employees/logout
```

---

### 👥 HR & Admin Routes

#### Create Employee
```http
POST /api/employees
```

**Request Body:**
```json
{
  "companyName": "Tech Solutions Inc",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "imageUrl": "https://example.com/photo.jpg",
  "role": "employee"  // "employee" | "hr" | "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "employee": { ... },
    "loginId": "TSIJODO202601",
    "temporaryPassword": "aB3@kLm9pQ1!"
  }
}
```

#### Get All Employees
```http
GET /api/employees?page=1&limit=10&role=employee&isActive=true
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| role | string | Filter by role (employee, hr, admin) |
| companyName | string | Filter by company name |
| isActive | boolean | Filter by active status |

#### Search Employees
```http
GET /api/employees/search?q=john&page=1&limit=10
```

#### Get Employee by ID (loginId)
```http
GET /api/employees/:id
```

#### Deactivate Employee
```http
PATCH /api/employees/:id/deactivate
```

#### Activate Employee
```http
PATCH /api/employees/:id/activate
```

#### Reset Employee Password
```http
POST /api/employees/:id/reset-password
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": {
    "temporaryPassword": "xY7#mNp2qR4!"
  }
}
```

---

### 👑 Admin Only Routes

#### Update Employee Role
```http
PATCH /api/employees/:id/role
```

**Request Body:**
```json
{
  "role": "hr"  // "employee" | "hr" | "admin"
}
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      EMPLOYEE CREATION FLOW                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. HR/Admin creates employee                                   │
│          ↓                                                      │
│  2. System generates:                                           │
│     • Unique Login ID (e.g., TSIJODO202601)                     │
│     • Temporary password (e.g., aB3@kLm9pQ1!)                   │
│          ↓                                                      │
│  3. HR/Admin shares credentials with employee                   │
│          ↓                                                      │
│  4. Employee logs in with email/loginId + temp password         │
│          ↓                                                      │
│  5. System flags: passwordChangeRequired = true                 │
│          ↓                                                      │
│  6. Employee changes password                                   │
│          ↓                                                      │
│  7. Employee can now use system normally                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🎭 Role-Based Access Control

| Action | Employee | HR | Admin |
|--------|:--------:|:--:|:-----:|
| Login | ✅ | ✅ | ✅ |
| View own profile | ✅ | ✅ | ✅ |
| Update own profile | ✅ | ✅ | ✅ |
| Change own password | ✅ | ✅ | ✅ |
| Create employees | ❌ | ✅ | ✅ |
| View all employees | ❌ | ✅ | ✅ |
| Deactivate employees | ❌ | ✅* | ✅ |
| Reset employee password | ❌ | ✅* | ✅ |
| Change employee role | ❌ | ❌ | ✅ |

*HR can only manage regular employees, not other HRs or Admins.

## 🆔 Login ID Format

Login IDs are auto-generated with the following format:

```
[Company Initials][Name Initials][Year][Serial Number]
```

**Example:**
```
Company: "Tech Solutions Inc" → TSI
First Name: "John"           → JO
Last Name: "Doe"             → DO
Year: 2026
Serial: 01

Login ID: TSIJODO202601
```

**Breakdown:**
| Part | Description | Example |
|------|-------------|---------|
| Company Initials | First letter of each word (max 3) | TSI |
| Name Initials | First 2 letters of first + last name | JODO |
| Year | 4-digit joining year | 2026 |
| Serial | 2-digit sequence number | 01 |

## 🔒 Security Features

1. **Password Hashing** - Bcrypt with 12 salt rounds
2. **JWT Tokens** - Short-lived access tokens (15min), long-lived refresh tokens (7 days)
3. **Rate Limiting** - 5 login attempts per 15 minutes
4. **Role-Based Access** - Controlled access to sensitive operations
5. **Password Validation** - Strong password requirements enforced
6. **Mongoose Sanitization** - Protection against NoSQL injection

## 📝 HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## 🧪 Testing the API

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:8000/api/employees/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password123"}'
```

**Create Employee (with token):**
```bash
curl -X POST http://localhost:8000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "companyName": "Tech Solutions Inc",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "role": "employee"
  }'
```

## 🚀 Next Steps

- [ ] Implement email notifications for new accounts
- [ ] Add password recovery via email
- [ ] Integrate Redis for token blacklisting
- [ ] Add audit logging
- [ ] Implement 2FA (Two-Factor Authentication)

---

**Built with ❤️ for DayFlow**

## Admin Credentials
Email:      admin@dayflow.com
Login ID:   DSUAD202601
Password:   AdminPassword@123
