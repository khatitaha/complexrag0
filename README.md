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
<img width="1832" height="914" alt="Screenshot 2025-12-03 at 20 17 48" src="https://github.com/user-attachments/assets/f27cd711-fc16-4435-90b4-2c052e532943" />
<img width="1832" height="914" alt="Screenshot 2025-12-03 at 20 17 40" src="https://github.com/user-attachments/assets/6e962734-10e0-4bef-8dac-09b40c3feecd" />
<img width="1832" height="914" alt="Screenshot 2025-12-03 at 20 17 25" src="https://github.com/user-attachments/assets/53897e5d-de32-467f-b3d1-b08c331e3a7e" />
<img width="1832" height="914" alt="Screenshot 2025-12-03 at 20 17 18" src="https://github.com/user-attachments/assets/ba2aa9f2-b69d-4696-b393-4c986e1198f1" />
<img width="1832" height="914" alt="Screenshot 2025-12-03 at 20 16 55" src="https://github.com/user-attachments/assets/73f075f0-8d4b-4077-b9b1-1192bbe0de18" />
<img width="1832" height="914" alt="Screenshot 2025-12-03 at 20 16 48" src="https://github.com/user-attachments/assets/48db65f9-482c-4a3c-9eca-9480e70baedf" />
<img width="1832" height="914" alt="Screenshot 2025-12-03 at 20 16 38" src="https://github.com/user-attachments/assets/9d8e1b2b-d053-453f-afa2-c61db4298a70" />
<img width="1832" height="914" alt="Screenshot 2025-12-03 at 20 16 32" src="https://github.com/user-attachments/assets/943b8d68-efc3-4af6-bf2b-02e3cebdec9b" />
<img width="1832" height="914" alt="Screenshot 2025-12-03 at 20 16 19" src="https://github.com/user-attachments/assets/6c159b84-416c-4f95-a8fb-44ab8c8c2500" />
<img width="1832" height="914" alt="Screenshot 2025-12-03 at 20 16 14" src="https://github.com/user-attachments/assets/29f1dbb3-c27d-43ad-817b-4a6f81bff2e5" />
<img width="1832" height="914" alt="Screenshot 2025-12-03 at 20 15 49" src="https://github.com/user-attachments/assets/d775f7bc-c58c-4a59-8815-c8c7a8f92d1a" />
<img width="1832" height="914" alt="Screenshot 2025-12-03 at 20 15 38" src="https://github.com/user-attachments/assets/81398da0-5cc6-43cc-8dd8-6aeaf30ad2f4" />
<img width="1832" height="914" alt="Screenshot 2025-12-03 at 20 15 32" src="https://github.com/user-attachments/assets/7220d0e6-5f14-4d69-a020-5649c1b4b99a" />
<img width="1830" height="914" alt="Screenshot 2025-12-03 at 20 15 03" src="https://github.com/user-attachments/assets/10f363b0-f425-43a0-b9bd-3336d20762b1" />

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
