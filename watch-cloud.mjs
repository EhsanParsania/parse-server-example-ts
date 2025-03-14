// watch-cloud.mjs - Simplified and efficient TypeScript file watcher and compiler
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chokidar from 'chokidar';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to compile a single TypeScript file directly using transpileModule
const compileSingleFile = async (filePath) => {
  try {
    console.log(`Compiling file: ${filePath}`);

    const relativePath = path.relative(path.join(__dirname, 'cloud-ts'), filePath);
    const outputPath = path.join(__dirname, 'cloud', relativePath.replace(/\.ts$/, '.js'));

    const tsContent = await fs.readFile(filePath, 'utf8');

    // Read and parse tsconfig.json
    const tsConfigPath = path.join(__dirname, 'tsconfig.json');
    const tsConfigFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
    const parsedConfig = ts.parseJsonConfigFileContent(tsConfigFile.config, ts.sys, path.dirname(tsConfigPath));

    // Transpile the TypeScript content
    const result = ts.transpileModule(tsContent, { compilerOptions: parsedConfig.options, fileName: filePath });

    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Write the transpiled JavaScript
    await fs.writeFile(outputPath, result.outputText);

    console.log(`Successfully compiled file: ${filePath}`);
  } catch (err) {
    console.error(`Error compiling file ${filePath}: ${err.message}`);
    throw err;
  }
};

// Full compilation for initial build or fallback
const compileAll = async () => {
  return new Promise((resolve, reject) => {
    console.log('Compiling all TypeScript files...');
    exec(`npx tsc --project tsconfig.json --incremental`, (error, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(`TypeScript compiler errors: ${stderr}`);
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
const handleDeletion = async (filePath) => {
  if (!filePath.endsWith('.ts')) return;
  const relativePath = path.relative(path.join(__dirname, 'cloud-ts'), filePath);
  const jsFilePath = path.join(__dirname, 'cloud', relativePath.replace('.ts', '.js'));

  try {
    await fs.unlink(jsFilePath);
    console.log(`Deleted JavaScript file: ${jsFilePath}`);
  } catch (err) {
    console.log(`No JavaScript file found to delete for ${relativePath}`);
  }
};

// Watch for changes
const watchForChanges = () => {
  chokidar.watch('cloud-ts', { ignored: /(^|[\/\\])\../, persistent: true, ignoreInitial: true })
    .on('add', compileSingleFile)
    .on('change', compileSingleFile)
    .on('unlink', handleDeletion)
    .on('error', error => console.error(`Watcher error: ${error}`));

  console.log('Watcher initialized. Monitoring cloud-ts directory for changes...');
};

// Main function
const main = async () => {
  await fs.mkdir('cloud-ts', { recursive: true });
  await compileAll();
  watchForChanges();
  console.log('Cloud-TS watch process started. Press Ctrl+C to stop.');
};

main().catch(err => {
  console.error(`Watch process failed: ${err.message}`);
  process.exit(1);
}); 