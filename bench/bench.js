#!/usr/bin/env node

var Benchmark = require('../node_modules/benchmark/benchmark.js'),
	normal = require('../lib/holt-winters.js'),
	memo = require('../lib/holt-winters-memoize.js'),
	suite = new Benchmark.Suite;

	data = [362, 385, 432, 341, 382, 409, 498, 387, 473, 513, 582, 474, 544, 582, 681, 557, 628, 707, 773, 592, 627, 725, 854, 661],
	alpha = 0.5,
	beta = 0.4,
	gamma = 0.6,
	period = 4,
	m = 4,

	memoed = memo({
		length: data.length,
		alpha: alpha,
		beta: beta,
		gamma: gamma,
		period: period,
		m: m
	});

// add tests
suite
	.add('nostradamus-> normal', function() {
		return normal(data, alpha, beta, gamma, period, m);
	})
	.add('nostradamus-> memo', function() {
		return memoed(data);
	})

// add listeners
.on('cycle', function(event) {
	console.log('\n' + String(event.target));
})
.on('complete', function() {
  console.log('\nFASTEST is ' + this.filter('fastest').pluck('name') + '\n');
})
// run async
.run({ 'async': false });