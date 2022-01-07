"use strict";
const express = require('express');
const app = express();
const port = 3002;
app.get('/', (_req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map