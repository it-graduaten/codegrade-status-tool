FROM node:16

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

EXPOSE 6061

copy . .

RUN pnpm install --shamefully-hoist

CMD ["pnpm", "start"]