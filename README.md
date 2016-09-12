sbt-elm
=======

[![Build Status](https://api.travis-ci.org/sutiialex/sbt-elm.png?branch=master)](https://travis-ci.org/sutiialex/sbt-elm)

A plugin for integrating the elm compiler with Scala Build Tool and Play
Framework. It is based on sbt-web and com.typesafe.sbt:js-engine.

Inspired from `sbt-stylus` [https://github.com/huntc/sbt-stylus], following this video:
[https://www.youtube.com/watch?v=lIznJSBW-GU].

Requirements
============
For this plugin to work you need to have the elm compiler installed: `npm install -g elm`.

Usage in Play/Sbt
=================
To use the plugin in Play, add this line to your project's plugins.sbt:

```scala
lazy val root = project.in(file(".")).dependsOn(sbtElm)
lazy val sbtElm = uri("https://github.com/sutiialex/sbt-elm.git")
```

Your build.sbt should also enable sbt-web plugins, i.e., it should contain the
following line:
    lazy val root = (project in file(".")).enablePlugins(SbtWeb)

You have to place your `.elm` files in `src/main/assets/js`. By default, the
plugin will look for `Main.elm` and compile it. It will generate `Main.js` in
`target/web/elm/main/js`. The elm compiler recursively builds all the modules
imported by `Main.elm`.

If you want your other `.elm` files to be considered by the Elm compiler,
add the following line to `build.sbt`:

```scala
includeFilter in (Assets, ElmKeys.elm) := "foo.elm" | "bar.elm"
```

Limitations
===========
> Note that this plugin is presently only working with an engineType set to Node e.g.:
> `set JsEngineKeys.engineType := JsEngineKeys.EngineType.Node`

Building and Running Tests
==========================
> This step is not needed unless you want to tweak with the plugin.

If you have elm installed, simply run:
    sbt scripted

If you want to also install elm compiler, run in the root of the repository:
    sh build.sh
