FROM alpine:3.10

RUN apk add --update nodejs npm yarn

RUN addgroup -S app && adduser -S app -G app

USER app

RUN mkdir /home/app/api

WORKDIR /home/app/api 

COPY --chown=app:app yarn.lock package.json ./


RUN yarn install 

COPY --chown=app:app . .

EXPOSE 8000

CMD ["yarn","start"]

