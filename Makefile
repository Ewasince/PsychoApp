REMOTE_HOST := cloud
REMOTE_INSTALL_LOCATION := ~/psychoapp_docker
REMOTE_SCREEN_SESSION_NAME := psychoapp_docker

IMAGE_NAME := psychoapp
BACKEND_TAG := backend
BOT_TAG := bot
DOCKER_REPO := ewasince

CONTAINER_NAME_BACKEND := psychoapp_backend
CONTAINER_NAME_BOT := psychoapp_bot

DATA_PATH := images

.PHONY: build push deploy upload_data

deploy: build push install

define pin_tag_and_pull
	@IMAGE_TAG=$(IMAGE_NAME):$(1) && \
	LATEST_TAG=$(DOCKER_REPO)/$$IMAGE_TAG-latest && \
	CURRENT_TAG=$(DOCKER_REPO)/$$IMAGE_TAG-$(shell git describe --tags) && \
	if docker images --format "{{.Repository}}:{{.Tag}}" | grep -q "^$$CURRENT_TAG$$" ; \
	then \
		echo "Forbidden to re-upload version tags '$$CURRENT_TAG'" >&2; \
		exit 1; \
	fi && \
	docker tag $$IMAGE_TAG $$LATEST_TAG && \
	docker tag $$IMAGE_TAG $$CURRENT_TAG && \
	docker push $$LATEST_TAG && \
	docker push $$CURRENT_TAG && \
	echo "$$LATEST_TAG pushed" && \
	echo "$$CURRENT_TAG pushed"
endef

build:
	@docker compose build front_builder backend_builder bot_builder
	@docker compose build psychoapp psychoapp_bot

push:
	$(call pin_tag_and_pull,$(BACKEND_TAG))
	$(call pin_tag_and_pull,$(BOT_TAG))

install:
	@ssh -t $(REMOTE_HOST) '\
		cd $(REMOTE_INSTALL_LOCATION) && \
		touch .env && \
		docker compose down $(CONTAINER_NAME_BACKEND) $(CONTAINER_NAME_BOT) && \
		screen -S $(REMOTE_SCREEN_SESSION_NAME) -X quit || echo no screen && \
		docker compose pull && \
		docker compose up -d $(CONTAINER_NAME_BACKEND) $(CONTAINER_NAME_BOT) && \
		screen -S $(REMOTE_SCREEN_SESSION_NAME) -c .screenrc'

upload_data:
	@scp $(DATA_PATH)/* $(REMOTE_HOST):$(REMOTE_INSTALL_LOCATION)/$(DATA_PATH)

