FROM frolvlad/alpine-glibc AS psychoapp-prod

RUN apk add --no-cache tzdata

ARG APP_FOLDER
ARG GO_BACKEND_EXE
ARG GO_BACKEND_EXE_PATH=$APP_FOLDER/$GO_BACKEND_EXE
ARG FRONT_BUILD_FOLDER

ENV FRONTEND_PATH=$FRONT_BUILD_FOLDER/build
WORKDIR $APP_FOLDER
COPY --from=psychoapp-backend-builder $GO_BACKEND_EXE_PATH $GO_BACKEND_EXE
COPY --from=psychoapp-front-builder $FRONT_BUILD_FOLDER ./
COPY migrations migrations

ENV GO_BACKEND_EXE=$GO_BACKEND_EXE

CMD ./$GO_BACKEND_EXE

FROM frolvlad/alpine-glibc AS psychoapp_bot-prod

RUN apk add --no-cache tzdata

ARG APP_FOLDER
ARG GO_BOT_EXE
ARG GO_BOT_EXE_PATH=$APP_FOLDER/$GO_BOT_EXE

WORKDIR $APP_FOLDER
COPY --from=psychoapp-backend-builder $GO_BOT_EXE_PATH $GO_BOT_EXE
COPY migrations migrations

ENV GO_BOT_EXE=$GO_BOT_EXE

CMD ./$GO_BOT_EXE

