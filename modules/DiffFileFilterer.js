// DiffFileFilterer.js
var DiffFileFilterer = function () {};

//var q = require('q');
var async = require('async');
var debug = require('debug')('DiffFileFilterer');
var path = require('path');
var HashMap = require('hashmap');

DiffFileFilterer.prototype.determineWorkingFolder = function (localPath, listOfFiles) {
  debug("Trying to determine the working folder to use...");
  debug("File list: %s", listOfFiles);

  var locals = {};
  locals.localPath = localPath;
  locals.listOfFiles = listOfFiles;
  async.series([
    function(callback) {
      debug("Getting file filters...");
      // will have to reach out to the db
      var fileFilters = ["module"];
      locals.fileFilters = fileFilters;
      callback();
    },
    function(callback) {
      debug("Trying to apply filter...");
      locals.filteredFiles = [];

      for (var i = 0, leni = locals.fileFilters.length; i < leni; i++) {
        var filter = locals.fileFilters[i];
        debug("applying filter: %s", filter);
        for (var j = 0, lenj = locals.listOfFiles.length; j < lenj; j++) {
          var file = listOfFiles[j];
          if (file.match(filter)) { }
           else {
             debug("considering %s", file);
             locals.filteredFiles.push(file);
           }
        }
      }
      callback();
    },
    function(callback) {
      var hashmap = new HashMap();
      debug("Determining folder.... %s", locals.filteredFiles);

      for (var i = 0, len = locals.filteredFiles.length; i < len; i++) {
        var dirName = path.dirname(locals.filteredFiles[i])
        debug("Found dirName:%s", dirName);

        if (hashmap.has(dirName)) {
          var tmp = hashmap.get(dirName);
          hashmap.set(dirName, ++tmp);
        } else {
          hashmap.set(dirName, 1)
        }
      }
      printHashmap(hashmap);
      locals.filteredFileHashmap = hashmap;
      callback();
    },
    function(callback) {
      var maxDirCount = Math.max.apply(null, locals.filteredFileHashmap.values());
      debug("MaxDirCount:%s", maxDirCount);
      var mostUsedDir = [];
      locals.filteredFileHashmap.forEach(function(value, key) {
        if (value === maxDirCount) {
          mostUsedDir.push(key);
        }
      });
      // this will have to change when I support more directories.
      locals.mostUsedDir = path.join(localPath, mostUsedDir[0]);
      callback();
    },
    function(callback) {
      debug("Directory to terraform: %s", locals.mostUsedDir.toString());
      callback(null, locals.mostUsedDir);
    }
  ],
  function(err) { //This function gets called after the two tasks have called their "task callbacks"
          if (err) return next(err);
          console.error(err)
      });
};

function printHashmap(hashmap) {
  debug("***hashmap values***");
  hashmap.forEach(function(value, key){
    debug("   %s -> %s", key, value)
  });
}

module.exports = new DiffFileFilterer();
