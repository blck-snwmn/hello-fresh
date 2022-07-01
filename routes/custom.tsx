/** @jsx h */
import { h } from "preact";
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
    async GET(req, ctx) {
        const resp = await ctx.render();
        resp.headers.set("X-Custom-Header", "zzzzzzz");
        return resp;
    },
};
export default function Home() {
    return <div>hello x</div>;
}
