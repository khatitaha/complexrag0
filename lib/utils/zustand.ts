import { create } from 'zustand';

// --- Individual content types ---
export type Summary = {
  title: string;
  content: string;
  keyPoints: string[];
  formulas: string[];
};

export type Flashcard = {
  question: string;
  answer: string;
};

export type Exercise = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export type ExamQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
};

// --- Version wrapper ---
export type LearningContentVersion<T> = {
  id: number;
  createdAt: Date;
  data: T;
};

// --- Content groups ---
export type StudyContent = {
  summary: LearningContentVersion<Summary>[];
  flashcards: LearningContentVersion<Flashcard[]>[];
  explanation: LearningContentVersion<string>[];
  roadmap: LearningContentVersion<string>[];
};

export type PracticeContent = {
  exercises: LearningContentVersion<Exercise[]>[];
  exam: LearningContentVersion<ExamQuestion[]>[];
};

// --- Keys (helps with typing) ---
type StudyKey = keyof StudyContent;
type PracticeKey = keyof PracticeContent;

// --- Store structure ---
export type LearningContentStore = {
  study: StudyContent;
  practice: PracticeContent;
  fileId: string;

  actions: {
    addStudyVersion: <K extends StudyKey>(key: K, version: StudyContent[K][number]) => void;
    addPracticeVersion: <K extends PracticeKey>(key: K, version: PracticeContent[K][number]) => void;
    getLatestStudy: <K extends StudyKey>(key: K) => StudyContent[K][number] | undefined;
    getLatestPractice: <K extends PracticeKey>(key: K) => PracticeContent[K][number] | undefined;

    addFileId: (fileId: string) => void;

  }
};

// --- Zustand store ---
export const useLearningContentStore = create<LearningContentStore>((set, get) => ({
  study: {
    summary: [],
    flashcards: [],
    explanation: [],
    roadmap: [],
  },
  practice: {
    exercises: [],
    exam: [],
  },
  fileId: "",

  actions: {
    addStudyVersion: (key, version) => {
      set((state) => ({
        study: {
          ...state.study,
          [key]: [...state.study[key], version],
        },
      }));
    },

    addPracticeVersion: (key, version) => {
      set((state) => ({
        practice: {
          ...state.practice,
          [key]: [...state.practice[key], version],
        },
      }));
    },

    getLatestStudy: (key) => {
      const items = get().study[key];
      return items[items.length - 1];
    },

    getLatestPractice: (key) => {
      const items = get().practice[key];
      return items[items.length - 1];
    },

    addFileId: (fileId) => {
      set((state) => ({
        ...state,
        fileId: fileId,
      }));
    },
  },
}));


export const useStudy = () => useLearningContentStore((state) => state.study);
export const usePractice = () => useLearningContentStore((state) => state.practice);

export const useFileId = () => useLearningContentStore((state) => state.fileId);

export const useActions = () => useLearningContentStore((state) => state.actions);


