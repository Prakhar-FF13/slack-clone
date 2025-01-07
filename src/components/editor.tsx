import Quill, {Delta, Op, type QuillOptions} from "quill";

import "quill/dist/quill.snow.css";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {PiTextAa} from "react-icons/pi";
import {ImageIcon, Smile, XIcon} from "lucide-react";
import {MdSend} from "react-icons/md";
import {Hint} from "@/components/hint";
import {RefObject} from "react";
import {cn} from "@/lib/utils";
import {EmojiPopover} from "@/components/emoji-popover";
import Image from "next/image";

type EditorValue = {
    image: File | null;
    body: string;
}

interface EditorProps {
    variant?: "create" | "update";
    placeholder?: string;
    onSubmit: ({image, body}:EditorValue) => void;
    onCancel?: () => void;
    defaultValue?: Delta | Op[];
    disabled?: boolean;
    innerRef?: RefObject<Quill | null>;

}

export default function Editor({
    variant = "create",
    onCancel,
    onSubmit,
    placeholder = "Write something",
    defaultValue = [],
    disabled = false,
    innerRef,
}: EditorProps) {
    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [isToolbarVisible, setIsToolbarVisible] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const submitRef = useRef(onSubmit);
    const cancelRef = useRef(onCancel);
    const placeholderRef = useRef(placeholder);
    const quillRef = useRef<Quill | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const disabledRef = useRef(disabled);
    const imageElementRef = useRef<HTMLInputElement | null>(null);

    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        cancelRef.current = onCancel;
        disabledRef.current = disabled;
        defaultValueRef.current = defaultValue;
        // quillRef.current = q;
    });

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current as HTMLDivElement;

        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div"),
        )

        const options: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current,
            modules: {
                keyboard: {
                    bindings: {
                        enter: {
                            key: "Enter",
                            handler: () => {
                                return
                            }
                        },
                        shift_enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, "\n")
                            }
                        }
                    }
                },
                // toolbar: [
                //     ["bold", "italic", "underline", "strike"],
                //     ["link"],
                //     [{list: "ordered"}, {list: "bullet"}]
                // ]
            }
        }

        const quill = new Quill(editorContainer, options);
        quillRef.current = quill;
        quillRef.current.focus();

        if (innerRef) {
            innerRef.current = quill
        }

        quill.setContents(defaultValueRef.current);
        setText(quill.getText());
        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText());
        })

        return () => {
            quill.off(Quill.events.TEXT_CHANGE);
            if (container) {
                container.innerHTML = "";
            }
            if (quillRef.current) {
                quillRef.current = null;
            }
            if (innerRef?.current) {
                innerRef.current = null;
            }
        }
    }, [innerRef])

    const toggleToolbar = () => {
        setIsToolbarVisible(current => !current);
        const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

        if (toolbarElement) {
            toolbarElement.classList.toggle("hidden")
        }
    }

    const onEmojiSelect = (emoji: {native: string}) => {
        const quill = quillRef.current;

        console.log(emoji);

        quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
    }

    const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

    return (
        <div
            className={"flex flex-col"}
        >
            <input
                type={"file"}
                accept={"image/*"}
                ref={imageElementRef}
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        setImage(e.target.files[0]);
                    }
                }}
                className={"hidden"}
            />
            <div
                className={"flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white"}
            >
                <div ref={containerRef} className={"h-full ql-custom"}/>
                {!!image && (
                    <div className={"p-2"}>
                        <div className={"relative size-[62px] flex items-center justify-center group/image"}>
                            <Hint label={"Remove Image"}>
                            <button
                                onClick={() => {
                                    setImage(null);
                                    imageElementRef.current!.value = ""
                                }}
                                className={"hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"}
                            >
                                <XIcon className={"size-3.5"}/>
                            </button>
                            </Hint>
                            <Image
                                src={URL.createObjectURL(image)}
                                alt={"Uploaded image"}
                                fill={true}
                                className={"rounded-xl overflow-hidden border object-cover"}
                            />
                        </div>
                    </div>
                )}
                <div className={"flex px-2 pb-2 z-[5]"}>
                    <Hint label={isToolbarVisible ? "Hide formatting" : "Show formatting"}>
                    <Button
                        disabled={disabled}
                        size={"iconSm"}
                        variant={"ghost"}
                        onClick={toggleToolbar}
                    >
                        <PiTextAa className={"size-4"}/>
                    </Button>
                    </Hint>
                    <EmojiPopover
                        onEmojiSelect={onEmojiSelect}
                    >
                    <Button
                        disabled={disabled}
                        size={"iconSm"}
                        variant={"ghost"}
                    >
                        <Smile className={"size-4"}/>
                    </Button>
                    </EmojiPopover>
                    { variant === "create" &&
                    <Hint label={"image"}>
                    <Button
                        disabled={disabled}
                        size={"iconSm"}
                        variant={"ghost"}
                        onClick={() => {
                            imageElementRef.current?.click();
                        }}
                    >
                        <ImageIcon className={"size-4"}/>
                    </Button>
                    </Hint>
                    }
                    {variant === "update" &&
                        <div className={"ml auto flex items-center gap-x-2"}>
                            <Button
                                className={""}
                                variant={"outline"}
                                size={"sm"}
                                onClick={() => {}}
                                disabled={disabled}
                            >
                                Cancel
                            </Button>
                            <Button
                                className={"bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"}
                                variant={"outline"}
                                size={"sm"}
                                onClick={() => {}}
                                disabled={disabled || isEmpty}
                            >
                                Save
                            </Button>
                        </div>
                    }
                    { variant === "create" &&
                    <Button
                        disabled={disabled || isEmpty}
                        onClick={() => {}}
                        size={"iconSm"}
                        className={cn(
                            "ml-auto",
                            isEmpty ? " bg-white hover:bg-white text-muted-foreground"
                                : " bg-[#007a5a] hover:bg-[#007a5a]/80 text-white",
                        )}
                    >
                        <MdSend className={"size-4"}/>
                    </Button>
                    }
                </div>
            </div>
            {variant === "create" && (
                <div className={cn("p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
                !isEmpty && "opacity-100")}>
                    <p>
                        <strong>Shift + Return</strong> to add a new line
                    </p>
                </div>
            )}
        </div>
    )
}