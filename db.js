import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// connect to database
mongoose.connect(process.env.mongoDB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.log(`database connection error: ${err}`);
});
db.on('disconnected', () => {
  console.log('database disconnected');
});
db.once('open', () => {
  console.log(`database connected to ${db.name} on ${db.host}`);
});