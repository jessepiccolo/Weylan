// TerraformProcessor.js
var TerraformProcessor = function() {};

var os = require('os');
var async = require('async');
var path = require('path');
//var ezspawn = require('ezspawn');
//var spawn = require('cross-spawn');
var util = require('util');

var debug = require('debug')('TerraformProcessor');

var modConfig = {
  baseDir: 'C:\\SourceCode\\WeylandTesting\\',
  terraformCommandArgs: '-detailed-exitcode',
};

var isWin = /^win/.test(os.platform());

function runTerraformGet(workingFolder, callback) {
  runTerraform(workingFolder, 'get');
};

function runTerraformPlan(workingFolder) {
  runTerraform(workingFolder, 'plan', modConfig.terraformCommandArgs);
};


function runTerraform(workingFolder, action, otherArgs) {
  var commandToRun = util.format('terraform %s %s @ %s', action, otherArgs, workingFolder);

  debug('running command [%s],', commandToRun);

  var execFile = require('child_process').execFile;
  var exec = require("child_process").exec;


  //   const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  //   if (error) {
  //       console.error('stderr', stderr);
  //       throw error;
  //   }
  //   console.log('stdout', stdout);
  // });


  // var child = execFile('terraform', [action, workingFolder],
  //   (error, stdout, stderr) => {
  //     if (error) {
  //       //debug(stderr);
  //       console.error('stderr', stderr);
  //       //throw error;
  //     }
  //     //debug(stdout);
  //     console.log('stdout', stdout);
  // });

  var exeChild = exec(util.format("terraform %s %s", action, otherArgs || ""), {
      cwd: workingFolder
    },
    (e, stdout, stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e;
      }
      console.log('stdout ', stdout);
      console.log('stderr ', stderr);
    });


  // var child = execFile('terraform', [action, workingFolder]);
  //
  //
  // child.stdout.on('data', function(data) {
  //     console.log(data.toString());
  // });
  //
  // child.stderr.on('data', function(data) {
  //     console.log(data.toString());
  // });



  // const execa = require('execa');
  // execa('terraform', [action, otherArgs], [defaults]).then(result => {
  //     console.log(result.stdout);
  //     //=> 'unicorns'
  // });


  // execa('terraform', [action, otherArgs]).stdout.pipe(process.stdout);

  //execa('terraform', [action, otherArgs], defaults).stdout.pipe(process.stdout);


  // trun.stderr.on('data', (data) => {
  //   console.log(`stderr: ${data}`);
  // });
  //
  // trun.on('close', (code) => {
  //   console.log(`child process exited with code ${code}`);
  // });

  //var results = spawn.sync('terraform', [action, otherArgs], defaults , { stdio: 'inherit' });
};

TerraformProcessor.prototype.runTerraformPlan = function(workingFolder, callback) {
  //runTerraformGet(workingFolder);
  // runTerraformPlan(workingFolder);

  async.waterfall([
    function(callback) {
      runTerraformGet(workingFolder);
      callback(null);
    },
    // function(callback) {
    //     runTerraformPlan(workingFolder);
    //     callback(null);
    // },
  ], function(err) {
    if (error) {
      console.log(err);
    }
  });
};

module.exports = new TerraformProcessor();
