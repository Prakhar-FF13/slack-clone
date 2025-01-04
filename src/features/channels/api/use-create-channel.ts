import {useMutation} from "convex/react";
import {api} from "../../../../convex/_generated/api";
import {useCallback, useMemo, useState} from "react";
import {Id} from "../../../../convex/_generated/dataModel";

type Options = {
    onSuccess?: (data: ResponseType) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void; // error / success doesnt matter, do this
    throwOnError?: boolean;
}

type RequestType = {name: string, workspaceId: Id<"workspaces">};
type ResponseType = Id<"channels"> | null;

export const useCreateChannel = () => {
    const [data, setData] = useState<ResponseType>();
    const [error, setError] = useState<Error | null>();

    const [status, setStatus] = useState<"success" | "error" | "settled" | "pending" | null>();

    const isPending = useMemo(() => status === "pending", [status]);
    const isSuccess = useMemo(() => status === "success", [status]);
    const isError = useMemo(() => status === "error", [status]);
    const isSettled = useMemo(() => status === "settled", [status]);

    const mutation = useMutation(api.channels.create);

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