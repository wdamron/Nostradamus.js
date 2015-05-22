# Nostradamus.js

### -- is a [time-series](http://en.wikipedia.org/wiki/Time_series) [forecasting](http://en.wikipedia.org/wiki/Forecasting#Time_series_methods) tool for [Node.js](http://nodejs.org)

### -- uses [triple exponential smoothing](http://www.itl.nist.gov/div898/handbook/pmc/section4/pmc435.htm) via the [Holt-Winters](http://www.it.iitb.ac.in/~praj/acads/seminar/04329008_ExponentialSmoothing.pdf) approach

### -- works best with [seasonal](http://en.wikipedia.org/wiki/Seasonality) && [trending](http://en.wikipedia.org/wiki/Trend_analysis) data

### -- can be [quite](http://bakacsin.ki.iif.hu/~kissg/project/nfsen-hw/JRA2-meeting-at-Espoo_slides.pdf) [useful](http://www.hindawi.com/journals/jcnc/2012/192913/) in a machine context

### -- is not maintained

---

## Installation
`$ npm install nostradamus`


## Usage

**Option 1**

```js
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
// -> [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 594.8043646513713, 357.12171044215734, ...]
```

**Option 2**

```js
// faster w/ reuse of internal arrays
// if you know you'll be feeding it
// the same # of data, same params (alpha, beta, etc.),
// and you need to throw tons of data at it

var forecast = require('nostradamus')
  , data = [
      362, 385, 432, 341, 382, 409,
      498, 387, 473, 513, 582, 474,
      544, 582, 681, 557, 628, 707,
      773, 592, 627, 725, 854, 661
    ]
  , predictions = [];
  
forecast = forecast.memo({
  length: data.length,
  alpha: 0.5,  // overall smoothing component
  beta: 0.4,   // trend smoothing component
  gamma: 0.6,  // seasonal smoothing component
  period: 4,   // # of observations per season
  m: 4         // # of future observations to forecast
});

predictions = forecast(data);
// -> [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 594.8043646513713, 357.12171044215734, ...]

forecast([...]);
forecast([...]);
forecast([...]);
...
```

**Rules**

Some rules your parameters must abide by:
  - `alpha >= 0.0 && alpha <= 1.0`
  - `beta >= 0.0 && beta <= 1.0`
  - `gamma >= 0.0 && gamma <= 1.0`
  - `m > 0`
  - `m <= period`

### `module.exports` = `function(data, alpha, beta, gamma, period, m)`
- `data` {**Array**} series of input (numbers) from which a forecast should be made
- `alpha` {**Number**} overall Level component
- `beta` {**Number**} Trend component
- `gamma` {**Number**} Seasonal component
- `period` {**Number**} number of observations per 'season'
- `m` {**Number**} number of future observations to forecast
 
### `module.exports.memo` = `function(options)`
- `options` {**Object**} options to memoize if forecasts follow a fixed format
  - `length` {**Number**} length of each frame of input (i.e. data.length)
  - `alpha` {**Number**} overall Level component
  - `beta` {**Number**} Trend component
  - `gamma` {**Number**} Seasonal component
  - `period` {**Number**} number of observations per 'season'
  - `m` {**Number**} number of future observations to forecast
  
---

## Testing

In the main directory of this module: `$ npm test`


## Credit

This project would't exist, if not for the versions written in [Go](https://github.com/datastream/holtwinters/) and [Java](https://github.com/nchandra/ExponentialSmoothing). Thanks!


## License

MIT License

Copyright (c) 2012 - [thick](https://github.com/thick)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
