FROM docker.io/library/node:lts-alpine3.14

RUN mkdir -p /app
WORKDIR /app

COPY *.json .
COPY yarn.lock .
COPY src/ ./src

RUN yarn && yarn build

EXPOSE 3000
ENTRYPOINT ["node"]
