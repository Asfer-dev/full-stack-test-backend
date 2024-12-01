# Node.js WebSocket and MongoDB Server

This is a Node.js server that integrates WebSocket functionality, MongoDB for database storage, and RESTful API endpoints for managing submissions. The server is built with Express and uses Mongoose for interacting with MongoDB.

## Features

- WebSocket server for real-time communication
- RESTful API to handle CRUD operations for submissions
- MongoDB integration for storing and retrieving data
- Middleware for handling CORS and JSON requests

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.18.0 or higher)
- [MongoDB](https://www.mongodb.com/)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

## Getting Started

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

Install the required dependencies:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a .env file in the root directory and add your MongoDB connection string:

```env
MONGO_URI=your_mongo_connection_string
PORT=5000
```

### 4. Start the Server

Start the server:

```bash
npm start
```

The server will start and listen on the port defined in your .env file or default to 5000.
