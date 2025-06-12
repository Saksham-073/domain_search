# Domain Search Tool

A simple yet powerful domain search application that helps you check domain availability and get detailed information about registered domains. This tool provides real-time domain lookups with comprehensive information while maintaining a clean and user-friendly interface.

## Features

-  Real-time domain availability checking
-  Detailed domain information (registrar, creation date, expiry date)
-  Search history tracking
-  Support for both internal and external API sources
-  Rate limiting to prevent abuse
-  Responsive design that works on all devices

## Tech Stack

### Frontend
- React - A JavaScript library for building user interfaces
- TailwindCSS - A utility-first CSS framework
- Vite - Next generation frontend tooling

### Backend
- Node.js - JavaScript runtime environment
- Express - Web application framework
- MongoDB - NoSQL database
- Node-Cache - In-memory caching for performance optimization

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 
- npm 
- MongoDB 

### Installation

1. Clone the repository:
   ```bash
   git clone 
   cd domain-search
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

### Configuration

Create a `.env` file in the backend directory with the following configuration:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
MONGODB_URI=" "
NODE_ENV=development
```

Environment variables explained:
- `PORT`: Backend server port (default: 3001)
- `FRONTEND_URL`: URL where frontend is hosted
- `MONGODB_URI`: MongoDB connection string
- `RATE_LIMIT`: Number of requests allowed per IP per hour
- `NODE_ENV`: Application environment (development/production)

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Endpoints

| `/api/domain/search` | GET | Search domain information |
| `/api/history` | GET | Get search history |
| `/api/history/:id` | DELETE | Delete a history item |
