FROM docker.io/library/node:lts-alpine3.16


RUN apk add tini && mkdir -p /app
WORKDIR /app

COPY *.json .
COPY yarn.lock .
COPY src/ ./src
COPY data/ ./data

RUN yarn && yarn build

EXPOSE 3000
ENTRYPOINT ["tini", "--", "node"]
