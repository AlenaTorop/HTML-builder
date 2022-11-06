const fs = require('fs');
const path = require('path');

const baseDirectory = path.join(__dirname, 'files');
const newDirectory = path.join(__dirname, 'files-copy');

fs.promises.mkdir(newDirectory, { recursive: true });

async function copyDirectory() {
  const baseDir = await fs.promises.readdir( baseDirectory, { withFileTypes: true });
  const copyDir = await fs.promises.readdir(newDirectory, { withFileTypes: true });

    for (file of copyDir) {
      fs.unlink(path.join(newDirectory, file.name), err => {
        if (err) throw err;
      });
    }

    for (file of baseDir) {
      fs.copyFile(
        path.join(baseDirectory, file.name),
        path.join(newDirectory, file.name),
        err => {
          if (err) throw err;
        });
  }
  console.log('Directory copied successfully!')
}

try {
  copyDirectory();
} catch (err) {
  console.log(err);
}