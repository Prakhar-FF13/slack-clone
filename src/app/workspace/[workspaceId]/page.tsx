import {param} from "ts-interface-checker";

interface WorkspaceIdPageParamsProps {
    params: {
        workspaceId: string;
    }
}

export default function WorkspaceIdPage({params}: WorkspaceIdPageParamsProps) {
    return (
        <div>
            ID: {params.workspaceId}
        </div>
    )
}