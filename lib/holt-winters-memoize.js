/* Holt-Winters triple exponential smoothing
 * see: http://www.itl.nist.gov/div898/handbook/pmc/section4/pmc435.htm
 *
 * @param {object} opt options to memoize;
 * -> @param {number} opt.alpha overall smoothing parameter (float)
 * -> @param {number} opt.beta seasonal smoothing parameter (float)
 * -> @param {number} opt.gamma trend smoothing parameter (float)
 * -> @param {number} opt.period # of observations per season(int)
 * -> @param {number} opt.m # of observations to forecast ahead (int)
 *
 * @return {function} forecast fn(data) returns array
 */
function memoize(opt) {


	// constants
	var len = opt.length,
		alpha = opt.alpha,
		beta = opt.beta,
		gamma = opt.gamma,
		period = opt.period,
		m = opt.m,
		seasons = Math.floor(len / period),

		// reuse these
		// note: savg[] and si[] zero-filled on every run
		// (via fn seasonalIndices)
		savg = Array(seasons), // seasonal averages
		obsavg = Array(len), // averaged observations
		si = Array(period), // seasonal indices

		// reuse these
		st = Array(len), // overall level smoothing component
		bt = Array(len), // trend smoothing component
		it = Array(len), // seasonal smoothing component
		ft = Array(len); // generated forecast

	if (!validArgs(len, alpha, beta, gamma, period, m))
		throw new Error('could not initialize');

	return function forecast(data) {
		// set initial trend st[1] = data[0] ...inlined below
		// (see: http://robjhyndman.com/researchtips/hw-initialization/)
		return calcHoltWinters(data, len, data[0], initialTrend(data, period),
			alpha, beta, gamma,
			seasonalIndices(data, period, seasons, savg, obsavg, si),
			period, m,
			st, bt, it, ft);
	};
}

module.exports = memoize;

function validArgs(len, alpha, beta, gamma, period, m) {
	if (!len)
		return false;
	if (m <= 0)
		return false;
	if (m > period)
		return false;
	if (alpha < 0.0 || alpha > 1.0)
		return false;
	if (beta < 0.0 || beta > 1.0)
		return false;
	if (gamma < 0.0 || gamma > 1.0)
		return false;
	return true;
}

function initialTrend(data, period) {
	var sum = 0;
	for (var i = 0; i < period; i++) {
		sum += (data[period + i] - data[i]);
	}
	return sum / (period * period);
}

function seasonalIndices(data, period, seasons, savg, obsavg, si) {
	var i, j;

	// zero-fill savg[] and si[] (reusable arrays)
	for (i = 0; i < seasons; i++) {
		savg[i] = 0.0;
	}
	for (i = 0; i < period; i++) {
		si[i] = 0.0;
	}

	// seasonal averages
	for (i = 0; i < seasons; i++) {
		for (j = 0; j < period; j++) {
			savg[i] += data[(i*period) + j];
		}
		savg[i] /= period;
	}
	// averaged observations
	for (i = 0; i < seasons; i++) {
		for (j = 0; j < period; j++) {
			obsavg[(i*period) + j] = data[(i*period) + j] / savg[i];
		}
	}
	// seasonal indices
	for (i = 0; i < period; i++) {
		for (j = 0; j < seasons; j++) {
			si[i] += obsavg[(j*period) + i];
		}
		si[i] /= seasons;
	}

	return si;
}

function calcHoltWinters(data, len, st_1, bt_1, alpha, beta, gamma, seasonal, period, m, st, bt, it, ft) {
	var i;

	// initial level st[1] == st_1 == data[0]
	st[1] = st_1;
	// initial trend bt[1] == bt_1 == initialTrend(data, period)
	bt[1] = bt_1;

	// zero-fill ft[] (to clean up undefined values at start of forecast array --i.e. ft[])
	for (i = 0; i < len; i++) {
		ft[i] = 0.0;
	}

	// initial seasonal indices it[]
	for (i = 0; i < period; i++) {
		it[i] = seasonal[i];
	}

	for (i = 2; i < len; i++) {
		// overall level smoothing component st[]
		if (i - period >= 0) {
			st[i] = ((alpha * data[i]) / it[i - period]) +
					((1.0 - alpha) * (st[i - 1] + bt[i - 1]));
		} else {
			st[i] = (alpha * data[i]) + ((1.0 - alpha) *
					(st[i - 1] + bt[i - 1]));
		}

		// trend smoothing component bt[]
		bt[i] = (gamma * (st[i] - st[i - 1])) +
				((1 - gamma) * bt[i - 1]);

		// seasonal smoothing component it[]
		if (i - period >= 0) {
			it[i] = ((beta * data[i]) / st[i]) +
					((1.0 - beta) * it[i - period]);
		}

		// generated forecast as ft[]
		if (i + m >= period) {
			ft[i + m] = (st[i] + (m * bt[i])) *
						it[i - period + m];
		}
	}

	// -> forecast[]
	return ft;
}
