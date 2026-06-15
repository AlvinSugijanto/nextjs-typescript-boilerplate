# Next.js Boilerplate: Frontend Architecture & Development Guidelines

This project follows a standardized CRUD and table development pattern. Below is a simplified guide based on [AGENTS.md](file:///c:/Users/alvin/my-project/nextjs-typescript-boilerplate/AGENTS.md).

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v18+) and npm installed.

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AlvinSugijanto/nextjs-typescript-boilerplate.git
   cd nextjs-typescript-boilerplate
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory and configure your backend URLs:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_WS_URL=ws://localhost:8000
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

- `npm run dev` – Runs the app in development mode.
- `npm run build` – Builds the app for production.
- `npm run start` – Starts the production server.
- `npm run lint` – Runs ESLint checks.
- `npm run format` – Formats the code with Prettier.
- `npm run typecheck` – Runs TypeScript compilation checks.

---

## 📂 Folder & Component Structure

Organize your files under the client-side codebase using the following layout:

```
client/src/
├── hooks/                  # Custom React Hooks for API, filtering, and pagination
├── components/             # Reusable UI Components (e.g., SimpleTable, DeleteDialog)
└── sections/               # Feature-Specific View & Controller Components
    └── [feature-name]/
        ├── view/
        │   ├── components/ # Modals, dialogs, sub-components
        │   ├── sections/   # Tab contents, inner list screens
        │   └── [name]-view.jsx # Main route/tab wrapper layout
```

---

## 🪝 Core Hooks

To prevent duplicating filtering, sorting, pagination, selection, or modal-trigger logic, use these custom hooks:

| Hook | Purpose | Return Value & Signature |
| :--- | :--- | :--- |
| **`useApi()`** | Handles API requests and loading states. | `{ data, call, loading }` (defaults to `GET`; specify method for writes) |
| **`useFilters()`** | Manages search queries and sorting. | `{ filters, setFilter, setFilters, handleSort, getQueryParams }` |
| **`usePagination()`** | Manages page state and size. | `{ page, pageSize, setPage, paginationProps }` |
| **`useBoolean()`** | Manages simple boolean states (e.g., modals). | `{ value, onTrue, onFalse, onToggle, setValue }` |
| **`useTableSelection()`** | Handles row selection and exports. | `{ selectedRows, handleSelectOne, handleSelectPage, handleSelectAll, handleClearSelection, handleExport }` |

---

## 🛠️ CRUD Implementation Blueprint

A standard CRUD view consists of two main components:

### 1. The Parent Section Component (`[name]-sections.jsx`)
- Orchestrates hook states (`useApi`, `useFilters`, `usePagination`, `useTableSelection`).
- Renders page filters/search, the `<SimpleTable />`, and controls creation and delete modals using `<DeleteDialog />`.

### 2. The Add/Edit Dialog Component (`add-[name]-dialog.jsx`)
- Integrates `react-hook-form` and `zod` for validation.
- **Rule:** Do not reset or clear the parent's `selectedItem` state during component mount/unmount cleanup (`useEffect`'s return function), as this triggers state clearing under React's StrictMode cycle. Let the parent's closing event handle resetting the item state instead.

---

