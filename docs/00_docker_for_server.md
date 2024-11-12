# docker useful commands

## services update
```shell
docker-compose pull
docker-compose up --build psychoapp_backend_test
docker-compose up --build psychoapp_bot_test
```

# docker-compose example

```yaml
services:
  psychoapp_backend_test:
    image: ewasince/psychoapp:backend-latest
    depends_on:
      psychoapp_db_test:
        condition: service_healthy
    restart: on-failure
    ports:
      - 8181:8181
    env_file:
      - .env
    environment:
      POSTGRES_HOST: psychoapp_db_test

  psychoapp_bot_test:
    image: ewasince/psychoapp:bot-latest
    depends_on:
      psychoapp_db_test:
        condition: service_healthy
    restart: on-failure
    volumes:
      - ./images:/app/images
    env_file:
      - .env
    environment:
      POSTGRES_HOST: psychoapp_db_test

  psychoapp_db_test:
    image: postgres:17-alpine
    container_name: psychoapp_db_test
    env_file:
      - .env
    environment:
      POSTGRES_USER: "${POSTGRES_USER}"
      POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"
      POSTGRES_DB: "${POSTGRES_DB}"
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}" ]
      interval: 10s
      timeout: 10s
      retries: 5
    ports:
      - "${POSTGRES_PORT}:5432"
    volumes:
      - ./database:/var/lib/postgresql/data
```