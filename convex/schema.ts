import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";
import {authTables} from "@convex-dev/auth/server";

const schema = defineSchema({
    ...authTables,
    workspaces: defineTable({
        name: v.string(),
        userId: v.id("user"),
        joinCode: v.string()
    })
});

export default schema;