/**
 * Run all the examples in the `examples` directory.
 */

var fs = require('fs');

var config = require('./config');
console.log(config);

var SPACER = '\n-------------------------------------\n\n';

var exampleFiles = fs.readdirSync(__dirname);
// only get the examples files identified by file naming convention
exampleFiles = exampleFiles.filter(function(fileName) {
  return fileName.match(/^ex\-.*\.js$/);
});
var exampleIndex = 0;
var currentExampleFile = null;
var failures = [];

function runNextExample(err, res) {
  if (err) {
    console.error('Error running', currentExampleFile, 'Error', err);
    failures.push({
      example: currentExampleFile,
      error: err
    });
  } else if (currentExampleFile) {
    console.log('Example complete:', currentExampleFile, 'Result', res);
  }

  if (exampleIndex < exampleFiles.length) {
    currentExampleFile = exampleFiles[exampleIndex];
    ++exampleIndex;

    console.log(SPACER, exampleIndex + '.', 'Loading', currentExampleFile);
    runExample(currentExampleFile, runNextExample);
  } else {
    console.log(SPACER, 'All examples complete');
    if (failures.length > 0) {
      console.error(SPACER, failures.length, 'example(s) provided errors\n\n', failures);
    }
  }
}

function runExample(exampleFile, callback) {
  var example = require(__dirname + '/' + exampleFile);

  console.log('Starting', exampleFile);
  example(callback, config);
}

// By default all examples are run.
// Use this array to run a select number of examples.
exampleFiles = [
  // 'ex-check-balance.js',
  // 'ex-create-update-delete-app.js',
  // 'ex-dtmf-to-call.js',
  // 'ex-make-call-ncco.js',
  // 'ex-send-verification.js',
  // 'ex-send-verification-with-workflow.js',
  // 'ex-check-verification.js',
  // 'ex-control-verification.js',
  // 'ex-search-verification.js',
  // 'ex-get-apps.js',
  // 'ex-get-calls.js',
  // 'ex-make-call.js',
  // 'ex-number-insight-basic.js',
  // 'ex-send-sms.js',
  // 'ex-send-signed-sms.js',
  // 'ex-verify-signed-sms.js',
  // 'ex-verify-signed-sms-without-instance.js',
  // 'ex-stream-to-call.js',
  // 'ex-talk-to-call.js',
  // 'ex-create-secret.js',
  // 'ex-get-secret.js',
  // 'ex-list-secrets.js',
  // 'ex-send-sms.js',
  // 'ex-create-user.js',
  // 'ex-get-user.js',
  // 'ex-update-user.js',
  // 'ex-delete-user.js',
  // 'ex-get-users.js',
  // 'ex-get-next-users.js',
  // 'ex-get-prev-users.js',
  // 'ex-create-member.js',
  // 'ex-update-member.js',
  // 'ex-delete-member.js',
  // 'ex-get-members.js',
  // 'ex-get-next-members.js',
  // 'ex-get-prev-members.js',
  // 'ex-get-member.js',
  // 'ex-create-event.js',
  // 'ex-delete-event.js',
  // 'ex-get-event.js',
  // 'ex-get-events.js',
  // 'ex-get-next-events.js',
  // 'ex-get-prev-events.js',
  // 'ex-create-read-update-delete-conversation.js',
  'ex-create-conversation.js',
  // 'ex-get-conversation.js',
  // 'ex-delete-conversation.js',
  // 'ex-update-conversation.js',
  // 'ex-record-conversation.js',
  // 'ex-get-conversations.js',
  // 'ex-get-next-conversations.js',
  // 'ex-get-prev-conversations.js',
  // 'ex-stream-to-call.js',
  // 'ex-dispatch.js',
  // 'ex-talk-to-call.js'
  // 'ex-revoke-secret.js',
  // 'ex-create-v1-application.js',
  // 'ex-create-v2-application.js',
  // 'ex-update-v1-application.js',
  // 'ex-update-v2-application.js',
  // 'ex-get-v1-application.js',
  // 'ex-get-v1-applications.js',
  // 'ex-get-v2-application.js',
  // 'ex-get-v2-applications.js',
  // 'ex-delete-application.js',
];

console.log('Found', exampleFiles.length, 'examples to run:\n', exampleFiles);
runNextExample();

// Run an individual example
// runExample('ex-send-sms.js', console.log);
// runExample('ex-number-insight-basic.js', console.log);
// runExample('ex-make-call.js', console.log);
// runExample('ex-get-apps.js', console.log);
// runExample('ex-talk-to-call.js', console.log);
// runExample('ex-dtmf-to-call.js', console.log);
// runExample('ex-stream-to-call.js', console.log);
