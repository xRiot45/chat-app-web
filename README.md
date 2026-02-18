![image alt](https://github.com/xRiot45/nexus-chat-frontend/blob/31b8f5e525505fb04e97fff0ac62b72e8fb60a03/thumbnail.png)

# Nexus Chat Frontend Documentation

Nexus Chat is a scalable messaging platform frontend that delivers real-time communication through WebSockets. This project is built with modern React and Next.js tooling to support private chat, group collaboration, stories, and profile management.

## Application Information

- **Application Name:** Nexus Chat
- **Description:** A scalable messaging platform featuring real-time communication using WebSockets.
- **Repository:** https://github.com/xRiot45/nexus-chat-frontend

## Tech Stack

This frontend is built using the following technologies:

- **Next.js (App Router)**
- **React.js**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**

Additional supporting libraries include TanStack Query, React Hook Form, Zod, Axios, and Socket.IO Client.

## Core Features

Nexus Chat currently supports the following key features:

- **1-on-1 Chat**
    - Send and receive direct messages in real time.
- **Group Chat**
    - Chat with multiple members in shared conversation spaces.
- **Contact Management (CRUD)**
    - Create, view, update, and delete contacts.
- **Story Management (CRUD)**
    - Create, view, and delete story content, including story feed/viewer interactions.
- **Profile Update**
    - Update user profile information from settings.

## High-Level Project Structure

```bash
app/                # Next.js App Router pages, layouts, and global styles
components/         # Shared UI and reusable components
features/           # Feature-based modules (auth, chats, groups, contacts, stories, settings)
helpers/            # Utility helper functions
lib/                # Core libraries (e.g., socket initialization)
providers/          # Global providers (theme, query)
configs/            # Configuration files (e.g., API base URL)
constants/          # Static/mock constants used by the UI
interfaces/         # Shared interfaces and typing contracts
types/              # Shared type aliases
enums/              # Shared enums
```

## Main Feature Modules

- `features/auth` — authentication flows (login, register, verify email).
- `features/chats` — private and group messaging UI, message list/input, socket hooks.
- `features/groups` — group management, member roles, invitations, and group settings.
- `features/contacts` — contact list management and CRUD operations.
- `features/stories` — stories feed, story creation, deletion, and viewers.
- `features/settings` — profile and account setting updates.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/xRiot45/nexus-chat-frontend.git
cd nexus-chat-frontend
```

### 2. Install dependencies

Using npm:

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and define the frontend environment variables required by your API/backend (for example API base URL and socket endpoint).

> Note: Adjust variable names based on your backend contract and existing project configuration.

### 4. Run the development server

```bash
npm run dev
```

The app runs on:

- `http://localhost:3001`

### 5. Build for production

```bash
npm run build
npm run start
```

## Available Scripts

- `npm run dev` — Start Next.js development server (Turbo mode) on port `3001`.
- `npm run build` — Create a production build.
- `npm run start` — Start the production server.
- `npm run lint` — Run ESLint checks.

## Development Notes

- This project uses **App Router** conventions from Next.js.
- UI is styled with **Tailwind CSS** and **shadcn/ui** components.
- Real-time messaging is powered by **WebSocket communication (Socket.IO Client)**.
- Feature modules follow a domain-oriented structure to keep code scalable and maintainable.

## Future Documentation Improvements (Recommended)

To keep this documentation useful as the app evolves, consider adding:

- API endpoint matrix per feature module.
- Environment variable reference table.
- Authentication/session flow diagram.
- Realtime event contract (socket emit/listen events).
- Deployment guide (Vercel/Docker/self-hosted options).

## License

This project is private/internal unless specified otherwise by the repository owner.
