ARG GO_BACKEND_EXECUTABLE=psychoapp
ARG GO_BOT_EXECUTABLE=psychoapp_bot


FROM golang:1.22-bookworm AS go_bot-builder

ARG GO_BOT_EXECUTABLE

ENV GOPATH=/root/go
ENV GO_BOT_EXECUTABLE=$GO_BOT_EXECUTABLE

WORKDIR /tmp

COPY environment environment
COPY storage storage
COPY telegram_state_bot telegram_state_bot
COPY tgbot tgbot
RUN --mount=type=cache,mode=0755,target=/root/.cache/go-build --mount=type=cache,mode=0755,target=/root/go \
    cd /tmp/environment && \
    go mod download && \
    cd /tmp/storage && \
    go mod download && \
    cd /tmp/telegram_state_bot && \
    go mod download && \
    cd /tmp/tgbot && \
    go mod download && \
    go build -o /app/$GO_BOT_EXECUTABLE main.go && \
    rm -rf /tmp/*

CMD ["/app/$GO_BOT_EXECUTABLE"]

FROM node:14-bullseye-slim

ARG GO_BACKEND_EXECUTABLE
ARG GO_BOT_EXECUTABLE

ARG FRONT_TEMP_FOLDER=/tmp/front
ARG FRONT_LOCAL_FOLDER=psycho-app-admin
ARG APP_FOLDER=/opt/psychoapp
ARG BUILD_FOLDER=/tmp/build

# build front
WORKDIR $FRONT_TEMP_FOLDER
COPY $FRONT_LOCAL_FOLDER/package*.json .
RUN --mount=type=cache,mode=0755,target=/root/.npm \
    npm i -d typescript && \
    npm i

COPY $FRONT_LOCAL_FOLDER .
RUN npm run build

# collect all artifacts to directory
WORKDIR $APP_FOLDER
RUN mkdir -p build && \
    mv $FRONT_TEMP_FOLDER/build .
COPY --from=go_backend-builder /app/$GO_BACKEND_EXECUTABLE $GO_BACKEND_EXECUTABLE
COPY --from=go_bot-builder /app/$GO_BOT_EXECUTABLE $GO_BOT_EXECUTABLE
COPY migrations migrations
COPY images images

# make archive
WORKDIR $APP_FOLDER/..
ENV APP_FOLDER=$APP_FOLDER
ENV BUILD_FOLDER=$BUILD_FOLDER
CMD tar -cvzf psychoapp.tar.gz $(basename $APP_FOLDER) && \
    mv psychoapp.tar.gz $BUILD_FOLDER

