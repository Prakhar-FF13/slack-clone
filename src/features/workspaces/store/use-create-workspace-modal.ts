"use client";

import {atom, useAtom} from "jotai";

const useCreateWorkspaceModalAtom = atom(false);

export const useCreateWorkspaceModal = () => {
    return useAtom(useCreateWorkspaceModalAtom);
}