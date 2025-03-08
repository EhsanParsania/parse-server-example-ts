"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import types for the FunctionRequest interface
require("../types");
// Define cloud functions
Parse.Cloud.define('hello', (req) => {
    req.log.info(req);
    return 'Hi';
});
Parse.Cloud.define('asyncFunction', async (req) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    req.log.info(req);
    return 'Hi async';
});
Parse.Cloud.define('helloWorld', async (request) => {
    const name = request.params.name || 'World';
    return `Hello, ${name}!`;
});
