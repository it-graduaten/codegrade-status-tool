FROM node:16

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app
COPY . .

RUN pnpm install --shamefully-hoist
RUN pnpm build

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000 

ENTRYPOINT ["node", ".output/server/index.mjs"]