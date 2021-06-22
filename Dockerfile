FROM            node:current-alpine
WORKDIR         /cozziforms
COPY            . /cozziforms
RUN             yarn install
EXPOSE          5050

CMD             [ "yarn", "run", "production" ]