const express = require('express');
const app = express();
const PORT = 8000 || process.env.PORT;

// setting up static path.
app.use(express.static('views'))

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(PORT, () => {
  console.log(`CHAT-APP is running at http://localhost:${PORT}`);
})