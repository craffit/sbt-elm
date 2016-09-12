sbt-elm
=======

[![Build Status](https://api.travis-ci.org/sutiialex/sbt-elm.png?branch=master)](https://travis-ci.org/sutiialex/sbt-elm)

A plugin for integrating the Elm compiler with Scala Build Tool and Play
Framework. It is based on `sbt-web` and `com.typesafe.sbt:js-engine`.

Inspired from [sbt-stylus](https://github.com/huntc/sbt-stylus), following this
[video](https://www.youtube.com/watch?v=lIznJSBW-GU).

Requirements
============
For this plugin to work you need to have the Elm compiler installed:

    npm install -g elm

Usage in Play/Sbt
=================
To use the plugin in Play, add this line to your project's `plugins.sbt`:

```scala
lazy val root = project.in(file(".")).dependsOn(sbtElm)
lazy val sbtElm = uri("https://github.com/sutiialex/sbt-elm.git")
```

Your `build.sbt` should also enable sbt-web plugins, i.e., it should contain the
following line:

    lazy val root = (project in file(".")).enablePlugins(SbtWeb)

You have to place your `.elm` files in `src/main/assets/elm` or in any of its
subdirectories. If you have an elm project (as described by
[elm-make](https://github.com/elm-lang/elm-make) with an `elm-package.json`,
place it in `src/main/assets/elm`. The Elm compiler will run in that directory
and will take that into consideration. The plugin will look for `Main.elm` in
`src/main/assets/elm` or `src/main/assets/elm/<path_to_subdir>` and compile it.
It will generate `Main.js` in `target/web/public/main/elm` or
`target/web/public/main/elm/<path_to_subdir>`. The Elm compiler recursively
builds all the modules imported by `Main.elm`.

Limitations
===========
This plugin is presently only working with an engineType set to Node e.g.:

    set JsEngineKeys.engineType := JsEngineKeys.EngineType.Node

Building and Running Tests
==========================
> Note that this step is not needed unless you want to tweak with the plugin.

If you have Elm installed, simply run:

    sbt scripted

If you want to also install Elm compiler, run in the root of the repository:

    sh build.sh
