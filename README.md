# HIGHLY EXPERIMENTAL SCRIPT

**⚠️ WARNING: This project has been modified by AI (xAI-Grok)**

This script may work, or it may not. It may break stuff, so backup your entire airdcpp and all its share information. Find out how to do that if you don't know.

## Recent Modifications

- Fixed API call bug (swapped old_path and new_path parameters)
- Added support for already-moved files
- Improved Windows path handling
- Enhanced error handling and logging

## Requirements
* Linux, MacOS or Windows
* NodeJS >= 10
* npm (Should come with NodeJS on most OS)

## ⚠️ Windows Compatibility

**This script now supports Windows!** The main differences for Windows users:

- Use backslashes (`\`) in paths instead of forward slashes (`/`)
- Use Windows drive letters (e.g., `C:\`, `D:\`) instead of Unix paths
- Update regex patterns to match Windows path formats
- The script includes automatic path validation for Windows
- Paths are automatically normalized to forward slashes for API compatibility

## Install NodeJS and npm

### Linux

**Debian/Ubuntu** packages provided by NodeSource - https://github.com/nodesource/distributions/blob/master/README.md#debinstall

**CentOS/Fedora** packages provided by NodeSource - https://github.com/nodesource/distributions/blob/master/README.md#rpminstall

**ArchLinux**: https://nodejs.org/en/download/package-manager/#arch-linux

### MacOS
https://nodejs.org/en/download/package-manager/#macos

### Windows
https://nodejs.org/en/#home-downloadhead

Also available through Chocolatey or Scoop
https://nodejs.org/en/download/package-manager/#alternatives-1

## Install dependencies

From within this folder on CLI run `npm install`

## Setup config

Copy the the settings.js.example to settings.js and update it with your AirDC API information

### Windows Configuration

For Windows users, you also need to update the path configuration in `index.js`:

**Important Windows notes:**
- Use double backslashes (`\\`) in strings, or single backslashes in regex
- Make sure the search regex matches your actual path structure
- Test with a small directory first to verify the configuration

### Example: Moving files from T:\origin\ to L:\destination\

If you have already moved files from `T:\origin\` to `L:\destination\`, update the configuration in `index.js`:

```javascript
const searchPath = 'L:\\destination\\';  // Where files are now located
const searchRegex = /T:\\origin\\/;      // Original path pattern
const replaceString = "L:\\destination\\"; // Current path
```

This will update the AirDC++ database to reflect the move without rehashing.

## Run script

The script does not have any parameters, the configuration is done inside the index.js directly, make sure to update it.

It needs to be run for each of your shares seperately, so try start with a small one and see if you can get it to work.

**AGAIN - CREATE BACKUPS OF ALL AIRDC CONFIGS/ SHARE INFORMATON**

It's easy to mess something up here when renaming and you will need to restore your configs to start over.

## Start script

`node index.js`
