import {useMutation} from "convex/react";
import {useCallback, useMemo, useState} from "react";
import {api} from "../../../../convex/_generated/api";
import {Id} from "../../../../convex/_generated/dataModel";

type Options = {
    onSuccess?: (data: ResponseType) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void; // error / success doesnt matter, do this
    throwOnError?: boolean;
}

type RequestType = {
    body: string,
    image?: Id<"_storage">,
    workspaceId: Id<"workspaces">,
    channelId?: Id<"channels">,
    parentMessageId?: Id<"messages">
    // TODO add conversation id
};
type ResponseType = Id<"messages"> | null;

export const useCreateMessage = () => {
    const [data, setData] = useState<ResponseType>();
    const [error, setError] = useState<Error | null>();

    const [status, setStatus] = useState<"success" | "error" | "settled" | "pending" | null>();

    const isPending = useMemo(() => status === "pending", [status]);
    const isSuccess = useMemo(() => status === "success", [status]);
    const isError = useMemo(() => status === "error", [status]);
    const isSettled = useMemo(() => status === "settled", [status]);

    const mutation = useMutation(api.messages.create);

    const mutate = useCallback(async (values: RequestType, options?: Options) => {
        try {
            setData(null);
            setError(null);

            setStatus("pending")

            const res = await mutation(values)
            options?.onSuccess?.(res);

            setData(res);
            return res;
        } catch (error) {
            setError(error as Error);
            setStatus("error")
            options?.onError?.(error as Error);
            if (options?.throwOnError) {
                throw error;
            }
        } finally {
            setStatus("settled")
            options?.onSettled?.();
        }
    }, [mutation]);

    return { mutate, data, error, isError, isPending, isSettled, isSuccess }
}