for start 
```bash
go run -C backend main.go
```

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
