# Mantine Next.js template

This is a template for [Next.js](https://nextjs.org/) app router + [Mantine](https://mantine.dev/).
If you want to use pages router instead, see [next-pages-template](https://github.com/mantinedev/next-pages-template).

## Features

This template comes with the following features:

- [PostCSS](https://postcss.org/) with [mantine-postcss-preset](https://mantine.dev/styles/postcss-preset)
- [TypeScript](https://www.typescriptlang.org/)
- [Storybook](https://storybook.js.org/)
- [Jest](https://jestjs.io/) setup with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- ESLint setup with [eslint-config-mantine](https://github.com/mantinedev/eslint-config-mantine)

## npm scripts

### Build and dev scripts

- `dev` – start dev server
- `build` – bundle application for production
- `analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `jest` – runs jest tests
- `jest:watch` – starts jest watch
- `test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `storybook` – starts storybook dev server
- `storybook:build` – build production storybook bundle to `storybook-static`
- `prettier:write` – formats all files with Prettier

## Docker

Requires Docker with the Compose plugin. Set the following in a local `.env` file:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-public-publishable-key
# Optional: used by the server's x-supabase-auth-token header
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Optional: host port (defaults to 3245)
APP_PORT=3245
```

Use only public Supabase keys here, never a service-role or secret key.

Build and start the production app:

```sh
docker compose up --build -d
```

Open <http://localhost:3245> (or the configured `APP_PORT`). Stop it with
`docker compose down`.

`NEXT_PUBLIC_*` variables are embedded at build time, so rebuild the image after
changing them. `.env` files are excluded from the Docker build context; Compose
passes only the listed variables. The image runs as a non-root user and uses
Next.js standalone output. Supabase is external to this Compose stack; configure
your Supabase authentication site URL and redirect URLs for the deployed app.
