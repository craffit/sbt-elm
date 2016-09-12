var fs = require("fs"),
    jst = require("jstranspiler"),
    nodefn = require("when/node"),
    mkdirp = require("mkdirp"),
    path = require("path");

var promised = {
    mkdirp: nodefn.lift(mkdirp),
    readFile: nodefn.lift(fs.readFile),
  };

var args = jst.args(process.argv);

function processor(input, output) {

  return promised.readFile(input, "utf8").then(function(contents) {
    return promised.mkdirp(path.dirname(output)).yield(contents);
  }).then(function(contents) {
    var syncArgs = [input, "--output=".concat(output), "--yes", "--warn", "--report=json"];

    var spawnSync = require("child_process").spawnSync;
    // Dirty hack. This should go in SbtElm.scala, but I haven't found how
    var packageLocation = "assets/elm";
    var cwd = require("path").resolve("./");
    var idxPackLoc = input.indexOf(packageLocation);
    if (idxPackLoc !== -1)
      cwd = input.substring(0, idxPackLoc + packageLocation.length);

    var ret = spawnSync("elm-make", args=syncArgs, options={cwd: cwd});
    if (ret.error)
      throw spawnError(input, ret.error);
    var out = ret.stdout.toString();
    var err = ret.stderr.toString();

    if (out.indexOf('[{"tag"') !== -1) {
      var jsonStr = out.match(/\[{.*}\]/m)[0];
      throw parseError(input, contents, jsonStr);
    } else if (ret.status !== 0) {
        throw compileError(input, err + "\n" + out);
    } else {
      return output;
    }
  }).then(function(output) {
    return {
      source: input,
      result: {
          filesRead: [input],
          filesWritten: [output]
      }
    };
  }).catch(function(e) {
    if (jst.isProblem(e)) return e; else throw e;
  });

}


jst.process({processor: processor, inExt: ".elm", outExt: ".js"}, args);


/**
 * Utility to take an elm error object and coerce it into a Problem object.
 */
function parseError(input, contents, jsonStr) {
  var errors = JSON.parse(jsonStr);
  var computedErrors = [];
  for (i = 0; i < errors.length; i++) {
    var error = errors[i];
    var lineNumber = error.region.start.line;
    var lines = contents.split("\n", lineNumber);
    var lineContent = lines[lineNumber - 1];
    for (i = error.region.start.line + 1; i <= error.region.end.line; i++)
      lineContent = lineContent.concat("\n" + lines[i - 1]);
    computedErrors = computedErrors.concat({
      message: error.tag + ": " + error.overview + "\n" + error.details,
      severity: error.type,
      lineNumber: lineNumber,
      characterOffset: error.region.start.column,
      lineContent: lineContent,
      source: error.file
    });
  }
  // Jstranspiler does not support returning more than one error
  return computedErrors[0];
}

function customError(input, message) {
  return {
    message: message,
    severity: "error",
    lineNumber: 1,
    characterOffset: 1,
    lineContent: "",
    source: input
  };
}

/**
 * Throws the error that spawn throws
 */
function spawnError(input, err) {
  return customError(input, "Error running the compiler! Are you sure you have" +
      " elm-make installed? Run: npm install -g elm." +
      "\n" + err);
}

/**
 * Throws the error that the compiler throws when it has not generated a json
 */
function compileError(input, err) {
  return customError(input, "Error: \n" + err);
}
