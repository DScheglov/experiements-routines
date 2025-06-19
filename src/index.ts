import express from 'express';
import { postGreetings, postGreetings1 } from './postGreetings';

const app = express();

app.post('/greetings', postGreetings);
app.post('/greetings1', postGreetings1);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
