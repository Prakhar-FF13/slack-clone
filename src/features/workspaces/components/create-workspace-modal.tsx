"use client"

import {useCreateWorkspaceModal} from "@/features/workspaces/store/use-create-workspace-modal";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useCreateWorkspace} from "@/features/workspaces/api/use-create-workspace";
// import {router} from "next/client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export const CreateWorkspaceModal = () => {
    const router = useRouter();
    const [open, setOpen] = useCreateWorkspaceModal();
    const [name, setName] = useState<string>("")

    const {mutate, isPending} = useCreateWorkspace();

    const handleClose = () => {
        setOpen(false);
        setName("");
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate({name}, {
            onSuccess(id ){
                toast.success("workspace created");
                router.push(`/workspace/${id}`);
                handleClose();
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a workspace</DialogTitle>
                </DialogHeader>
                <form className={"space-y-4"} onSubmit={handleSubmit}>
                    <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={isPending}
                        required={true}
                        autoFocus={true}
                        minLength={3}
                        placeholder={"Workspace name e.g. 'Work', 'Personal', 'Home'"}
                    />
                    <div className={"flex justify-end"}>
                        <Button disabled={isPending}>Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}