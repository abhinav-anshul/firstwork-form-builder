import { useEffect, useState } from "react"
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner"
import { useFormStore } from "../hooks/useFormStore";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select"
import { Loader2, RotateCcw } from "lucide-react"

function Builder() {
    const { questions, addQuestion, clearForm } = useFormStore();
    // const ID = useId();

    const [formName, setFormName] = useState<string>("");
    const [questionLabel, setQuestionLabel] = useState<string>("");
    const [helperText, setHelperText] = useState<string>("");
    const [questionType, setQuestionType] = useState<"text" | "number" | "select">("text");
    const [options, setOptions] = useState<string[]>([]);
    const [newOption, setNewOption] = useState("");
    const [minValue, setMinValue] = useState<string>("");
    const [maxValue, setMaxValue] = useState<string>("");
    const [isRequired, setIsRequired] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    console.log("questions", questions)


    const handleAddOption = () => {
        if (!newOption) return;
        setOptions([...options, newOption]);
        setNewOption("");
    }

    const handleStartOver = () => {
        clearForm();
    }

    const handleAddQuestion = async () => {
        console.log("added")
        if (!formName) {
            return toast.error("Please enter a form name!");
        }
        // Don't reset formName after adding a question
        if (!questionLabel) {
            return toast.error('Please enter a question!')
        }
        if (questionType === "select" && options.length === 0) {
            toast.error("Please add at least one option for a select type question.");
            return;
        }

        if (questionType === "number" && (!minValue || !maxValue)) {
            toast.error("Please specify min and max values for number type questions.");
            return;
        }
        if (questionType === "number" && Number(minValue) > Number(maxValue)) {
            toast.error("Min value cannot be greater than max value.");
            return;
        }
        setLoading(true);

        await addQuestion({
            id: crypto.randomUUID(),
            formName,
            questionLabel,
            questionType,
            helperText,
            options: questionType === 'select' ? options : undefined,
            isRequired,
            minValue: questionType === "number" ? Number(minValue) : undefined,
            maxValue: questionType === 'number' ? Number(maxValue) : undefined,
        });
        setLoading(false);
        setQuestionLabel("");
        setIsRequired(false);
        setMinValue("");
        setMaxValue("");
        setHelperText("");
        setOptions([]);
        setNewOption("");
    }

    useEffect(() => {
        if (!formName && questions[0]?.formName) {
            setFormName(questions[0]?.formName);
        }
    }, [questions, formName])

    return (
        <section className="space-y-4 p-4">
            {/* // form title */}
            <Input autoFocus className="border-x-0 rounded-none border-y-0 text-left !text-4xl placeholder:text-3xl placeholder:italic" onChange={e => setFormName(e.target.value)} value={formName} placeholder="Enter a form name" />
            <div className="space-y-8 pt-6">

                {/* // type */}
                <div className="flex justify-end">
                    <Select value={questionType} onValueChange={(e) => setQuestionType(e as 'number' | 'text' | 'select')}>
                        <SelectTrigger className="w-auto">
                            <SelectValue placeholder="Choose a Question Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Input onChange={e => setQuestionLabel(e.target.value)} value={questionLabel} placeholder="Enter Question Title" />

                {/* // helper text */}
                <Input value={helperText} onChange={e => setHelperText(e.target.value)} placeholder="Enter Helper Text (optional)" />


                {/* // IF NUMBER TYPE */}
                {questionType === 'number' ? (
                    <div className="flex space-x-6">
                        <Input value={minValue} onChange={(e) => setMinValue((e.target.value))} type="number" placeholder="Min digit value" />
                        <Input value={maxValue} onChange={(e) => setMaxValue((e.target.value))} type="number" placeholder="Max digit value" />
                    </div>
                ) : null}

                {/* // IF SELECT TYPE */}
                {questionType === 'select' ? (
                    <div>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input value={newOption} onChange={(e) => setNewOption(e.target.value)} type="text" placeholder="Enter option name" />
                            <Button onClick={handleAddOption} className="text-black cursor-pointer" variant="outline">Add Options</Button>
                        </div>
                        {options.length > 0 && (
                            <ul className="space-x-3 py-2">
                                {options.map((opt, index) => (
                                    <Badge key={index} variant='secondary'>
                                        {opt}
                                        <button
                                            onClick={() => setOptions(options.filter((_, i) => i !== index))}
                                            className="ml-2 text-red-800"
                                        >
                                            ✕
                                        </button>
                                    </Badge>
                                ))}
                            </ul>
                        )}
                    </div>
                ) : null}

                {/* // is Required */}
                <div className="flex items-center space-x-2">
                    <Checkbox checked={isRequired} onCheckedChange={e => setIsRequired(e === true)} className="border-white" id="isrequired" />
                    <label
                        htmlFor="isrequired"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Is Required
                    </label>
                </div>

                {/* // Add Question */}
                <div className="flex space-x-4">
                    <div>
                        <Button variant="outline" onClick={handleAddQuestion} disabled={loading} className="mx-auto cursor-pointer w-full text-black">
                            {loading ? 'Adding...' : 'Add Question'}
                            {loading ? <Loader2 className="animate-spin" /> : null}
                        </Button>
                    </div>
                    <div>
                        <Button onClick={handleStartOver} variant="destructive" className="w-full cursor-pointer text-black">
                            <RotateCcw />
                            Start Over
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export { Builder }