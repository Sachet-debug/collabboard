# CollabBoard — Real-time Kanban Board (MERN + TypeScript)

## Folder structure

```
collabboard/
├── backend/
│   ├── src/
│   │   ├── config/db.ts              # MongoDB connection
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── Board.ts
│   │   │   ├── List.ts
│   │   │   └── Task.ts
│   │   ├── controllers/              # Business logic
│   │   │   ├── authController.ts
│   │   │   ├── boardController.ts
│   │   │   ├── listController.ts
│   │   │   └── taskController.ts
│   │   ├── routes/                   # Express routers
│   │   │   ├── authRoutes.ts
│   │   │   ├── boardRoutes.ts
│   │   │   ├── listRoutes.ts
│   │   │   └── taskRoutes.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts               # JWT verification
│   │   │   └── errorHandler.ts
│   │   ├── sockets/socketHandler.ts  # Real-time events
│   │   ├── types/index.ts            # Shared backend types
│   │   ├── utils/generateToken.ts
│   │   ├── app.ts                    # Express app config
│   │   └── server.ts                 # Entry point (HTTP + Socket.io)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── types/index.ts            # Shared frontend types (mirrors backend)
    │   ├── api/
    │   │   ├── axios.ts              # Axios instance + auth interceptor
    │   │   └── boardApi.ts           # All API call functions
    │   ├── store/                    # (Zustand stores go here)
    │   ├── components/               # (Board, List, TaskCard, etc.)
    │   ├── pages/                    # (Login, Register, Dashboard, BoardView)
    │   └── hooks/                    # (useSocket, useAuth, etc.)
    └── package.json
```

## Data model relationships

```
User ──< Board (owner)
User ──< BoardMember >── Board   (many-to-many via members array)
Board ──< List
List  ──< Task
Task  >── User (assignees, many-to-many)
```

- A **Board** has an owner and a `members[]` array, each with a `role` (admin/member) — this is how you'll implement permissions.
- A **List** belongs to one Board and has an `order` field for column position.
- A **Task** belongs to one List (and denormalizes `board` too, so you can query all tasks on a board without joining through lists — a common MongoDB pattern worth understanding and explaining in interviews).
- `order` fields on List and Task are what make drag-and-drop persistence work — when a card moves, you update its `order` and `list`, then re-sequence.

## Getting started

**Backend:**
```bash
cd backend
npm install
cp .env.example .env   # fill in your MongoDB Atlas URI and a JWT secret
npm run dev
```

**Frontend:**
```bash
cd frontend
npm create vite@latest . -- --template react-ts   # if you haven't scaffolded yet, or just npm install if files already match
npm install
npm run dev
```

Add `VITE_API_URL=http://localhost:5000/api` to a `.env` file in `frontend/`.

## Build order (recommended)

1. **Backend auth** — register/login, test with Postman/Thunder Client before touching frontend
2. **Backend boards/lists/tasks CRUD** — test all routes with Postman
3. **Frontend auth pages** — login/register forms, store JWT in localStorage, protected routes
4. **Frontend dashboard** — list of boards, create board
5. **Frontend board view** — render lists and tasks (no drag-drop yet, just display)
6. **Drag-and-drop** — wire up `@hello-pangea/dnd`, call `moveTask` API on drop
7. **Socket.io real-time** — join board room, emit/listen for task and list events so multiple browser tabs sync live
8. **Polish** — priority badges, due dates, member avatars, loading/error states
9. **Deploy** — frontend to Vercel, backend to Render, MongoDB Atlas (free tier works fine)

## Learning resources

You don't need to watch a 10-hour course front to back — pull specific sections as you hit each build step above.

**TypeScript fundamentals (do this first, ~3-4 hrs total)**
- Search: "TypeScript in 1 hour" or "TypeScript Course for Beginners" — Programming with Mosh, Academind, or Codevolution all have solid short crash courses
- Codevolution's dedicated TypeScript playlist is good for going deeper on generics/interfaces once you're past basics

**MERN + TypeScript combined**
- Search: "MERN stack TypeScript project" — Dave Gray and Codevolution both have long-form MERN+TS build-alongs on YouTube that follow almost this exact architecture (auth, protected routes, CRUD)
- For Indian-context explanations in Hindi/English mix, Chai aur Code (Hitesh Choudhary) has a full MERN + TS series that's popular for placement prep

**Socket.io / real-time features**
- Search: "Socket.io crash course" — Web Dev Simplified and The Net Ninja both have short, clear explanations of rooms, emit/broadcast, and client-server events
- Search: "Socket.io React TypeScript chat app" for a pattern very close to what you need here

**Drag and drop (@hello-pangea/dnd)**
- Search: "react beautiful dnd tutorial" (hello-pangea/dnd is the maintained fork with the same API, so old react-beautiful-dnd tutorials still apply)
- Official docs at their GitHub repo are also short and clear enough to read directly

**MongoDB / Mongoose schema design**
- Search: "Mongoose schema relationships tutorial" to understand referencing (what this project uses) vs embedding — being able to explain *why* you chose one over the other is a common interview question

**Deployment**
- Search: "deploy MERN app Vercel Render" — several short guides walk through exactly this split (static frontend on Vercel, Node backend on Render, MongoDB Atlas for the DB)

## Talking points for interviews

Once built, be ready to explain:
- Why tasks store both `list` and `board` (denormalization for query efficiency)
- How JWT auth works end-to-end (login → token in localStorage → Authorization header → middleware verifies)
- How drag-and-drop persists: optimistic UI update → API call → order re-sequencing on the backend
- How Socket.io rooms scope real-time updates to only users viewing the same board
- What TypeScript caught for you during development (a mismatched API response shape is a great concrete example if it happens)
