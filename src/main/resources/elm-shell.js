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
    var ret = spawnSync("elm-make", args=syncArgs);
    var out = ret.stdout.toString();

    if (out.startsWith('[{')) {
      var jsonStr = out.match(/(.*)/m);
      throw parseError(input, contents, jsonStr[1]);
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


jst.process({processor: processor, inExt: ".elm", outExt: (args.options.compress? ".min.js" : ".js")}, args);


/**
 * Utility to take an elm error object and coerce it into a Problem object.
 */
function parseError(input, contents, err) {
  var errors = JSON.parse(err);
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
