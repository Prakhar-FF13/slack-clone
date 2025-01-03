import {UserButton} from "@/features/auth/components/user-button";
import {WorkspaceSwitcher} from "@/app/workspace/[workspaceId]/workspace-switcher";
import {SidebarButton} from "@/app/workspace/[workspaceId]/sidebar-button";
import {Bell, Home, MessageSquare, MoreHorizontal} from "lucide-react";

export const Sidebar = () => {
    return (
        <aside className={"w-70px h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4 px-2"}>
            <WorkspaceSwitcher />
            <SidebarButton icon={Home} label="Home" isActive={true} />
            <SidebarButton icon={MessageSquare} label="DMs" />
            <SidebarButton icon={Bell} label="Activity" />
            <SidebarButton icon={MoreHorizontal} label="More" />
            <div className={"flex flex-col items-center justify-center gap-y-1 mt-auto"}>
                <UserButton />
            </div>

        </aside>
    )
}