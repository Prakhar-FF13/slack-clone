import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useCurrentMember} from "@/features/members/api/use-current-member";
import {useGetWorkspace} from "@/features/workspaces/api/use-get-workspace";
import {AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizontal} from "lucide-react";
import {WorkspaceHeader} from "@/app/workspace/[workspaceId]/workspace-header";
import {SidebarItem} from "@/app/workspace/[workspaceId]/sidebar-item";
import {useGetChannels} from "@/features/channels/api/use-get-channels";
import {WorkspaceSection} from "@/app/workspace/[workspaceId]/workspace-section";

export const WorkspaceSidebar = () => {
    const workspaceId = useWorkspaceId();

    const {data: member, isLoading: memberLoading} = useCurrentMember({workspaceId});
    const {data: workspace, isLoading: workspaceLoading} = useGetWorkspace({id: workspaceId})
    const {data: channels, isLoading: channelsLoading} = useGetChannels({workspaceId});

    if (workspaceLoading || memberLoading) {
        return <div className={"flex flex-col bg-[#5e2c5f] h-full items-center justify-center"}>
            <Loader className={"size-5 animate-spin text-white"}/>
        </div>
    }

    if (!workspace || !member) {
        return <div className={"flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center"}>
            <AlertTriangle className={"size-5 text-white"} />
            <p className={"text-white text-xs"}>
                Workspace not found
            </p>
        </div>
    }

    return (
        <div className={"flex flex-col bg-[#5e2c5f] h-full"}>
            <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
            <div className={"flex flex-col px-2 mt-3 "}>
                <SidebarItem
                    label={"Threads"}
                    icon={MessageSquareText}
                    id={"threads"}
                />
                <SidebarItem
                    label={"Drafts & Sent"}
                    icon={SendHorizontal}
                    id={"drafts"}
                />
            </div>
                <WorkspaceSection
                    label={"Channels"}
                    hint={"New channel"}
                    onNew={() => {}}
                >
                    {channels?.map((c) => {
                        return <SidebarItem
                            key={c._id}
                            label={c.name}
                            id={c._id}
                            icon={HashIcon}
                        />
                    })}
                </WorkspaceSection>
        </div>
    )
}