"use client";

import {CreateWorkspaceModal} from "@/features/workspaces/components/create-workspace-modal";
import {useEffect, useState} from "react";

export const Modals = () => {
    // force client side rendering.
    // use client just creates a boundary
    // explicitly check for mountedness to avoid hydration error.
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <CreateWorkspaceModal />
        </>
    );
}