// GitWorker.js
var GitWorker = function () {};

var fs = require('fs');
var util = require('util');
var cuid = require('cuid');
var simpleGit = require('simple-git');
var debug = require('debug')('GitWorker');

var modConfig = {
  baseDir : "C:\\SourceCode\\WeylandTesting\\"
}

GitWorker.prototype.retrieveCode = function (repo, branch, callback) {
  var createdDirectory = this.createUniqueDirectory();

  this.checkoutBranchOfCode(repo, branch, createdDirectory.path);

  // this.getDiffBranchFiles(createdDirectory.path, function (diffOutput) {
  //   diffFiles = diffOutput;
  //   debug("Files diff'ed : %s", diffFiles);
  // });

  callback(createdDirectory.path);
};

GitWorker.prototype.createUniqueDirectory = function () {
  var uniqueKey = cuid();
  var uniqueDirectory = modConfig.baseDir + uniqueKey;
  debug("Making directory -> %s", uniqueDirectory);

  if (!fs.existsSync(uniqueDirectory)){
      fs.mkdirSync(uniqueDirectory);
  } else {
    error("Making directory -> %s, FAILED!, Directory Exits!", uniqueDirectory);
  }
  return {
    "path" : uniqueDirectory
  };
};

GitWorker.prototype.getDiffBranchFiles = function (localPath, callback) {
  debug("Getting branch diff files...");
  var output = simpleGit.diff(['--name-only','master'], function (err, data) {
    if (err) error(err);

    var diffOutput = data.trim().split('\n');

    debug("Returning: %s", diffOutput)
    return callback(diffOutput);
  });
};

GitWorker.prototype.checkoutBranchOfCode = function (cloneUrl, branch, localPath) {
  debug("Checking out a branch of code...");
  simpleGit = require('simple-git')( localPath );

  debug("Cloning %s to %s", cloneUrl, localPath);
  simpleGit.clone(cloneUrl, localPath);

  debug("Checking out branch %s", branch);
  simpleGit.checkout(branch);
};

module.exports = new GitWorker();
