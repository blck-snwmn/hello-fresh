/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";

interface Users {
  login: string;
  name: string;
  avatar_url: string;
  repos_url: string;
}

type Data = {
  login: string;
  name: string;
  avatar_url: string;
  query: string;
  repos: Repo[];
};
interface Repo {
  name: string;
}
export const handler: Handlers<Data | null> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || "";

    const { users } = ctx.params;
    const respUsers = await fetch(`https://api.github.com/users/${users}`);
    if (respUsers.status === 404) {
      return ctx.render(null);
    }
    const resp: Users = await respUsers.json();

    const respRepo = await fetch(resp.repos_url);
    if (respUsers.status === 404) {
      return ctx.render(null);
    }
    const repos: Repo[] = await respRepo.json();
    const rs = repos.filter(r => r.name.includes(query))
    return ctx.render({
      ...resp,
      query,
      repos: rs,
    });
  },
};

export default function Page({ data }: PageProps<Data | null>) {
  if (!data) {
    return <h1>User not found</h1>;
  }

  return (
    <div>
      <img src={data.avatar_url} width={64} height={64} />
      <h1>{data.name}</h1>
      <p>{data.login}</p>
      <form>
        <input type="text" name="q" value={data.query} />
        <button type="submit">Search</button>
      </form>
      <ul>
        {/* const href*/}
        {data.repos.map((r) => (
          <li>
            <a href={`http://localhost:8000/github/${data.login}/${r.name}`}>
              {r.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
