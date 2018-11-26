# babylonjs-webpack

## Demo

[https://codefine.github.io/demo/babylonjs/](https://codefine.github.io/demo/babylonjs/)

## Intro

Start a BABYLON.js project with:

* webpack
* typescript
* pep.js

## Start

``` bash
npm i yarn -g
yarn install
```

or

``` bash
npm i
```

## Scripts

``` bash
npm run dev     # start development server
npm run build   # package components for production env
```

## Structure

``` bash
- BABYLONJS Project
  |- config            # webpack confs
  |- src
     |- assets         # static resource (textures, models ets.)
     |- libs           # librarys and plugins
     |- styles         # sass styles
     |- components     # Game components
     |- index.ts       # entry file
     |- index.html     # basic html file
  |- postcss.config.js # postcss conf
  |- tsconfig.js       # ts conf
```

## libs

* `tencentToucbhFixers` - Fixed Touch-Error in mobile broswer such as { QQ, Wechat }