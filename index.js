import express from 'express';
import route from './src/routes'
import cookieParser from 'cookie-parser';
import 'dotenv/config'

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

route(app);

const port = 8000;

app.listen(port, () => {
  console.log('App is now running at port ', port)
})