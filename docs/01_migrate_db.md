# prepare

```plain
LOAD DATABASE
    FROM sqlite:///mnt/c/Users/ewas/GolandProjects/PsychoApp/database_prod.db
    INTO postgresql://postgres:postgres@localhost:5432/psychoapp

    WITH data only

    CAST type date to timestamp
    CAST type bigint to integer

    BEFORE LOAD DO
        $$ SET search_path TO public $$

    EXCLUDING TABLE NAMES LIKE 'schema_migrations'
;
```

# copy

## 1st option

```shell
docker compose up psychoapp_backend_test -d

pgloader load.load
```

## 2nd option

```shell
docker compose up psychoapp_db_test -d
migrate -database "postgres://postgres:postgres@localhost:5432/psychoapp?sslmode=disable" -path migrations up
pgloader sqlite:///**/database.db postgresql://postgres:postgres@localhost:5432/psychoapp
```