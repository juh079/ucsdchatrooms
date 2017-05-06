var moment = require('moment');
var now = moment();

console.log(now.format());
now.subtract(1, 'year');
console.log(now.format());
console.log(now.format('h:mma'));
console.log(now.format('MMM Do YYYY, h:mm a'));

console.log(now.format('X')); //secs
console.log(now.format('x')); //milliseconds
console.log(typeof now.format('X')); //secs
console.log(typeof now.format('x'));
// above two gives string output
// below gives neumeric output
console.log(now.valueOf());
console.log(typeof now.valueOf());

var timestamp = 1444247486704;
var timestampMoment = moment.utc(timestamp); 
console.log(timestampMoment.format()); // output will be timestamp in normal time
console.log(timestampMoment.format('h:mm a'));
console.log(timestampMoment.local().format('h:mm a'));

now.add(1, 'year');
console.log(now.format('MMM Do YYYY, h:mm a'));