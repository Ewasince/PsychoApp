LOCAL_BUILD_DIR := build

CONTAINER_BUILD_DIR := /tmp/build
CONTAINER_NAME := build-container

RESULT_FILE := psychoapp.tar.gz

REMOTE_HOST := cloud
REMOTE_UPLOAD_LOCATION := ~
REMOTE_INSTALL_LOCATION := ~/psychoapp_dir

REMOTE_APP_SUBDIR := psychoapp
REMOTE_SCREEN_SESSION_NAME := psychoapp

IMAGE_NAME := psychoapp
BACKEND_TAG := backend
BOT_TAG := bot
DOCKER_REPO := ewasince

.PHONY: build upload install deploy

deploy: build upload install

define pin_tag_and_pull
	@IMAGE_TAG=$(IMAGE_NAME):$(1) && \
	LATEST_TAG=$(DOCKER_REPO)/$$IMAGE_TAG-latest && \
	CURRENT_TAG=$(DOCKER_REPO)/$$IMAGE_TAG-$(shell git describe --tags) && \
	if docker images --format "{{.Repository}}:{{.Tag}}" | grep -q "^$$CURRENT_TAG$$" ; \
	then \
		echo "Forbidden to re-upload version tags '$$CURRENT_TAG'" >&2; \
	fi && \
	docker tag $$IMAGE_TAG $$LATEST_TAG && \
	docker tag $$IMAGE_TAG $$CURRENT_TAG && \
	docker push $$LATEST_TAG && \
	docker push $$CURRENT_TAG && \
	echo "$$LATEST_TAG pushed" && \
	echo "$$CURRENT_TAG pushed"
endef

build:
#	@mkdir -p $(LOCAL_BUILD_DIR)
	@docker compose build front_builder backend_builder bot_builder
	@docker compose build psychoapp psychoapp_bot
	$(call pin_tag_and_pull,$(BACKEND_TAG))
	$(call pin_tag_and_pull,$(BOT_TAG))
#	@docker tag $(BACKEND_TAG) $(DOCKER_REPO)/$(BACKEND_TAG)-latest
#	@docker tag $(BACKEND_TAG) $(DOCKER_REPO)/$(BACKEND_TAG)-latest

#	@docker build . -t $(CONTAINER_NAME)
#	@docker run --rm -v ./$(LOCAL_BUILD_DIR):$(CONTAINER_BUILD_DIR) $(CONTAINER_NAME)
#
#upload:
#	@scp ./$(LOCAL_BUILD_DIR)/$(RESULT_FILE) $(REMOTE_HOST):$(REMOTE_UPLOAD_LOCATION)
#
#
#install:
#	@ssh -t $(REMOTE_HOST) '\
#		cd $(REMOTE_INSTALL_LOCATION) && \
#		touch env.sh && \
#		screen -S $(REMOTE_SCREEN_SESSION_NAME) -X quit || echo no screen && \
#		rm -rf $(REMOTE_INSTALL_LOCATION)/$(REMOTE_APP_SUBDIR) && \
#		tar -xvf $(REMOTE_UPLOAD_LOCATION)/$(RESULT_FILE) -C $(REMOTE_INSTALL_LOCATION) && \
#		screen -S $(REMOTE_SCREEN_SESSION_NAME) -c .screenrc'
