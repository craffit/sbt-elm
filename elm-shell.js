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
    var syncArgs = [input, "--output=".concat(output)];

    var spawnSync = require("child_process").spawnSync;
    var ret = spawnSync("elm-make", args=syncArgs, options={stdio: 'inherit'});

    if (ret.error) {
      throw parseError(input, contents, ret.error);
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
  var errLines = err.message.split("\n");
  var lineNumber = (errLines.length > 0? errLines[0].substring(errLines[0].indexOf(":") + 1) : 0);
  var lines = contents.split("\n", lineNumber);
  return {
    message: err.name + ": " + (errLines.length > 2? errLines[errLines.length - 2] : err.message),
    severity: "error",
    lineNumber: lineNumber,
    characterOffset: 0,
    lineContent: (lineNumber > 0 && lines.length >= lineNumber? lines[lineNumber - 1] : "Unknown line"),
    source: input
  };
}


