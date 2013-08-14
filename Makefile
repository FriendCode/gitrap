SHELL = bash
NODE = $(shell which node)
NPM = $(shell which npm)
YAPP = node_modules/yapp/bin/yapp.js

.PHONY: all

all: build_static run

build_static:
	$(YAPP) build

install:
ifeq ($(NPM),)
	@echo -e "npm not found.\nInstall it from https://npmjs.org/"
	@exit 1
else
	$(NPM) install .
endif

run:
	$(YAPP) run