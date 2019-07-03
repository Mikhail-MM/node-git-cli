const fs = require('fs');
const path = require('path');

module.exports = {
    getCurrentDirectoryBase: () => {
        // Return last portion of current working directory
        return path.basename(process.cwd())
    },
    directoryExists: (filepath) => {
        // fs.stat/fs.statSync returns an error if there is no file
        try {
            return fs.statSync(filepath).isDirectory();
        } catch (err) {
            return false;
        }
    }
};