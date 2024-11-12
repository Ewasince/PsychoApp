# 1st option

```shell
docker compose up psychoapp_backend_test -d
pgloader sqlite:///**/database.db postgresql://postgres:postgres@localhost:5432/psychoapp
```

# 2nd option

```shell
docker compose up psychoapp_db_test -d
migrate -database "postgres://postgres:postgres@localhost:5432/psychoapp?sslmode=disable" -path migrations up
pgloader sqlite:///**/database.db postgresql://postgres:postgres@localhost:5432/psychoapp
```