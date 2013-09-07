SHELL = bash
NODE = $(shell which node)
NPM = $(shell which npm)
HR = node_modules/hr.js/bin/hr.js

.PHONY: all

all: build_static run

build_static:
	$(HR) build

install:
ifeq ($(NPM),)
	@echo -e "npm not found.\nInstall it from https://npmjs.org/"
	@exit 1
else
	$(NPM) install .
endif

run:
	$(HR) run