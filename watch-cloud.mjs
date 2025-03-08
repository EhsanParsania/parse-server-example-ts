// watch-cloud.mjs - Script to watch for changes in cloud-ts TypeScript files and compile them
import { exec } from 'child_process';
import fs from 'fs/promises';
import { watch } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Compile all TypeScript files
const compileAll = async () => {
  return new Promise((resolve, reject) => {
    console.log('Compiling all TypeScript files...');
    const command = `npx tsc -p tsconfig.json`;
    
    exec(command, (error, stdout, stderr) => {
      if (stdout) {
        console.log(stdout);
      }
      
      if (stderr) {
        console.error(`TypeScript compiler errors: ${stderr}`);
      }
      
      if (error) {
        console.error(`Error compiling: ${error.message}`);
        return reject(error);
      }
      
      console.log('Successfully compiled all TypeScript files');
      resolve();
    });
  });
};

// Handle file deletion
const handleDeletion = async (filename) => {
  if (!filename.endsWith('.ts')) return;
  
  // Get corresponding JS file path
  const relativePath = filename;
  const jsFilePath = path.join('cloud', relativePath.replace('.ts', '.js'));
  
  try {
    // Check if the JavaScript file exists
    await fs.access(jsFilePath);
    
    // Delete the JavaScript file if it exists
    await fs.unlink(jsFilePath);
    console.log(`Deleted corresponding JavaScript file: ${jsFilePath}`);
    
    // Handle .d.ts and .js.map files if they exist
    const dtsFilePath = path.join('cloud', relativePath.replace('.ts', '.d.ts'));
    const mapFilePath = path.join('cloud', relativePath.replace('.ts', '.js.map'));
    
    try {
      await fs.access(dtsFilePath);
      await fs.unlink(dtsFilePath);
      console.log(`Deleted declaration file: ${dtsFilePath}`);
    } catch (err) {
      // File doesn't exist, ignore
    }
    
    try {
      await fs.access(mapFilePath);
      await fs.unlink(mapFilePath);
      console.log(`Deleted source map file: ${mapFilePath}`);
    } catch (err) {
      // File doesn't exist, ignore
    }
  } catch (err) {
    // File doesn't exist or other error
    console.log(`Note: No JavaScript file found to delete for ${filename}`);
  }
};

// Watch for changes in the cloud-ts directory
const watchForChanges = () => {
  // Ensure cloud directory exists
  fs.mkdir('cloud', { recursive: true })
    .then(() => {
      console.log('Watching cloud-ts directory for changes and deletions...');
      
      // Track existing files in the cloud-ts directory
      let knownFiles = new Set();
      
      // Function to scan and update the list of known files
      const updateKnownFiles = async () => {
        try {
          const files = await fs.readdir('cloud-ts', { recursive: true });
          const newKnownFiles = new Set();
          
          for (const file of files) {
            if (file.endsWith('.ts')) {
              newKnownFiles.add(file);
            }
          }
          
          // Check for deletions
          for (const file of knownFiles) {
            if (!newKnownFiles.has(file)) {
              console.log(`Detected deletion of: ${file}`);
              await handleDeletion(file);
            }
          }
          
          knownFiles = newKnownFiles;
        } catch (err) {
          console.error(`Error updating known files: ${err.message}`);
        }
      };
      
      // Initial scan
      updateKnownFiles();
      
      // Watch the cloud-ts directory for changes
      watch('cloud-ts', { recursive: true }, async (eventType, filename) => {
        if (!filename) return;
        
        console.log(`File event: ${eventType} - ${filename}`);
        
        // Scan for changes including deletions
        await updateKnownFiles();
        
        // Always recompile on any change
        try {
          await compileAll();
        } catch (err) {
          console.error(`Error compiling files: ${err.message}`);
        }
      });
      
      // Periodically check for deleted files (as a backup)
      setInterval(updateKnownFiles, 5000);
    })
    .catch(err => {
      console.error(`Error setting up directory watch: ${err.message}`);
      process.exit(1);
    });
};

// Main function
const main = async () => {
  try {
    // Ensure cloud-ts directory exists
    await fs.mkdir('cloud-ts', { recursive: true });
    
    // Perform initial compilation
    await compileAll();
    
    // Watch for changes
    watchForChanges();
    
    console.log('Cloud-TS watch process started. Press Ctrl+C to stop.');
    console.log('Edit, save, or delete TypeScript files in cloud-ts directory to automatically sync them.');
  } catch (err) {
    console.error(`Watch process failed: ${err.message}`);
    process.exit(1);
  }
};

main(); 