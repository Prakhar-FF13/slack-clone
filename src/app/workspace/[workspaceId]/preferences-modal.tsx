import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {useState} from "react";
import {TrashIcon} from "lucide-react";
import {useUpdateWorkspace} from "@/features/workspaces/api/use-update-workspace";
import {useRemoveWorkspace} from "@/features/workspaces/api/use-remove-workspace";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

interface PreferencesModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string;
}

export const PreferencesModal = ({
    open,
    setOpen,
    initialValue
}: PreferencesModalProps) => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();

    const [value, setValue] = useState(initialValue);
    const [editOpen, setEditOpen] = useState(false);

    const {mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
    const {mutate: removeWorkspace, isPending: isRemovingWorkspace} = useRemoveWorkspace();

    const handleEdit = (e: React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault();
        updateWorkspace({
            id: workspaceId,
            name: value
        }, {
            onSuccess: () => {
                toast.success("Workspace updated")
                setEditOpen(false);
            },
            onError: () => {
                toast.error("Workspace update failed")
            }
        })
    }

    const handleRemove = () =>{
        removeWorkspace({
            id: workspaceId,
        }, {
            onSuccess: () => {
                toast.success("Workspace removed")
                setEditOpen(false);
                router.replace("/");
            },
            onError: () => {
                toast.error("Workspace remove failed")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className={"p-0 bg-gray-50 overflow-hidden"}>
                <DialogHeader className={"p-4 border-b bg-white"}>
                    <DialogTitle>
                        {value}
                    </DialogTitle>
                </DialogHeader>
                <div className={"px-4 pb-4 flex flex-col gap-y-4"}>
                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                        <DialogTrigger asChild={true}>
                            <div className={"px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50"}>
                        <div className={"flex items-center justify-between"}>
                            <p className={"text-sm font-semibold"}>
                                Workspace name
                            </p>
                            <p className={"text-sm text-[#1264a3] hover:underline font-semibold"}>
                                Edit
                            </p>
                        </div>
                        <p className={"text-sm"}>
                            {value}
                        </p>
                    </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Rename this workspace</DialogTitle>
                            </DialogHeader>
                            <form action={""} className={"space-y-4"} onSubmit={handleEdit}>
                                <Input
                                    disabled={isUpdatingWorkspace}
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    minLength={3}
                                    maxLength={80}
                                    required={true}
                                    autoFocus={true}
                                    placeholder={"Workspace name"}
                                />
                                <DialogFooter>
                                    <DialogClose asChild={true}>
                                        <Button variant={"outline"} disabled={isUpdatingWorkspace}>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button disabled={isUpdatingWorkspace}>
                                        Save
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <button
                    className={"flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"}
                    disabled={isRemovingWorkspace}
                    onClick={handleRemove}>
                        <TrashIcon className={"size-4"}/>
                        <p className={"text-sm font-semibold"}>
                            Delete Workspace
                        </p>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}