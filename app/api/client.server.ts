import { Client } from 'podcast-api';

//passing null here allows us to use the test data from the service
const apiKey =
  process.env.NODE_ENV === 'development'
    ? null
    : String(process.env.API_KEY);

export const client = Client({
  apiKey,
});
