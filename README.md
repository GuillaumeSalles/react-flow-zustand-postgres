This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This project is a proof of concept combining [React Flow](https://reactflow.dev/docs/quickstart/), [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) storage and [Liveblocks](https://liveblocks.io/). The react flow diagrams data is never going through Liveblocks server. Liveblocks is only used on collaborative diagrams.

## Getting Started

- Install all dependencies with `npm install`
- Create an account on [liveblocks.io](https://liveblocks.io/dashboard)
- Copy your **secret** key from the [dashboard](https://liveblocks.io/dashboard/apikeys)
- Create an `.env.local` file and add your **secret** key as the `LIVEBLOCKS_SECRET_KEY` environment variable
- Setup a Vercel Postgres database and add environment variable as explained in https://vercel.com/docs/storage/vercel-postgres/quickstart
- Your `.env.local` should look something like this

```
LIVEBLOCKS_SECRET_KEY="sk_xxx"

POSTGRES_URL="postgres://default:xxxx@yyyyy-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb"
POSTGRES_PRISMA_URL="postgres://default:xxxx@yyyyy-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://default:xxxx@yyyyy.us-east-1.postgres.vercel-storage.com:5432/verceldb"
POSTGRES_USER="default"
POSTGRES_HOST="xxxx@yyyyy-pooler.us-east-1.postgres.vercel-storage.com"
POSTGRES_PASSWORD="xxxx"
POSTGRES_DATABASE="verceldb"

```

- Run `npm run dev` and go to [http://localhost:3000/api/reset-database](http://localhost:3000/api/reset-database) to initialize Postgres tables with some data

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
