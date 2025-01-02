"use client";

import {Toolbar} from "./toolbar";
import {Sidebar} from "./Sidebar";

interface WorkspaceLayoutProps {
    children: React.ReactNode
}

const WorkspaceLayout = ({children}: WorkspaceLayoutProps) => {
    return (
        <div className={"h-full"}>
            <Toolbar />
            <div className={"flex h-[calc(100vh-40px)]"}>
                <Sidebar />
                {children}
            </div>
        </div>
    )
}

export default WorkspaceLayout;