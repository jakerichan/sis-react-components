# SIS React Components

## Pre-requisites

You can get all of these dependencies directly from homebrew

* yarn >= 1.0.0 (https://yarnpkg.com/en/docs/install)

```shell
$ brew update
$ brew upgrade yarn
```

## Get up and running

You will need to login to the local core at least once, you can usually
accomplish this by getting the api up and running and then going to
http://monsters-local.kuali.co/auth/kuali and logging in, then using the token
from the cookie for the steps below

```shell
$ git clone git@github.com:kualico/resources-ui.git
$ cd resources-ui
$ yarn
$ yarn start
```

## Other scripts of note

```shell
$ yarn build              # Build the assets
$ yarn start              # Starts the dev server
$ yarn lint               # Run "standard" lint check
$ yarn test               # Run tests
```
