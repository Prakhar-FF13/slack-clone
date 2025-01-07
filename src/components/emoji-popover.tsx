import {useState} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPopoverProps {
    children: React.ReactNode;
    hint?: string;
    // @
    onEmojiSelect: (emoji: {native: string}) => void;
}

export const EmojiPopover = ({
    hint = "Emoji",
    children,
    onEmojiSelect
}: EmojiPopoverProps) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const onSelect = (emoji: {native: string})=> {
        onEmojiSelect(emoji);
        setPopoverOpen(false);

        setTimeout(() => {
            setTooltipOpen(false);
        }, 500);
    }

    return (
        <TooltipProvider>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <Tooltip
                    open={tooltipOpen}
                    onOpenChange={setTooltipOpen}
                    delayDuration={50}
                >
                    <PopoverTrigger
                        asChild={true}
                    >
                        <TooltipTrigger
                            asChild={true}
                        >
                            {children}
                        </TooltipTrigger>
                    </PopoverTrigger>
                    <TooltipContent className={"bg-black text-white border border-white/5"}>
                        <p className={"font-medium text-xs"}>{hint}</p>
                    </TooltipContent>
                </Tooltip>
                <PopoverContent className={"p-0 w-full border-none shadow-none"}>
                    <EmojiPicker
                        data={data}
                        onEmojiSelect={onSelect}
                    />
                </PopoverContent>
            </Popover>
        </TooltipProvider>
    )
}