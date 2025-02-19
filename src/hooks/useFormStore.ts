import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Question {
  id: string;
  formName: string;
  questionLabel: string;
  questionType: "text" | "number" | "select";
  options?: string[];
  isRequired?: boolean;
  minValue?: number;
  maxValue?: number;
  helperText?: string;
}

interface FormStore {
  questions: Question[];
  addQuestion: (question: Question) => void;
  removeQuestion: (id: string) => void;
  clearForm: () => void;
}

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      formName: "",
      questions: [],
      addQuestion: async (question) => {
        // Simulating API call delay
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 sec delay
        set((state) => ({ questions: [...state.questions, question] }));
      },
      removeQuestion: (id) =>
        set((state) => ({
          questions: state.questions.filter((q) => q.id !== id),
        })),
      clearForm: () => set({ questions: [] }), // Optional: To reset form
    }),
    {
      name: "form-storage", // Key for localStorage
    }
  )
);
