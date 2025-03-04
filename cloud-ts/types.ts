// Type definitions for Parse Server

// Export an empty object to make this a module
export {};

// Define the global Parse namespace
declare global {
  // Define the Parse variable as a global
  var Parse: {
    Cloud: {
      define(name: string, handler: (request: any) => any): void;
      define(name: string, handler: (request: any) => Promise<any>): void;
      beforeSave(className: string, handler: (request: any) => void | Promise<void>): void;
      afterSave(className: string, handler: (request: any) => void | Promise<void>): void;
      beforeDelete(className: string, handler: (request: any) => void | Promise<void>): void;
      afterDelete(className: string, handler: (request: any) => void | Promise<void>): void;
      beforeFind(className: string, handler: (request: any) => void | Promise<void>): void;
      afterFind(className: string, handler: (request: any) => void | Promise<void>): void;
    };
    Error: new (code: number, message: string) => Error;
    Object: {
      new (className: string): any;
    };
    User: {
      new (): any;
      current(): any;
    };
    Query: {
      new (className: string): any;
    };
  };

  // Define the Parse namespace for type references
  namespace Parse {
    interface FunctionRequest {
      params: { [key: string]: any };
      user?: any;
      log: {
        info: (...args: any[]) => void;
        error: (...args: any[]) => void;
        warn: (...args: any[]) => void;
      };
    }
  }
} 