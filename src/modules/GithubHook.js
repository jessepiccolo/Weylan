// GithubHook.js
var GithubHook = function () {};

var colors = require('colors');
var gitHookLib = require('githubhook');
var util = require('util');
var stringify = require('json-stringify-safe');

var modConfig = {
  host : "0.0.0.0",
  port : 8082,
  path: "/github-webook",
  secret: "123456"
}

GithubHook.prototype.loadConfig = function (config) {
  modConfig = config;
};
GithubHook.prototype.log = function (output) {
  console.log(colors.yellow(output));
};
GithubHook.prototype.version = function () {
  this.log("Version 0.1 Created by Jesse Piccolo");
};
GithubHook.prototype.logReturnValues = function (values) {
  this.log(util.format("action: %s", values.action));
  this.log(util.format("repoUrl: %s", values.repoUrl));
  this.log(util.format("branch: %s", values.branch));
};
GithubHook.prototype.listen = function () {
  // configure listener for github changes
  var github = gitHookLib({/* options */
     host: modConfig.host,
     port: modConfig.port,
     path: modConfig.path,
     secret: modConfig.secret
  });

  this.log("Starting to listen..");
  github.listen();

  // listen to push on github on branch master
  github.on('push', function (repo, ref, data) {
    var util = require('util');

    console.log(util.format("Repo:%s", repo).yellow);
    console.log(util.format("Ref:%s", ref).yellow);
    console.log(util.format("data:%s", data).yellow);
    //console.log(stringify(data, null, 2).yellow);

    // Git.Clone("https://github.com/nodegit/nodegit", "nodegit").then(function(repository) {
    //   // Work with the repository object here.
    // });
  });

  github.on('pull_request', function(repo, ref, payload) {
     var thisGithubHook = new GithubHook();
     thisGithubHook.log("(Pull Request) This is a test, this is only a test...");
     var parsedPR = thisGithubHook.parsePullRequest(payload);
     thisGithubHook.logReturnValues(parsedPR);
  });
};

GithubHook.prototype.parsePullRequest = function (payload) {
  this.log("Starting to parse a PR...");
  var repoUrl = payload.pull_request.head.repo.clone_url;
  var branch = payload.pull_request.head.ref;
  var action = payload.action;
  return {
    "action" : action,
    "repoUrl" : repoUrl,
    "branch" : branch
  };
};

GithubHook.prototype.testPullRequest = function (req, payload) {
  this.log(util.format("Testing pull_request..."));

  var parsedPR = this.parsePullRequest(payload);
  this.logReturnValues(parsedPR);

  return parsedPR;
};

module.exports = new GithubHook();
