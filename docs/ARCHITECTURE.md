# Math Banana - Software Architecture

## 1. Overview

This document outlines the software architecture of the Math Banana frontend application. It's a Single Page Application (SPA) built using **React** (v19) with **Vite** as the build tool. Styling is handled primarily through **Tailwind CSS**, and client-side routing is managed by **React Router DOM**. State management leverages React's built-in **Context API** and `useState` hook.

The primary goals of this architecture are:
*   **Maintainability:** Easy to understand, modify, and extend.
*   **Reusability:** Components and logic can be reused across the application.
*   **Scalability:** The structure can accommodate future features.
*   **Testability:** Components and logic can be tested in isolation (though tests are not provided in the codebase).

## 2. Core Architectural Patterns

### 2.1. Component-Based Architecture

*   **Description:** The UI is broken down into reusable, independent components. These are primarily functional components utilizing React Hooks.
*   **Implementation:**
    *   **Pages (`src/pages/`):** Top-level components representing distinct application views (e.g., `Home`, `SignIn`, `Game`, `Profile`). They primarily orchestrate the layout and assembly of smaller components.
    *   **Reusable UI Components (`src/components/Layout/`, `src/components/Shared/`):** General-purpose components like `Button`, `Header`, `Footer`.
    *   **Feature-Specific Components (`src/components/Auth/`, `src/components/Game/`, `src/components/Profile/`):** Components tailored to specific features, like `OtpInput`, `DifficultySelect`, `GameBoard`, `ProfileStats`.
*   **Cohesion:** High. Each component typically encapsulates a specific piece of UI and its associated logic (e.g., `OtpInput` handles OTP entry logic, `GameBoard` manages the game loop UI).

### 2.2. Context API for State Management

*   **Description:** React's Context API is used to manage global or shared state that needs to be accessible across different parts of the component tree without prop drilling.
*   **Implementation:** Three main contexts are defined:
    *   **`AuthContext` (`src/context/AuthContext.jsx`):** Manages user authentication state (user object, loading status, errors), provides authentication methods (signin, signup, logout, OTP handling), and interacts with auth-related API endpoints.
    *   **`GameContext` (`src/context/GameContext.jsx`):** Manages game state (score, lives, game over status, high score, streak), provides game-related actions (save score, reset game, fetch leaderboard), and interacts with game API endpoints.
    *   **`UserContext` (`src/context/UserContext.jsx`):** Manages user profile data and statistics, provides methods for fetching and updating profile information, and interacts with user profile API endpoints.
*   **Coupling:** Low. Components needing access to auth, game, or user state/actions consume the respective contexts via hooks (`useAuth`, `useGame`, `useUser`). They are decoupled from the specific implementation details of how that state is fetched or managed.
*   **Cohesion:** High. Each context groups related state variables and the functions that operate on them, centralizing the logic for that specific domain (authentication, game mechanics, user profile).

### 2.3. Client-Side Routing

*   **Description:** `react-router-dom` handles navigation within the SPA, mapping URL paths to specific page components without requiring full page reloads from the server.
*   **Implementation:**
    *   Routes are defined in `src/App.jsx` within the `<Routes>` component.
    *   `ProtectedRoute` (`src/components/Auth/ProtectedRoute.jsx`) wraps routes that require authentication, checking the state from `AuthContext`.
    *   Navigation is triggered programmatically using the `useNavigate` hook or declaratively using `<Link>` components.
*   **Coupling:** Low. Pages are decoupled from each other; routing configuration is centralized in `App.jsx`.

## 3. Directory Structure

The `src/` directory is organized by feature and type:
src/
├── App.jsx # Main application component, layout, routing
├── main.jsx # Application entry point, context providers setup
├── index.css # Global styles, Tailwind imports
├── ErrorBoundary.jsx # Top-level error handling
├── assets/ # Static assets (images, audio, animations)
├── components/ # Reusable UI components
│ ├── Auth/ # Authentication-related components
│ ├── Game/ # Game-related components
│ ├── Layout/ # Layout structure components (Button)
│ ├── Profile/ # User profile components
│ └── Shared/ # Components used across multiple features
├── context/ # React Context providers for state management
│ ├── AuthContext.jsx
│ ├── GameContext.jsx
│ └── UserContext.jsx
├── hooks/ # Custom React hooks (e.g., useAudio)
└── pages/ # Top-level page components mapped to routes