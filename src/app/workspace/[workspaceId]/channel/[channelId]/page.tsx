"use client";

import {useChannelId} from "@/hooks/use-channel-id";
import {useGetChannelById} from "@/features/channels/api/use-get-channel";
import {Loader, TriangleAlert} from "lucide-react";
import {Header} from "@/app/workspace/[workspaceId]/channel/[channelId]/header";
import {ChatInput} from "@/app/workspace/[workspaceId]/channel/[channelId]/chat-input";
import {useGetMessages} from "@/features/messages/api/use-get-messages";

const ChannelIdPage = () => {
    const channelId = useChannelId();

    const {results} = useGetMessages({channelId});
    const {data: channel, isLoading: channelLoading} = useGetChannelById({id: channelId});

    console.log(results);

    if (channelLoading) {
        return (
            <div className={"h-full flex flex-1 items-center justify-center"}>
                <Loader className={"animate-spin size-5 text-muted-foreground"}/>
            </div>
        )
    }

    if (!channel) {
        return (
            <div className={"h-full flex flex-col gap-y-2 flex-1 items-center justify-center"}>
                <TriangleAlert className={"size-6 text-muted-foreground"}/>
                <span className={"text-sm text-muted-foreground"}>
                    No channels found
                </span>
            </div>
        )
    }

    return (
        <div className={"flex flex-col h-full"}>
            <Header title={channel.name}/>
            <div className={"flex-1"}/>
            <div>
                {JSON.stringify(results)}
            </div>
            <ChatInput placeholder={`Message # ${channel.name}`}/>
        </div>
    );
}

export default ChannelIdPage;