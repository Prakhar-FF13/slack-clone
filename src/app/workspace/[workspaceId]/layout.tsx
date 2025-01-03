"use client";

import {Toolbar} from "./toolbar";
import {Sidebar} from "./Sidebar";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {WorkspaceSidebar} from "./workspace-sidebar";

interface WorkspaceLayoutProps {
    children: React.ReactNode
}

const WorkspaceLayout = ({children}: WorkspaceLayoutProps) => {
    return (
        <div className={"h-full"}>
            <Toolbar />
            <div className={"flex h-[calc(100vh-40px)]"}>
                <Sidebar />
                <ResizablePanelGroup
                    direction="horizontal"
                    autoSaveId="pf13-slack-workspace"
                >
                    <ResizablePanel
                        defaultSize={20}
                        minSize={11}
                        className={"bg-[#5e2c5f]"}
                    >
                        <WorkspaceSidebar />
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel
                        minSize={20}
                    >
                        {children}
                    </ResizablePanel>
                </ResizablePanelGroup>

            </div>
        </div>
    )
}

export default WorkspaceLayout;