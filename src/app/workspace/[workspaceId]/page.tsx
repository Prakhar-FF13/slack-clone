"use client";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useRouter} from "next/navigation";
import {useCreateChannelModal} from "@/features/channels/store/use-create-channel-modal";
import {useGetWorkspace} from "@/features/workspaces/api/use-get-workspace";
import {useGetChannels} from "@/features/channels/api/use-get-channels";
import {useEffect, useMemo} from "react";
import {Loader, TriangleAlert} from "lucide-react";
import {useCurrentMember} from "@/features/members/api/use-current-member";

export default function WorkspaceIdPage() {
    const workspaceId = useWorkspaceId();
    const router = useRouter();
    const [open, setOpen] = useCreateChannelModal();
    const {data: member, isLoading: memberLoading} = useCurrentMember({workspaceId});
    const {data: workspace, isLoading: workspaceLoading} = useGetWorkspace({id: workspaceId});
    const {data: channels, isLoading: channelsLoading} = useGetChannels({workspaceId});

    const channelId = useMemo(() => {
        return channels?.[0]?._id;
    }, [channels]);

    const isAdmin = useMemo(() => {
        return member?.role === "admin"
    }, [member]);

    useEffect(() => {
        if (workspaceLoading || channelsLoading || memberLoading || !member ||!workspace) return;

        // redirect to first channel
        if (channelId) {
            router.push(`/workspace/${workspaceId}/channel/${channelId}`);
        } else if (!open) { // no channel - open model
            if (isAdmin) {
                setOpen(true);
            }
        }
    }, [isAdmin,
        member,
        memberLoading,
        workspaceId,
        workspaceLoading,
        channelsLoading,
        open,
        setOpen,
        router,
        channelId,
        workspace]);

    if (workspaceLoading || channelsLoading) {
        return (
            <div className={"h-full flex-1 flex items-center justify-center flex-col gap-2"}>
                <Loader className={"size-6 animate-spin text-muted-foreground"}/>
            </div>
        )
    }

    if (!workspace) {
        return (
            <div className={"h-full flex-1 flex items-center justify-center flex-col gap-2"}>
                <TriangleAlert className={"size-6 text-muted-foreground"}/>
                <span className={"text-sm text-muted-foreground"}>
                    Workspace not found
                </span>
            </div>
        )
    }

    return (
        <div className={"h-full flex-1 flex items-center justify-center flex-col gap-2"}>
            <TriangleAlert className={"size-6 text-muted-foreground"}/>
            <span className={"text-sm text-muted-foreground"}>
                    No channel found
            </span>
        </div>
    );
}