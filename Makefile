develop:
	npx webpack serve --open

install:
	npm install

build:
	rm -rf dist
	NODE_ENV=production npx webpack

publish:
	npm publish --dry-run

lint:
	npx eslint .
