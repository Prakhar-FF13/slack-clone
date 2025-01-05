import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useCreateChannelModal} from "@/features/channels/store/use-create-channel-modal";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useCreateChannel} from "@/features/channels/api/use-create-channel";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export const CreateChannelModal = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const [open, setOpen] = useCreateChannelModal();

    const [name, setName] = useState("");

    const {mutate, isPending} = useCreateChannel();

    const handleClose = () => {
        setOpen(false);
        setName("");
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setName(value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({
            name: name,
            workspaceId: workspaceId
        }, {
            onSuccess: (id) => {
                toast.success("Channel created");
                router.push(`/workspace/${workspaceId}/channel/${id}`);
                handleClose();
            },
            onError: () => {
                toast.error("Error creating channel");
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add a channel
                    </DialogTitle>
                </DialogHeader>
                <form action="" className={"space-y-4"} onSubmit={handleSubmit}>
                    <Input
                        value={name}
                        disabled={isPending}
                        onChange={(e) => {
                            handleChange(e)
                        }}
                        required={true}
                        autoFocus={true}
                        minLength={3}
                        maxLength={80}
                        placeholder={"eg - Funny stories"}
                    />
                    <div className={"flex justify-end"}>
                        <Button disabled={isPending}>
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}