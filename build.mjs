// build.mjs - Script to compile TypeScript files and move them to the cloud directory
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

// Execute the TypeScript compiler
const runTsc = () => {
  return new Promise((resolve, reject) => {
    exec('npx tsc', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running tsc: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`TypeScript compiler errors: ${stderr}`);
      }
      if (stdout) {
        console.log(stdout);
      }
      console.log('TypeScript compilation completed');
      resolve();
    });
  });
};

// Copy compiled JS files from cloud-ts to cloud directory
const copyCompiledFiles = async () => {
  try {
    // Ensure cloud directory exists
    await fs.mkdir('cloud', { recursive: true });
    
    // Read all files in cloud-ts directory
    const files = await fs.readdir('cloud-ts');
    
    for (const file of files) {
      // Only copy .js files (compiled from .ts)
      if (file.endsWith('.js')) {
        const sourceFile = path.join('cloud-ts', file);
        const destFile = path.join('cloud', file);
        
        // Copy the file
        await fs.copyFile(sourceFile, destFile);
        console.log(`Copied ${sourceFile} to ${destFile}`);
      }
    }
    
    console.log('All compiled files copied to cloud directory');
  } catch (err) {
    console.error(`Error copying files: ${err.message}`);
    throw err;
  }
};

// Clean up the .js files in cloud-ts directory
const cleanupCompiledFiles = async () => {
  try {
    const files = await fs.readdir('cloud-ts');
    
    for (const file of files) {
      if (file.endsWith('.js') || file.endsWith('.js.map')) {
        const filePath = path.join('cloud-ts', file);
        await fs.unlink(filePath);
        console.log(`Removed ${filePath}`);
      }
    }
    
    console.log('Cleanup completed');
  } catch (err) {
    console.error(`Error during cleanup: ${err.message}`);
    throw err;
  }
};

// Main function
const main = async () => {
  try {
    // Compile TypeScript
    await runTsc();
    
    // Copy compiled files to cloud directory
    await copyCompiledFiles();
    
    // Clean up intermediate .js files
    await cleanupCompiledFiles();
    
    console.log('Build process completed successfully');
  } catch (err) {
    console.error(`Build process failed: ${err.message}`);
    process.exit(1);
  }
};

main(); 