"use client";

import {atom, useAtom} from "jotai";

const useCreateChannelModalAtom = atom(false);

export const useCreateChannelModal = () => {
    return useAtom(useCreateChannelModalAtom);
}