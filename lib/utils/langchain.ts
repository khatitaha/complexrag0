import { writeFile, unlink } from 'fs/promises'

import { v4 as uuidv4 } from 'uuid'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
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
    try {
        const docs = await loader.load()
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        })
        const splitDocs = await splitter.splitDocuments(docs)

        return splitDocs
    } finally {
        // ✅ Always cleanup the temp file
        await fs.unlink(tempFilePath).catch(() => { });
    }

}

export async function loadAndSplitWebPage(url: string) {
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments(docs);
    return splitDocs;
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

    const formatInstructions = escapeCurlyBraces(
        docs.map((d) => d.pageContent).join("\n\n")
    );
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




export async function generateLearningContentV2(docs: any[], language: string,
    quizCount: number,
    flashCount: number,
    note: string) {
    const model = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY, // Default value.
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: 0.3,
    });
    console.log(`language : ${language} , quiz : ${quizCount}, flash : ${flashCount}, note : ${note} from generating learning content `)

    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            lesson: z.array(z.object({
                title: z.string(),
                lines: z.array(z.object({
                    text: z.string(),
                    explanation: z.string(),
                })),
            })),

            flashcards: z.array(
                z.object({
                    question: z.string(),
                    answer: z.string(),
                })
            ),
            quiz: z.array(
                z.object({
                    question: z.string(),
                    options: z.array(z.string()).length(4),
                    answer: z.number().min(0).max(3),
                    explanation: z.string()
                })
            ),
            slides: z.array(
                z.object({
                    title: z.string(),
                    mainText: z.string().describe("The main in-depth explanation for the slide. Should contain highlighted text wrapped in <highlight> tags."),
                    keyPoints: z.array(z.string()).describe("A list of 2-3 key bullet points for the slide."),
                    emojis: z.array(z.string()).describe("A list of 1-2 relevant emojis for the slide."),
                    illustration_idea: z.string().describe("A simple idea for an illustration, e.g., 'a magnifying glass'."),
                })
            ),
            roadmap: z.array(
                z.object({
                    title: z.string(),
                    headlines: z.array(
                        z.object({
                            title: z.string(),
                            content: z.string(),
                            subheadlines: z.array(
                                z.object({
                                    title: z.string(),
                                    content: z.string(),
                                })
                            ).optional(),
                        })
                    ),
                })
            ),
            title: z.string(),

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
            "You are an expert educator and visual designer. Read the content and create structured, visually engaging learning material in JSON format.",
        ],
        [
            "human",
            `Here is the document content:
  
  {input}
  
   go through each line of the lesson and make sure you dont skip anything and then generate lesson in ${language} which is an array of objects that has a title for each header or point of the lessson at least 4 points
 then in each lesson a clear explanation of the lesson through lines  each line has a text and an explanation for each lesson there should be at least 4 lines , then make a list of flashcards (question and answer) whihc should jave all the points of the lesson or at least the most important points of the lesson 
 make sure you make them as question and answer so the user can memorize and learn faster  there should be ${flashCount} , then make quiz which is an array of objects that has a question and 4 options and the correct answer and an explanation for each question there should be ${quizCount} questions , also ${note} also make a title out of 4 to 6 words that describe the lesson that user has uploaded in ${language} , and a roadmap which is an array of lessons, where each lesson has a title and an array of headlines. Each headline will have a title, a content field with a brief summary or key points (less than 10 words), and an optional array of subheadlines. Each subheadline will also have a title and a content field (less than 10 words). Make sure to generate all subheadlines, not just the first one. Finally, generate a series of engaging and visually appealing presentation slides. For each slide, provide a "title", a "mainText" (an in-depth, teacher-like explanation with important terms wrapped in <highlight>tags</highlight>), a list of 2-3 "keyPoints", 1-2 relevant "emojis", and a simple "illustration_idea" (e.g., "a magnifying glass", "a brain with gears"). Ensure you thoroughly analyze the *entirety* of the provided document content to generate comprehensive learning material.:
  
  ${formatInstructions}`,
        ],
    ]);

    const chain = prompt.pipe(model).pipe(parser);
    const result = await chain.invoke({ input: escapedInput });
    console.log("result", result)
    return result;
}


export async function generateExamContentV2(docs: any[]) {
    const model = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY, // Default value.
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: 0.3,
    });

    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            shortQuestions: z.array(
                z.object({
                    id: z.number(),
                    question: z.string(),
                    answer: z.string(),
                })
            ),
            multipleOptionsQuestions: z.array(
                z.object({
                    id: z.number(),
                    question: z.string(),
                    options: z.array(z.string()).length(4),
                    answer: z.number().min(0).max(3),
                    explanation: z.string()
                })
            ),
            title: z.string(),

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
            "You are an expert educator. Read the content and create structured examination material in JSON format.",
        ],
        [
            "human",
            `Here is the document content:
  
  {input}
  
   these are probably diffrent lessons so you have to go through each line of the lessons and make sure you dont skip anything and then generate an exam which is an array of two objects first one is shorts questions make at least 2 and at maximum 5 that has a number as id and the question and an answer ,
 then the multipleOptionsQuestions is an array of objects that has an id as number and question and options at least 4 and the number of the correct option in the array and an explanation make at least 5 multiple answer questions and 10 as maximum , make sure by both types of question you cover every topic in the lessons of the input or at least majority , finally make a title for the exam based on topics covered
  
  ${formatInstructions}`,
        ],
    ]);

    const chain = prompt.pipe(model).pipe(parser);
    const result = await chain.invoke({ input: escapedInput });
    console.log("result", result)
    return result;
}







