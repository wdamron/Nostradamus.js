# Nostradamus.js

---

### -- is a [time-series](http://en.wikipedia.org/wiki/Time_series) [forecasting](http://en.wikipedia.org/wiki/Forecasting#Time_series_methods) tool for [Node.js](http://nodejs.org)

### -- uses [triple exponential smoothing](http://www.itl.nist.gov/div898/handbook/pmc/section4/pmc435.htm) via the [Holt-Winters](http://www.it.iitb.ac.in/~praj/acads/seminar/04329008_ExponentialSmoothing.pdf) approach

### -- works best with [seasonal](http://en.wikipedia.org/wiki/Seasonality) && [trending](http://en.wikipedia.org/wiki/Trend_analysis) data

### -- can be [quite](http://bakacsin.ki.iif.hu/~kissg/project/nfsen-hw/JRA2-meeting-at-Espoo_slides.pdf) [useful](http://www.hindawi.com/journals/jcnc/2012/192913/) in a machine context


---

`$ npm install nostradamus`

---

Option 1:

	// plain-vanilla
	var forecast = require('nostradamus')
	  , data = [
	  	  362, 385, 432, 341, 382, 409,
		  498, 387, 473, 513, 582, 474,
		  544, 582, 681, 557, 628, 707,
		  773, 592, 627, 725, 854, 661
	    ]
	  , alpha = 0.5  // overall smoothing component
	  , beta = 0.4   // trend smoothing component
	  , gamma = 0.6  // seasonal smoothing component
	  , period = 4   // # of observations per season
	  , m = 4        // # of future observations to forecast
	  , predictions = [];
	
	predictions = forecast(data, alpha, beta, gamma, period, m);
	// -> [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 594.8043646513713, 357.12171044215734, …]
	
---

Option 2:

	// faster w/ reuse of internal arrays
	// if you know you'll be feeding it
	// the same # of data, same params (alpha, beta, etc.),
	// and you need to throw tons of data at it
	
	var setupForecast = require('nostradamus').memo  // note the (dot)memo
	  , forecast
	  , data = [
	  	  362, 385, 432, 341, 382, 409,
		  498, 387, 473, 513, 582, 474,
		  544, 582, 681, 557, 628, 707,
		  773, 592, 627, 725, 854, 661
	    ]
	  , predictions = [];
	  
	forecast = setupForecast({
	  length: data.length,
	  alpha: 0.5,  // overall smoothing component
	  beta: 0.4,   // trend smoothing component
	  gamma: 0.6,  // seasonal smoothing component
	  period: 4,   // # of observations per season
	  m: 4         // # of future observations to forecase
	});
	
	predictions = forecast(data);
	// -> [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 594.8043646513713, 357.12171044215734, …]
	
	forecast([…]);
	forecast([…]);
	forecast([…]);
	…
	
---

Some rules your parameters must abide by:
  - `alpha >= 0.0 && alpha >= 1.0`
  - `beta >= 0.0 && beta <= 1.0`
  - `gamma >= 0.0 && gamma <= 1.0`
  - `m > 0`
  - `m <= period`
  
---

This project would't exist, if not for the versions written in [Go](https://github.com/datastream/holtwinters/) and [Java](https://github.com/nchandra/ExponentialSmoothing). Thanks!