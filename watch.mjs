// watch.mjs - Script to watch for changes in TypeScript files and compile them
import { exec, spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { watch } from 'fs';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Compile a single TypeScript file
const compileFile = async (tsFilename) => {
  // Only process .ts files
  if (!tsFilename.endsWith('.ts')) return;
  
  const tsFile = path.join('cloud-ts', tsFilename);
  
  return new Promise((resolve, reject) => {
    console.log(`Compiling ${tsFile}...`);
    
    // Use the correct command to compile TypeScript
    const command = `npx tsc -p tsconfig.json`;
    
    console.log(`Running command: ${command}`);
    
    exec(command, (error, stdout, stderr) => {
      if (stdout) {
        console.log(stdout);
      }
      
      if (stderr) {
        console.error(`TypeScript compiler errors: ${stderr}`);
      }
      
      if (error) {
        console.error(`Error compiling ${tsFile}: ${error.message}`);
        return reject(error);
      }
      
      console.log(`Successfully compiled ${tsFilename}`);
      resolve();
    });
  });
};

// Watch for changes in the cloud-ts directory
const watchForChanges = () => {
  // Ensure cloud directory exists
  fs.mkdir('cloud', { recursive: true })
    .then(() => {
      console.log('Watching cloud-ts directory for changes...');
      
      // Watch the cloud-ts directory for changes
      watch('cloud-ts', { recursive: true }, async (eventType, filename) => {
        if (filename && filename.endsWith('.ts')) {
          console.log(`File ${filename} changed`);
          try {
            await compileFile(filename);
          } catch (err) {
            console.error(`Error compiling file ${filename}: ${err.message}`);
          }
        }
      });
    })
    .catch(err => {
      console.error(`Error setting up directory watch: ${err.message}`);
      process.exit(1);
    });
};

// Initial compilation of all TypeScript files
const initialCompilation = async () => {
  try {
    console.log('Performing initial compilation of all TypeScript files...');
    
    // Run tsc with the correct command
    const command = `npx tsc -p tsconfig.json`;
    
    console.log(`Running command: ${command}`);
    
    await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (stdout) {
          console.log(stdout);
        }
        
        if (stderr) {
          console.error(`TypeScript compiler errors: ${stderr}`);
        }
        
        if (error) {
          console.error(`Error during initial compilation: ${error.message}`);
          // Don't reject here, we'll continue even if there are errors
          console.log('Continuing despite compilation errors...');
          resolve();
          return;
        }
        
        resolve();
      });
    });
    
    console.log('Initial compilation completed');
  } catch (err) {
    console.error(`Error during initial compilation: ${err.message}`);
    console.log('Continuing despite compilation errors...');
    // Don't throw here, we'll continue even if there are errors
  }
};

// Check if TypeScript is installed and working
const checkTypeScript = async () => {
  try {
    console.log('Checking TypeScript installation...');
    
    await new Promise((resolve, reject) => {
      exec('npx tsc --version', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error checking TypeScript: ${error.message}`);
          return reject(error);
        }
        
        console.log(`TypeScript version: ${stdout.trim()}`);
        resolve();
      });
    });
    
    return true;
  } catch (err) {
    console.error(`TypeScript check failed: ${err.message}`);
    return false;
  }
};

// Main function
const main = async () => {
  try {
    // Check TypeScript
    const tsOk = await checkTypeScript();
    if (!tsOk) {
      console.error('TypeScript is not properly installed. Please run: npm install -g typescript');
      process.exit(1);
    }
    
    // Ensure cloud-ts directory exists
    await fs.mkdir('cloud-ts', { recursive: true });
    
    // Perform initial compilation
    await initialCompilation();
    
    // Watch for changes
    watchForChanges();
    
    console.log('Watch process started. Press Ctrl+C to stop.');
    console.log('Edit and save TypeScript files in cloud-ts directory to automatically compile them.');
  } catch (err) {
    console.error(`Watch process failed: ${err.message}`);
    process.exit(1);
  }
};

main(); 