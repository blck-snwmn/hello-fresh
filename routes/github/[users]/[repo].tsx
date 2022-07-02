/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";

interface RespoJon {
    login: string;
    name: string;
    avatar_url: string;
    repos_url: string;
}

interface Repo {
    full_name: string;
    name: string;
}
export const handler: Handlers<Repo | null> = {
    async GET(req, ctx) {
        console.log(ctx.params);
        const { users, repo } = ctx.params;
        const resp = await fetch(`https://api.github.com/repos/${users}/${repo}`);
        if (resp.status === 404) {
            return ctx.render(null);
        }
        const r: Repo = await resp.json();
        return ctx.render({ ...r });
    },
};

export default function Page({ data }: PageProps<Repo | null>) {
    if (!data) {
        return <h1>Repository not found</h1>;
    }

    return <div>
        <h1>{data.full_name}</h1>
        <p>{data.name}</p>
    </div>;
}
