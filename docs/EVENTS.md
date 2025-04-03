# Event-Driven Architecture

## Key Event Triggers
| Event Type          | Example Location          | Description                          |
|---------------------|---------------------------|--------------------------------------|
| **User Interaction** | `GameBoard.jsx`           | Button clicks (submit answer)        |
| **API Response**    | `AuthContext.jsx`         | Login success/failure handling       |
| **Timer**           | `GameBoard.jsx`           | Countdown updates every second       |
| **Routing**         | `ProtectedRoute.jsx`      | Route change auth checks             |
| **Browser**         | `useAudio.js`             | Audio autoplay after user interaction|