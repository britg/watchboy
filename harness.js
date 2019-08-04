/* eslint-disable no-console */
process.title = 'watch harness';

const watchboy = require('./');

const patterns = process.argv.slice(2);
console.log('starting glob for:', patterns);

const files = [];
const dirs = [];
let ready = false;
const start = Date.now();

const watcher = watchboy(patterns).on('add', ({ path }) => {
  if (ready) return;
  files.push(path);
}).on('addDir', ({ path }) => {
  if (ready) return;
  dirs.push(path);
}).on('ready', () => {
  console.log('ready in %sms', Date.now() - start);
  console.log('watching %s files', files.length);
  console.log('watching %s directories', dirs.length);

  ready = true;

  watcher.on('add', ({ path }) => {
    console.log('add file after ready:', path);
  }).on('addDir', ({ path }) => {
    console.log('add dir after ready:', path);
  });
}).on('change', ({ path }) => {
  console.log('change:', path, Date.now());
}).on('remove', ({ path }) => {
  console.log('remove:', path);
});

// TODO:
// new directory created in watched directory fires an event
//  * new files in directory are watched
//  * new subdirectories are watched
// large file can wait for writes to finish before firing event
// when a directory is deleted, a remove event fires
// handle errors on every watcher

// DONE
// changed file fires an event
// new file created in watched directory fires an event
// when a file is deleted a remove event fires
//  * rename event is not propagated
// events are throttled to handle duplicates
