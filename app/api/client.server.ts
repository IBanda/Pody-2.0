import { Client } from 'podcast-api';

//passing null here allows us to use the test data from the service
export const client = Client({
  apiKey: String(process.env.API_KEY),
  // apiKey: null,
});
