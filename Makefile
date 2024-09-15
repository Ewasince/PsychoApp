LOCAL_BUILD_DIR := build

CONTAINER_BUILD_DIR := /tmp/build
CONTAINER_NAME := build-container

RESULT_FILE := psychoapp.tar.gz

REMOTE_HOST := cloud
REMOTE_UPLOAD_LOCATION := ~
REMOTE_INSTALL_LOCATION := ~/psychoapp_dir

REMOTE_APP_SUBDIR := psychoapp
REMOTE_SCREEN_SESSION_NAME := psychoapp

.PHONY: build upload install deploy

deploy: build upload install

build:
	@mkdir -p $(LOCAL_BUILD_DIR)
	@docker build . -t $(CONTAINER_NAME)
	@docker run --rm -v ./$(LOCAL_BUILD_DIR):$(CONTAINER_BUILD_DIR) $(CONTAINER_NAME)

upload:
	@scp ./$(LOCAL_BUILD_DIR)/$(RESULT_FILE) $(REMOTE_HOST):$(REMOTE_UPLOAD_LOCATION)


install:
	@ssh -t $(REMOTE_HOST) '\
		cd $(REMOTE_INSTALL_LOCATION) && \
		touch env.sh && \
		screen -S $(REMOTE_SCREEN_SESSION_NAME) -X quit || echo no screen && \
		rm -rf $(REMOTE_INSTALL_LOCATION)/$(REMOTE_APP_SUBDIR) && \
		tar -xvf $(REMOTE_UPLOAD_LOCATION)/$(RESULT_FILE) -C $(REMOTE_INSTALL_LOCATION) && \
		screen -S $(REMOTE_SCREEN_SESSION_NAME) -c .screenrc'
