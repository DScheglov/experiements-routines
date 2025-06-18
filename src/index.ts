import express from 'express';
import { postGreetings } from './postGreetings';

const app = express();

app.post('/greetings', postGreetings);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
