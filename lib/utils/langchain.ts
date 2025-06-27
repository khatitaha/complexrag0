import { writeFile, unlink } from 'fs/promises'

import { v4 as uuidv4 } from 'uuid'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'


import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatGroq } from "@langchain/groq";


import { ChatPromptTemplate } from "@langchain/core/prompts";


import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";


import axios from 'axios'



import fs from 'fs/promises'
import path from 'path'

export async function loadAndSplitDocument(fileUrl: string) {
    const urlObj = new URL(fileUrl)
    const pathname = urlObj.pathname
    const ext = path.extname(pathname).toLowerCase()

    if (!ext) throw new Error("Could not detect file extension")

    // Download the file
    const response = await fetch(fileUrl)
    const buffer = await response.arrayBuffer()

    // Ensure temp directory exists
    const tempDir = path.join(process.cwd(), 'temp')
    await fs.mkdir(tempDir, { recursive: true }) // ✅ create the directory if not exists

    // Write to file
    const tempFilePath = path.join(tempDir, `tempfile${ext}`)
    await fs.writeFile(tempFilePath, Buffer.from(buffer))

    // Load the file based on extension
    let loader
    switch (ext) {
        case '.pdf':
            loader = new PDFLoader(tempFilePath)
            break
        case '.docx':
            loader = new DocxLoader(tempFilePath)
            break
        case '.txt':
            loader = new TextLoader(tempFilePath)
            break
        case '.csv':
            loader = new CSVLoader(tempFilePath)
            break
        default:
            throw new Error(`Unsupported file type: ${ext}`)
    }

    const docs = await loader.load()
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    })
    const splitDocs = await splitter.splitDocuments(docs)

    return splitDocs
}


export async function generateLearningContent(docs: any[]) {
    console.log("We are generating the structured learning content...");

    // const model = new ChatGoogleGenerativeAI({
    //     model: "gemma-3-27b-it",
    //     temperature: 0.3,
    // });

    const model = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY, // Default value.
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: 0.3,
    });

    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            summary: z.object({
                title: z.string(),
                content: z.string(),
                keyPoints: z.array(z.string()),
                formulas: z.array(z.string())
            }),
            flashcards: z.array(
                z.object({
                    question: z.string(),
                    answer: z.string()
                })
            ),
            exercises: z.array(
                z.object({
                    question: z.string(),
                    options: z.array(z.string()).length(4),
                    correctAnswer: z.number().min(0).max(3),
                    explanation: z.string()
                })
            ),
        })
    );





    // 2. Get format instructions from the parser
    const formatInstructions = parser.getFormatInstructions();

    // 3. Create the prompt with dynamic schema instruction
    const prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful AI that transforms educational text into structured learning material.
        
        Analyze the following content and return it in the following format:
        ${formatInstructions.replace(/[{]/g, '{{').replace(/[}]/g, '}}')}
        
        Content:
        """
        {inputText}
        """`);


    // 4. Chain it all together
    const chain = prompt.pipe(model).pipe(parser);

    // 5. Combine document text
    const combinedText = docs.map(d => d.pageContent).join('\n\n');
    // const combinedtext = "the evil wizard came to town , tom helped him to fight the evil wizard"

    // 6. Invoke the chain
    try {
        const result = await chain.invoke({ inputText: combinedText });
        return result;
    } catch (error) {
        console.error("Failed to parse AI response into structure:", error);
        throw error;
    }
}



export async function generateExam(docs: any[]) {
    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            exam: z.array(
                z.object({
                    question: z.string(),
                    options: z.array(z.string()).length(4),
                    correctAnswer: z.number().min(0).max(3),
                })
            ),
        })
    );
    console.log("We are generating the exam...");

    const model = new ChatGoogleGenerativeAI({
        model: "gemma-3-27b-it",
        temperature: 0.3,
    });


    // 2. Get format instructions from the parser
    const formatInstructions = parser.getFormatInstructions();

    // 3. Create the prompt with dynamic schema instruction
    const prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful AI that transforms educational text into structured exam.
        
        Analyze the following content and return it in the following format:
        ${formatInstructions.replace(/[{]/g, '{{').replace(/[}]/g, '}}')}
        
        Content:
        """
        {inputText}
        """`);

    const chain = prompt.pipe(model).pipe(parser);

    const combinedText = docs.map(d => d.pageContent).join('\n\n');

    try {
        const result = await chain.invoke({ inputText: combinedText });
        return result;
    } catch (error) {
        console.error("Failed to parse AI response into structure:", error);
        throw error;
    }
}




////: new version of the langchain 





export async function generateLearningContentV1(docs: any[]) {
    const model = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY, // Default value.
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: 0.3,
    });

    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            summary: z.object({
                title: z.string(),
                content: z.string(),
                keyPoints: z.array(z.string()),
                formulas: z.array(z.string()),
            }),
            explanation: z.string(),
            flashcards: z.array(
                z.object({
                    question: z.string(),
                    answer: z.string(),
                })
            ),
            roadmap: z.array(z.string()),
            exam: z.array(
                z.object({
                    question: z.string(),
                    options: z.array(z.string()).length(4),
                    correctAnswer: z.number().min(0).max(3),
                })
            ),
            exercises: z.array(
                z.object({
                    question: z.string(),
                    options: z.array(z.string()).length(4),
                    correctAnswer: z.number().min(0).max(3),
                    explanation: z.string()
                })
            ),

        })
    );

    function escapeCurlyBraces(str: string) {
        return str.replace(/[{]/g, "{{").replace(/[}]/g, "}}");
    }

    const formatInstructions = escapeCurlyBraces(parser.getFormatInstructions());
    const escapedInput = escapeCurlyBraces(
        docs.map((d) => d.pageContent).join("\n\n")
    );

    const prompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            "You are an expert educator. Read the content and create structured learning material in JSON format.",
        ],
        [
            "human",
            `Here is the document content:
  
  {input}
  
  Generate a summary (title, content, keyPoints, formulas), a clear explanation of the lesson, a list of flashcards (question and answer), and a learning roadmap (step-by-step list). Return only JSON in this format:
  
  ${formatInstructions}`,
        ],
    ]);

    const chain = prompt.pipe(model).pipe(parser);
    const result = await chain.invoke({ input: escapedInput });
    console.log("result", result)
    return result;
}

////: new version of the langchain 

export async function generateExamContentV1(docs: any[]) {
    const model = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY, // Default value.
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: 0.3,
    });

    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            exam: z.array(
                z.object({
                    question: z.string(),
                    options: z.array(z.string()).length(4),
                    correctAnswer: z.number().min(0).max(3),
                })
            ),
            exercises: z.array(
                z.object({
                    question: z.string(),
                    options: z.array(z.string()).length(4),
                    correctAnswer: z.number().min(0).max(3),
                    explanation: z.string()
                })
            ),
        })
    );

    function escapeCurlyBraces(str: string) {
        return str.replace(/[{]/g, "{{").replace(/[}]/g, "}}");
    }

    const formatInstructions = escapeCurlyBraces(parser.getFormatInstructions());
    const escapedInput = escapeCurlyBraces(
        docs.map((d) => d.pageContent).join("\n\n")
    );

    const prompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            "You are an expert educator. Read the content and create structured exams and exercices material in JSON format.",
        ],
        [
            "human",
            `Here is the document content:
  
  {input}
  
  Generate several exercices for user to learn the lesson by exercices then an exam that covers all aspects of the lesson, Return only JSON in this format:
  
  ${formatInstructions}`,
        ],
    ]);

    const chain = prompt.pipe(model).pipe(parser);
    const result = await chain.invoke({ input: escapedInput });
    console.log("result", result)
    return result;
}