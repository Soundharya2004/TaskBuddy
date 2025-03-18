# TaskBuddy

## Overview
TaskBuddy is a task management application built using **React + Vite + TypeScript + Tailwind CSS**. It allows users to efficiently manage tasks with authentication, categorization, sorting, and a Kanban-style board view.

## Features

### 1. User Authentication:
- Firebase Authentication with Google Sign-In.
- User profile management.

### 2. Task Management:
- Create, edit, and delete tasks.
- Categorization and tagging for organization.
- Set due dates.
- Drag-and-drop functionality to rearrange tasks.
- Sort tasks by due date (ascending/descending).

### 3. Batch Actions:
- Perform batch actions on tasks (delete multiple, mark as complete).

### 4. Task History & Activity Log:
- Track changes (creation, edits, deletions) with an activity log.

### 5. File Attachments:
- Attach files/documents to tasks.
- File upload feature in task creation/editing.

### 6. Filter Options:
- Filter tasks by tags, category, and date range.
- Search tasks by title.

### 7. Board/List View:
- Switch between Kanban-style board view and list view.

### 8. Responsive Design:
- Fully responsive (mobile, tablet, desktop) with a mobile-first approach.

---

## Instructions to Run the Project

### Prerequisites
- Ensure you have **Node.js** installed on your machine.
- Set up Firebase for authentication and storage.

### Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/TaskBuddy.git
   cd TaskBuddy
   ```

2. **Install dependencies:**
   ```sh
   npm install
   npm install tailwindcss-animate
   ```

3. **Set up environment variables:**
   Create a `.env` file in the project root and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=YOUR_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID=YOUR_APP_ID
   ```

4. **Start the development server:**
   ```sh
   npm run dev
   ```

5. **Open the application in your browser** at `http://localhost:5173`.

---

## Challenges Faced & Solutions Implemented

### 1. Drag-and-Drop Functionality:
**Challenge:** Implementing a smooth and intuitive drag-and-drop feature for rearranging tasks.

**Solution:**
- Used **React DnD (Drag and Drop)** to enable task movement within lists.
- Implemented state updates efficiently to reflect changes in real-time.
- Ensured smooth reordering and state persistence.

---

## Future Enhancements
- Add push notifications for task reminders.
- Implement a calendar view for tasks.
- Integrate real-time collaboration for team-based task management.

---


