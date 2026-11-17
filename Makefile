# Canvas Ribbons Background — Build & Publish
#
# Usage:
#   make test     Run tests locally
#   make push     Push to Forgejo (origin) and GitHub

SHELL := /bin/bash
.SHELLFLAGS := -euo pipefail -c

# ---------------------------------------------------------------------------
# test: run tests locally
# ---------------------------------------------------------------------------
.PHONY: test
test:
	node canvas-ribbons.test.js
	node theme.test.js
	node animation-default.test.js

# ---------------------------------------------------------------------------
# push: main branch to both remotes. CI is .github/workflows/validate.yml
# (HACS validation). GitLab CE (git.example.com) is retired. Forgejo (origin)
# has an Actions runner that also picks up .github/workflows; the HACS job
# only does real work on GitHub.
# ---------------------------------------------------------------------------
.PHONY: push
push:
	git push origin main
	git push github main
