# Educational Content Platform

This is a Next.js and Supabase starter kit that has been extended into a platform for managing educational content. The application allows users to upload documents, create exams, and manage lessons. It uses Tailwind CSS for styling and shadcn/ui for UI components. The backend is powered by Supabase, which provides a database and authentication services.

## Core Features

*   **Document Management:** Allows users to upload, view, and delete their documents.
*   **Exam Management:** Enables users to create exams from their uploaded documents.
*   **Lesson Management:** Allows users to create and view interactive lessons from their documents.
*   **Interactive Learning:** Provides a chat interface for interactive learning, powered by a Retrieval-Augmented Generation (RAG) pipeline.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Backend:** [Supabase](https://supabase.io/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
*   **Language Models:** [LangChain](https://www.langchain.com/), [Groq](https://groq.com/)
*   **Vector Store:** [Pinecone](https://www.pinecone.io/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm installed. You can download them from [here](https://nodejs.org/en/download/).
*   A Supabase account. You can create one for free at [supabase.com](https://supabase.com/).

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username/your_project_name.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```

### Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_PROJECT_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_PROJECT_ANON_KEY>
```

You will also need to configure environment variables for other services used in the application, such as Pinecone, Groq, and any other services you wish to use.

### Running the Application

To run the application in a development environment, use the following command:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in the development mode.
*   `npm run build`: Builds the app for production to the `.next` folder.
*   `npm start`: Starts the production server.
*   `npm run lint`: Lints the project files.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.