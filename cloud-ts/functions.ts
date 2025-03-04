// Import types
import './types';

// Define cloud functions
Parse.Cloud.define('hello', (req: Parse.FunctionRequest) => {
  req.log.info(req);
  return 'Hi';
});

Parse.Cloud.define('asyncFunction', async (req: Parse.FunctionRequest) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  req.log.info(req);
  return 'Hi async';
});
