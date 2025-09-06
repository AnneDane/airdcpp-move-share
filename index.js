/// UPDATE SETTINGS BELOW

// Cross-platform path handling
const path = require('path');
const os = require('os');

// Example configurations for different operating systems
// Uncomment and modify the one that matches your setup

// Linux/MacOS example:
// const searchPath = '/home/user/shares/MOVIE' // needs the entire path to your share, run this script one share at a time
// const searchRegex = /home\/user/;   // a pattern to search for in the path - it should be unique, don't search for words that may be contained somewhere within your share like `x264`
// const replaceString = "mnt\/data"  // what to replace that searched string with

// Windows example:
// const searchPath = 'C:\\Users\\user\\shares\\MOVIE' // needs the entire path to your share, run this script one share at a time
// const searchRegex = /C:\\Users\\user/;   // a pattern to search for in the path - it should be unique, don't search for words that may be contained somewhere within your share like `x264`
// const replaceString = "D:\\data"  // what to replace that searched string with

// Current configuration (update these for your system):
const searchPath = 'L:\\destination\\' // needs the entire path to your share, run this script one share at a time
const searchRegex = /T:\\origin\\/;   // a pattern to search for in the path - it should be unique, don't search for words that may be contained somewhere within your share like `x264`
const replaceString = "L:\\destination\\"  // what to replace that searched string with

// Cross-platform path validation
function validateConfiguration() {
  // Check if search path exists
  if (!fs.existsSync(searchPath)) {
    console.error(`ERROR: Search path does not exist: ${searchPath}`);
    console.error('Please update the searchPath variable with a valid directory path.');
    process.exit(1);
  }

  // Check if search path is a directory
  if (!fs.statSync(searchPath).isDirectory()) {
    console.error(`ERROR: Search path is not a directory: ${searchPath}`);
    console.error('Please update the searchPath variable with a valid directory path.');
    process.exit(1);
  }

  // Validate regex pattern (skip for already moved files)
  // For moved files, we construct the old path from the new path
  console.log('Note: Files are assumed to be already moved to the new location');

  console.log('✓ Configuration validation passed');
  console.log(`  Search path: ${searchPath}`);
  console.log(`  Search regex: ${searchRegex}`);
  console.log(`  Replace string: ${replaceString}`);
  console.log('');
}



/// DO NOT UPDATE ANYTHING BELOW


const settings = require('./settings');
const { fdir } = require("fdir");
const API = require("airdcpp-apisocket");
const w3cwebsocket = require("websocket").w3cwebsocket;
const cliProgress = require('cli-progress');

// get the Console class
const { Console } = require("console");
// get fs module for creating write streams
const fs = require("fs");

// make a new logger
const myLogger = new Console({
  stdout: fs.createWriteStream("output.log"),
  stderr: fs.createWriteStream("failed_requests.log"),
});

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// create a new progress bar instance and use shades_classic theme
const progressB = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);


(async () => {
  try {
    // Validate configuration before proceeding
    validateConfiguration();

    console.log('🔌 Connecting to AirDC++ API...');
    const socket = API.Socket(settings, w3cwebsocket);
    await socket.connect();
    console.log('✅ Connected to AirDC++ API\n');

    console.log('📁 Scanning directory for files...');
    // create the builder
    const api = new fdir().withFullPaths().crawl(searchPath);

    // get all files asynchronously
    api.withCallback(async (err, files) => {
      if (err) {
        console.error('❌ Error scanning directory:', err);
        myLogger.error(`Directory scan error: ${err.message}`);
        process.exit(1);
      }

      if (files.length === 0) {
        console.log('⚠️  No files found in the specified directory');
        process.exit(0);
      }

      console.log(`📋 Found ${files.length} files to process\n`);

      // start the progress bar with a total value of total files and start value of 0
      progressB.start(files.length, 0);

      let successCount = 0;
      let errorCount = 0;

      for (const file of files) {
        try {
          // For files already moved: construct old path by reversing the replacement
          const oldPath = file.replace(replaceString, 'T:\\origin\\');
          // Keep original path separators
          const apiOldPath = oldPath;
          const apiNewPath = file;

          await socket.post('hash/rename_path', {
            old_path: apiOldPath,
            new_path: apiNewPath
          });
          successCount++;
          progressB.increment();
        } catch (err) {
          errorCount++;
          myLogger.error(`${err.code} ${err.message} - File: ${file}`);
          progressB.increment(); // Still increment progress bar
        }
      }

      // Stop the progress bar
      progressB.stop();

      console.log('\n🎉 Processing complete!');
      console.log(`✅ Successful: ${successCount}`);
      console.log(`❌ Errors: ${errorCount}`);

      if (errorCount > 0) {
        console.log('\n📄 Check failed_requests.log for error details');
      }

      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    myLogger.error(`Fatal error: ${error.message}`);
    process.exit(1);
  }
})();
