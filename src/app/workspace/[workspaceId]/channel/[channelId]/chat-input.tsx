import dynamic from "next/dynamic"
import {useRef} from "react";
import Quill from "quill";

const Editor = dynamic(() => import("@/components/editor"), {ssr: false})

interface ChatInputProps {
    placeholder: string;
}

export const ChatInput = ({placeholder}: ChatInputProps) => {
    const editorRef = useRef<Quill | null>(null);

    return (
        <div className={"px-5 w-full"}>
            <Editor
                variant={"create"}
                placeholder={placeholder}
                onSubmit={() => {}}
                innerRef={editorRef}
            />
        </div>
    )
}