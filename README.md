# Aether AI - Architecting Intelligence

Aether AI is a premium, high-performance platform designed to discover, compare, and build workflows with the largest structured database of AI tools. Built for architects of the future, it provides founders and users with the data they need to leverage AI effectively.



## 🚀 Vision

To be the definitive source of truth for the AI ecosystem, enabling users to move beyond hype and find the actual tools that power their workflows.

## ✨ Features

-   **Deep Discovery**: Search through a structured database of AI tools with advanced filtering (API availability, pricing models, quality scores).
-   **Startup Launchpad**: A dedicated platform for AI founders to showcase their products to a global community of early adopters.
-   **Side-by-Side Comparison**: Compare AI tools across key metrics like quality, speed, and pricing to make informed decisions.
-   **Workflow Orchestration**: Tools and insights to help users combine multiple AI services into cohesive production pipelines.
-   **Premium UX**: A dark-mode, high-fidelity interface built with modern web standards and fluid animations.

## 🛠️ Technology Stack

### Frontend
-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Data Fetching**: Supabase Client & Custom API Wrapper

### Backend
-   **Environment**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express](https://expressjs.com/)
-   **Language**: TypeScript
-   **Database**: [PostgreSQL](https://www.postgresql.org/)
-   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
-   **Profile Storage**: [Firestore](https://firebase.google.com/docs/firestore)

## 📦 Project Structure

```bash
ai-platform/
├── frontend/          # Next.js web application
│   ├── src/app/       # Routes and pages
│   ├── src/components/# Reusable UI components
│   └── src/lib/       # Utilities and API clients
└── backend/           # Node.js API server
    ├── src/routes/    # API endpoints
    ├── src/services/  # Business logic
    └── schema.sql     # Database schema definitions
```

## ⚙️ Getting Started

### Prerequisites
-   Node.js (v18+)
-   PostgreSQL
-   Firebase Account (for Auth/Firestore)

### Backend Setup
1. Navigate to the backend directory:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure your `.env` file (refer to `.env.example` if available).
4. Initialize the database:
    ```bash
    psql -U your_user -d your_db -f schema.sql
    ```
5. Start the development server:
    ```bash
    npm run dev
    ```

### Frontend Setup
1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure your `.env.local` with Firebase and API credentials.
4. Start the development server:
    ```bash
    npm run dev
    ```

## 🛡️ Authentication

Aether AI uses **Firebase Authentication** for secure user management. Currently supported methods:
-   Email & Password
-   Google OAuth

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
