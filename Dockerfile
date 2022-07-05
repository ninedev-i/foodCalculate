FROM node:16.13.1-alpine as builder

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

COPY --chown=node:node ./ /app/

USER node
RUN yarn install
RUN yarn run build

FROM nginx:alpine

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html
EXPOSE 3000 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]