# QR Code Generation & Scanning System

A full-stack MERN application for generating and scanning QR codes with user authentication and sharing capabilities.

## Features

- User authentication (Signup/Login)
- Generate QR codes from text or URLs
- Scan QR codes using device camera
- Download QR codes as images
- Copy QR code URLs to clipboard
- Filter QR codes by date range
- Share QR codes via email
- Paginated QR code history

## Tech Stack

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication
  - QR Code Generation
  - Email Service

- **Frontend:**
  - React.js
  - React Router
  - Axios
  - QR Code Scanner
  - Material-UI

## Setup Instructions

### Backend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/qr-code-generator
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_email_app_password
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - User registration
- POST `/api/auth/login` - User login

### QR Codes
- POST `/api/qrcodes` - Generate new QR code
- GET `/api/qrcodes` - Get all QR codes (with pagination & filters)
- DELETE `/api/qrcodes/:id` - Delete a specific QR code
- POST `/api/qrcodes/share` - Share QR code via email

## Environment Variables

Make sure to set up the following environment variables:

- `PORT`: Backend server port
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `EMAIL_USER`: Email address for sending QR codes
- `EMAIL_PASSWORD`: Email password or app-specific password

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 