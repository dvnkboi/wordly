"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("shared");
const express = require('express');
const app = express();
const port = 3002;
app.get('/', (_req, res) => {
    res.send('Hello World!' + (0, shared_1.map)(1, 0, 10, 0, 100));
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map