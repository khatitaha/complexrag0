# GEMINI.md

## Project Overview

This is a Next.js and Supabase starter kit that has been extended into a platform for managing educational content. The application allows users to upload documents, create exams, and manage lessons. It uses Tailwind CSS for styling and shadcn/ui for UI components. The backend is powered by Supabase, which provides a database and authentication services.

The project is structured as a monorepo with a Next.js application in the `app` directory. The `app` directory is further divided into subdirectories for different features, such as `documents`, `exams`, and `lessons`. Each feature has its own set of pages, components, and server-side actions.

## Core Features

### Document Management (`app/(main)/documents`)

*   **Purpose:** Allows users to upload, view, and delete their documents.
*   **`page.tsx`:** Fetches the user's documents from the Supabase `documents` table.
*   **`docClient.tsx`:** The client-side UI for managing documents. It handles file uploads (to `/api/uploadedFile`), displays the list of documents, and provides a delete functionality.
*   **`actions.ts`:** Contains the `deleteFileFromDb` server action, which deletes a document from Supabase storage and the corresponding database record.

### Exam Management (`app/(main)/exams`)

*   **Purpose:** Enables users to create exams from their uploaded documents.
*   **`page.tsx`:** Fetches the user's documents and existing exams from Supabase.
*   **`exam_client.tsx`:** The client-side UI for creating and managing exams. Users can select documents to be included in an exam and then trigger the exam creation process.
*   **`actions.ts`:**
    *   `examCreationLogic`: The core function that takes document URLs, uses LangChain to generate exam content (questions and answers), and saves the exam to the database.
    *   `saveExamContentToDbFromAction`: Saves the generated exam to the `exams` table.
    *   `getExamContentFromDb`: Fetches a specific exam from the database.

### Lesson Management (`app/(main)/lessons` and `app/(main)/l/[id]`)

*   **Purpose:** Allows users to create and view interactive lessons from their documents.
*   **`app/(main)/lessons/page.tsx`:** Fetches and displays a list of the user's lessons.
*   **`app/(main)/lessons/lessonClient.tsx`:** Renders the list of lessons and provides a link to the lesson creation page (`/uploadingfile`) and to individual lesson pages (`/l/[file_id]`).
*   **`app/(main)/l/[id]/page.tsx`:** The entry point for viewing a single lesson. It first checks if a lesson with the given `id` exists in the database.
    *   If the lesson **exists**, it renders `WB2Client.tsx` with the lesson content.
    *   If the lesson **does not exist**, it renders `WB0Configurator.tsx` to allow the user to generate the lesson.
*   **`app/(main)/l/[id]/WB0Configurator.tsx`:** A configuration screen that allows users to customize the lesson generation (language, number of quizzes/flashcards, special notes).
*   **`app/(main)/l/[id]/WB2Client.tsx`:** The main lesson view, which includes:
    *   A draggable and resizable layout with a main content area and a chat panel.
    *   A control panel to toggle the visibility and size of different UI elements.
    *   The main content area displays the lesson's summary, flashcards, and quizzes.
    *   A PDF viewer to display the original document.
    *   A chat panel for interactive learning.

## API Routes (`app/api`)

### `/api/uploadedFile`

*   **Purpose:** Handles file uploads from the client.
*   **Functionality:**
    *   Receives a `POST` request with files.
    *   Authenticates the user with Supabase.
    *   Uploads files to Supabase Storage.
    *   Creates a corresponding record in the `documents` table.

### `/api/embed`

*   **Purpose:** A proxy for an external embedding server.
*   **Functionality:**
    *   Receives a `POST` request with texts.
    *   Forwards the texts to an embedding server at `http://localhost:8000/embed`.

### `/api/rag`

*   **Purpose:** Handles the Retrieval-Augmented Generation (RAG) pipeline.
*   **Functionality:**
    *   Receives a `POST` request with a `filePathId`.
    *   Loads and splits the corresponding document.
    *   Generates embeddings for the document chunks (using the `/api/embed` proxy).
    *   Stores the embeddings in a Pinecone vector store, namespaced by the user's ID.

### `/api/chatWithRev`

*   **Purpose:** The core chat functionality.
*   **Functionality:**
    *   Receives a `POST` request with the chat history, a character ID, and a conversation ID.
    *   Uses a LangChain RAG pipeline to generate a response:
        *   It uses a history-aware retriever to find relevant documents from the Pinecone vector store.
        *   It uses the `ChatGroq` model (`llama-3.1-8b-instant`) to generate a response based on the retrieved documents, the chat history, and a character persona.
    *   Streams the response back to the client.

## Building and Running

To build and run the project, you need to have Node.js and npm installed.

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add the following environment variables:

    ```
    NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_PROJECT_URL>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_PROJECT_ANON_KEY>
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.

## Development Conventions

*   **Styling:** The project uses Tailwind CSS for styling. Utility classes are used to style components directly in the JSX.
*   **Components:** The project uses shadcn/ui for UI components. These components are highly customizable and can be easily integrated into the application.
*   **State Management:** The project uses React's built-in state management features, such as `useState` and `useEffect`. For more complex state management, the project uses `zustand`.
*   **Linting:** The project uses ESLint to enforce code quality and consistency. You can run the linter with the following command:

    ```bash
    npm run lint
    ```