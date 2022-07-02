/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";

interface RespoJon {
  login: string;
  name: string;
  avatar_url: string;
  repos_url: string;
}

type User = {
  login: string;
  name: string;
  avatar_url: string;
  repos: Repo[];
};
interface Repo {
  name: string;
}
export const handler: Handlers<User | null> = {
  async GET(req, ctx) {
    const { users } = ctx.params;
    const respUsers = await fetch(`https://api.github.com/users/${users}`);
    if (respUsers.status === 404) {
      return ctx.render(null);
    }
    const resp: RespoJon = await respUsers.json();

    const respRepo = await fetch(resp.repos_url);
    if (respUsers.status === 404) {
      return ctx.render(null);
    }
    const repos: Repo[] = await respRepo.json();
    return ctx.render({
      ...resp,
      repos,
    });
  },
};

export default function Page({ data }: PageProps<User | null>) {
  if (!data) {
    return <h1>User not found</h1>;
  }

  return (
    <div>
      <img src={data.avatar_url} width={64} height={64} />
      <h1>{data.name}</h1>
      <p>{data.login}</p>
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
