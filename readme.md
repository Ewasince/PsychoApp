# Fast start

## local

```bash
go run -C backend main.go
```

## docker

1. Если нет файла дб то скопировать `database.db.example` -> `database.db`
2. `docker compose up --build backend`
3. Зайти в аккаунт с данными `admin` `admin`


# build package
```
docker build . -t build-container && docker run --rm -v ./build:/tmp/build build-container
```

# send container
```
scp build/psychoapp.tar.gz cloud:~
```

# install app
```
tar -xvf psychoapp.tar.gz
```

# TODO
- [ ] registration
- [ ] ui for patients
