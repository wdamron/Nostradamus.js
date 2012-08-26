var normal = require('./lib/holt-winters.js'),
	memo = require('./lib/holt-winters-memoize.js');

normal.memo = memo;
module.exports = normal;