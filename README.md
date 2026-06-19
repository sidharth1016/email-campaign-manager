# InboxKit - Email Campaign Manager

InboxKit is a comprehensive full-stack Email Campaign Management application built using the MERN stack (MongoDB, Express, React, Node.js). It provides marketing and sales teams with tools to organize email lists (leads), design templates, launch automated campaigns, and visualize delivery and click metrics via a clean dashboard.

---

## 🚀 Key Features

*   **🔒 Secure User Auth**: Built-in register/login workflows using JWT and hashed passwords (bcryptjs).
*   **📊 Interactive Dashboard**: Visual metrics showing total campaigns, active campaigns, lead count, open rates, and click rates using **Recharts** charts.
*   **📧 Campaigns Management**: Define campaigns, schedule templates, launch delivery, and track real-time results (sent, opened, clicked, bounced).
*   **👥 Lead & Contact Management**: Add leads with detailed attributes (Company, Phone, Tags) and filter contact lists.
*   **📝 Variable Templates**: Standardize email layouts using template placeholders like `{First Name}` and `{Company}`.
*   **📈 Campaign Analytics**: Detailed campaign breakdown tables along with interactive bar and line charts.

---

## 🛠 Tech Stack

### Frontend (Client)
*   **React 18** & **Vite** (Build Tool)
*   **React Router Dom** (Single-page app routing)
*   **Recharts** (SVG charting)
*   **Axios** (API requests with authorization interceptors)
*   **CSS Variables** (Modern, clean UI design system)

### Backend (Server)
*   **Node.js** & **Express**
*   **MongoDB** & **Mongoose** (Database ORM)
*   **JSON Web Tokens (JWT)** (Secure authentication sessions)
*   **BcryptJS** (Password hashing security)
*   **Nodemon** (Local dev server hot-reload)

---

## ⚙️ Project Setup

### Prerequisites
*   [Node.js](https://nodejs.org) (v16+)
*   [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on port `27017`

### 1. Database & Environment Configuration
In the `server/` directory, configure your `.env` file (an example configuration is provided below):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/emailcampaigndb
JWT_SECRET=supersecretjwtkey123
```

### 2. Dependency Installation
Run the following commands to install packages for the root project, client, and server:
```bash
# Install root script dependencies
npm install

# Install client packages
npm install --prefix client

# Install server packages
npm install --prefix server
```

---

## 🏃 Running the Application

For a convenient workflow, run the developer servers directly from the root directory:

*   **Start the Backend API Server**:
    ```bash
    npm run dev:server
    ```
    *(Starts Express on [http://localhost:5000](http://localhost:5000))*

*   **Start the Frontend Dev Server**:
    ```bash
    npm run dev:client
    ```
    *(Starts Vite on [http://localhost:5173](http://localhost:5173))*

---

## 📂 Directory Layout

```text
├── client/                     # Vite React Frontend
│   ├── src/
│   │   ├── api/                # Axios interceptor config
│   │   ├── components/         # Shared UI (Sidebar, etc.)
│   │   ├── context/            # Global Toast & Auth providers
│   │   ├── pages/              # SPA Router Page Views
│   │   └── index.css           # Modern CSS styling system
│   └── vite.config.js          # Client dev proxies
│
├── server/                     # Node/Express Backend
│   ├── middleware/             # JWT auth validation
│   ├── models/                 # Mongoose DB Schemas
│   ├── routes/                 # Express API Endpoint handlers
│   └── index.js                # App entrypoint & Database connection
```
