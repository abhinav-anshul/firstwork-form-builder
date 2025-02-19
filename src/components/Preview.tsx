import { useState } from "react";
import { useFormStore } from "../hooks/useFormStore";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"
import { toast } from "sonner"
import { Trash2 } from "lucide-react";



function Preview() {
    const { questions, removeQuestion } = useFormStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const formName = questions.length > 0 ? questions[0].formName : "";
    type ResponseValue = string | number | string[];
    type ResponseState = { [id: string]: ResponseValue };

    // State to store user responses
    const [responses, setResponses] = useState<ResponseState>({});

    // Handle input change
    const handleInputChange = (id: string, questionLabel: string, value: string | number) => {
        setResponses(prev => ({ ...prev, [id]: value }));
    };

    const handleDeleteQuestion = (id: string) => {
        removeQuestion(id);
        toast.success("Question deleted successfully!");
    }

    console.log("Current Responses:", responses);

    // const handleSubmit = () => {
    //     const formattedData = Object.entries(responses).map(([id, value]) => ({
    //         questionId: id,
    //         response: value
    //     }));

    //     console.log({ formattedData })
    // }
    const handleSubmit = () => {
        for (const q of questions) {
            const value = responses[q.id];

            // 1. Validate required text fields
            if (q.questionType === "text" && q.isRequired && (typeof value !== "string" || value.trim() === "")) {
                toast.error("Please enter your answer");
                return;
            }

            // 2. Validate number fields
            if (q.questionType === "number") {
                const numValue = Number(value);
                if (!value || isNaN(numValue) || numValue < q.minValue || numValue > q.maxValue) {
                    toast.error(`Please enter number between ${q.minValue} and ${q.maxValue}`);
                    return;
                }
            }

            // 3. Validate select fields (must select at least one)
            if (q.questionType === "select" && q.isRequired) {
                if (!Array.isArray(value) || value.length === 0) {
                    toast.error("Please choose an option");
                    return;
                }
            }

        }

        // If all validations pass, format and submit data
        const formattedData = Object.entries(responses).map(([id, value]) => ({
            questionId: id,
            response: value
        }));

        setIsDialogOpen(true);


        console.log("Submitted Data:", formattedData);
    };

    return (
        <>
            <section className="bg-neutral-800 p-4 rounded-lg space-y-4">
                {questions.length === 0 ? (
                    <div>Start building out your form to see preview</div>
                ) : null}

                <h1 className="text-4xl text-center py-4">
                    {questions.length > 0 ? formName.replace(/^./, formName[0].toUpperCase()) : null}
                </h1>

                {questions.length > 0 && questions?.map((el, index) => (
                    <div className="" key={el.id}>
                        <div className="grid grid-cols-[6fr_1fr]">
                            {el?.questionType === "text" && (
                                <div>
                                    <div className="text-lg pb-1 font-bold">
                                        {`${index + 1}. `}
                                        {el?.questionLabel
                                            ? el.questionLabel.charAt(0).toUpperCase() + el.questionLabel.slice(1)
                                            : ""}
                                    </div>
                                    <Input
                                        required={el?.isRequired}
                                        value={responses[el.id] || ""}
                                        onChange={(e) => handleInputChange(el.id, el?.questionLabel, e.target.value)}
                                    />
                                    <div className="text-gray-400 italic text-sm pt-1">
                                        {el?.helperText}
                                    </div>
                                </div>
                            )}

                            {el?.questionType === "number" && (
                                <div>
                                    <div className="text-lg pb-1 font-bold">
                                        {`${index + 1}. `}
                                        {el?.questionLabel
                                            ? el.questionLabel.charAt(0).toUpperCase() + el.questionLabel.slice(1)
                                            : ""}
                                    </div>
                                    <Input
                                        required={el?.isRequired}
                                        type="number"
                                        min={el?.minValue}
                                        max={el?.maxValue}
                                        value={responses[el.id] || ""}
                                        onChange={(e) => handleInputChange(el.id, el?.questionLabel, e.target.value)}
                                    />
                                    <div className="text-gray-400 italic text-sm pt-1">
                                        {el?.helperText}
                                    </div>
                                </div>
                            )}

                            {el?.questionType === "select" && (
                                <div>
                                    <div className="text-lg pb-1 font-bold">
                                        {`${index + 1}. `}
                                        {el?.questionLabel
                                            ? el.questionLabel.charAt(0).toUpperCase() + el.questionLabel.slice(1)
                                            : ""}
                                    </div>
                                    <div className="grid grid-cols-2">
                                        {el?.options?.map((option, optIndex) => (
                                            <div key={optIndex} className="">
                                                <div className="flex items-center space-x-2 p-2">
                                                    <Checkbox
                                                        className="border-white"
                                                        checked={responses[el.id]?.includes(option) || false}
                                                        onCheckedChange={(checked) => {
                                                            let updatedOptions = responses[el.id] || [];
                                                            if (checked) {
                                                                updatedOptions = [...updatedOptions, option];
                                                            } else {
                                                                updatedOptions = updatedOptions.filter(opt => opt !== option);
                                                            }
                                                            handleInputChange(el.id, el?.questionLabel, updatedOptions);
                                                        }}
                                                    />
                                                    <label
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {option}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="justify-self-end">
                                <Trash2 onClick={() => handleDeleteQuestion(el.id)} className="text-red-900 cursor-pointer" />
                            </div>

                        </div>
                    </div>
                ))}
                {questions.length > 0 ? (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <Button onClick={handleSubmit} className="cursor-pointer">Submit Form</Button>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Recorded User Response</DialogTitle>
                                <DialogDescription>
                                    {questions.map(q => (
                                        <div key={q.id}>
                                            <strong>{q.questionLabel}:</strong>
                                            {Array.isArray(responses[q.id])
                                                ? (responses[q.id] as string[]).join(", ")  // Join multiple selections with commas
                                                : responses[q.id] || "No response"}
                                        </div>
                                    ))}
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                ) : null}

            </section>
        </>
    );
}

export { Preview };
