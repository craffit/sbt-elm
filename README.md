sbt-elm
=======

[![Build Status](https://api.travis-ci.org/sutiialex/sbt-elm.png?branch=master)](https://travis-ci.org/sutiialex/sbt-elm)

A plugin for integrating the elm compiler with sbt. The plugin looks for the
Main.elm in your assets directory and compiles it into Main.js in your public
assets directory.

Inspired from `sbt-stylus` [https://github.com/huntc/sbt-stylus], following this video:
[https://www.youtube.com/watch?v=lIznJSBW-GU].

> Note that this plugin is presently only working with an engineType set to Node e.g.:
> `set JsEngineKeys.engineType := JsEngineKeys.EngineType.Node`

For this plugin to work you need to have the elm compiler installed: `npm install -g elm`.

To build the plugin and run the tests, run: `sbt scripted`

This plugin is not yet integrated in the sbt plugin repository.
