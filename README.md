# Your Personal AI Tutor

This project is a web application that transforms your documents into a personalized learning experience. Upload your study materials, and the application will generate interactive lessons, quizzes, and flashcards to help you master the content. You can even chat with an AI tutor to get answers to your questions and deepen your understanding.

## Features

*   **Upload and Manage Your Documents:** Easily upload your PDFs, Word documents, and other files to the platform. All your materials are stored securely and are accessible whenever you need them.
*   **Generate Interactive Lessons:** Transform any document into a comprehensive lesson. The application automatically generates a summary, key takeaways, and a structured outline of the content.
*   **Create Custom Quizzes:** Test your knowledge with automatically generated quizzes. The quizzes are based on the content of your documents, so you can be sure you're focusing on the most important information.
*   **Learn with Flashcards:** Reinforce your learning with flashcards. The application creates flashcards with key terms and concepts from your documents.
*   **Chat with an AI Tutor:** Get personalized help from an AI tutor. The tutor can answer your questions, provide explanations, and help you understand complex topics. The chat is powered by a Retrieval-Augmented Generation (RAG) model, which means it can access and reason about the content of your documents.
*   **Interactive Document Viewer:** View your original documents alongside the generated lessons and chat. The interactive viewer allows you to highlight text, take notes, and easily reference the source material.

## How It Works

1.  **Upload:** Start by uploading your documents to the platform.
2.  **Generate:** Choose a document and generate a lesson. The application will create a summary, quizzes, and flashcards based on the content.
3.  **Learn:** Study the generated lesson, take the quizzes, and use the flashcards to reinforce your knowledge.
4.  **Interact:** Chat with the AI tutor to get answers to your questions and deepen your understanding of the material.

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
