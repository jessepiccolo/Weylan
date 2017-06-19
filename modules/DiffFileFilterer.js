// DiffFileFilterer.js
var DiffFileFilterer = function () {};

var debug = require('debug')('DiffFileFilterer');

var fileFilters = ["module"];

DiffFileFilterer.prototype.retrieveCode = function (repo, branch) {
  var createdDirectory = this.createUniqueDirectory();

  this.checkoutBranchOfCode(repo, branch, createdDirectory.path);

  this.getDiffBranchFiles(createdDirectory.path, function (diffOutput) {
    diffFiles = diffOutput;
    debug("Files diff'ed : %s", diffFiles);
  });


};

module.exports = new DiffFileFilterer();
