import { map } from 'shared';
const express = require('express')
const app = express()
const port = 3002

app.get('/', (_req: any, res: { send: (arg0: string) => void }) => {
  res.send('Hello World!' + map(1, 0, 10, 0, 100));
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
