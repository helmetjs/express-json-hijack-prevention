JSON hijacking prevention for Express
=====================================

This middleware adds `res.safejson` to help prevent JSON hijacking. You can read about JSON hijacking attacks [here](http://stackoverflow.com/a/2669766) and [here](http://haacked.com/archive/2009/06/25/json-hijacking.aspx/).

First, install it:

```sh
npm install express-json-hijack-prevention
```

Next, `use` it in your Express application:

```javascript
var express = require('express');
var jsonHijackPrevention = require('express-json-hijack-prevention');

var app = express();

app.use(jsonHijackPrevention());

// Responds with this:
// while(1);{"numbers":[1,2,3]}
app.get('/response', function(req, res) {
  res.safejson({
    numbers: [1, 2, 3]
  });
});
```

When parsing these JSON responses, make sure to skip the prefix:

```javascript
var parsed = JSON.parse(serverResponse.substr(9));
```

If you want to change the prefix:

```javascript
app.use(jsonHijackPrevention({ prepend: "foo bar" }));
```
