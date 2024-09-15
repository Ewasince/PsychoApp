ARG GO_BACKEND_EXECUTABLE=psychoapp
ARG GO_BOT_EXECUTABLE=psychoapp_bot

FROM golang:1.22-bookworm AS go_builder

ARG GO_BACKEND_EXECUTABLE
ARG GO_BOT_EXECUTABLE

WORKDIR /tmp

COPY environment environment
COPY storage storage
COPY backend backend
COPY tgbot tgbot

RUN cd /tmp/environment && \
    go mod tidy && \
    cd /tmp/storage && \
    go mod tidy && \
    cd /tmp/backend && \
    go mod tidy && \
    go build -o /tmp/$GO_BACKEND_EXECUTABLE main.go

RUN cd /tmp/tgbot && \
    go mod tidy && \
    go build -o /tmp/$GO_BOT_EXECUTABLE main.go

FROM node:14-bullseye-slim

ARG GO_BACKEND_EXECUTABLE
ARG GO_BOT_EXECUTABLE

ARG FRONT_TEMP_FOLDER=/tmp/front
ARG FRONT_LOCAL_FOLDER=psycho-app-admin
ARG APP_FOLDER=/opt/psychoapp

#RUN apt update && \
#    apt install build-essential debhelper -y

# build front
WORKDIR $FRONT_TEMP_FOLDER
COPY $FRONT_LOCAL_FOLDER/package*.json .
RUN npm i -d typescript && \
    npm install

COPY $FRONT_LOCAL_FOLDER .
RUN npm run build

# collect all artifacts to directory
WORKDIR $APP_FOLDER
RUN mkdir -p build && \
    mv $FRONT_TEMP_FOLDER/build .
COPY --from=go_builder /tmp/$GO_BACKEND_EXECUTABLE $GO_BACKEND_EXECUTABLE
COPY --from=go_builder /tmp/$GO_BOT_EXECUTABLE $GO_BOT_EXECUTABLE
COPY migrations migrations

# make archive
WORKDIR $APP_FOLDER/..
CMD tar -cvzf psychoapp.tar.gz psychoapp && \
    mv psychoapp.tar.gz /tmp/build

