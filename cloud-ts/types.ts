// Import Parse types from the @types/parse package
import 'parse';

// Export an empty object to make this a module
export {};

// Define the FunctionRequest interface that's not included in @types/parse
declare global {
  namespace Parse {
    interface FunctionRequest {
      params: { [key: string]: any };
      user?: Parse.User;
      log: {
        info: (...args: any[]) => void;
        error: (...args: any[]) => void;
        warn: (...args: any[]) => void;
      };
    }
  }
} 