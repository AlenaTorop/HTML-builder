const fs = require('fs');
const path = require('path');

const newDir = path.join(__dirname, 'project-dist');

fs.promises.mkdir(newDir, { recursive: true });

async function buildHTML() {
  const components = path.join(__dirname, 'components');
   await fs.promises.readdir(components, { withFileTypes: true })
                    .then((files) => {
                      const readStream = fs.createReadStream(path.join(__dirname, 'template.html'));
                      let data = '';
                      readStream.on('data', async (chunk) => {
                        data += chunk;
                        for(let file of files) {
                          if (file.isFile() && path.extname(file.name) === '.html') {
                            const readUnit = await fs.promises.readFile(path.join(components, file.name));
                            const tag = path.basename(file.name, '.html');
                            data = data.replace(`{{${tag}}}`, readUnit);
                          }
                        }
                        // const indexPath = path.join(newDir, 'index.html');
                        fs.writeFile(path.join(newDir, 'index.html'), data, (err) => {
                          if (err) throw err;
                        })
                      })
                    })
                    .catch( err => {
                      console.log(err);
                    })
}

async function concatStyle() {
  const filePath = path.join(__dirname, 'styles');
  const styleFile = fs.createWriteStream(path.join(newDir, 'style.css'));

   await fs.promises.readdir(filePath, { withFileTypes: true })
                    .then(files =>{
                      files.forEach(file => {
                        const readStream = fs.createReadStream(path.join(filePath, file.name));
                        if (file.isFile() && path.extname(file.name) === '.css'){
                          readStream.on('data', (chunk) => {
                            styleFile.write(chunk);
                          })
                        }
                      })
                    })
                      // console.log('Сongratulations!')
                    .catch( err => {
                        console.log(err)
                    })
}


const assets = path.join(__dirname, 'assets');
const copyAssets = path.join(newDir, 'assets');

async function copyDirectory(base, copyBase) {
  await fs.promises.mkdir(copyBase, { recursive: true });
  const files = await fs.promises.readdir(base, { withFileTypes: true });
  files.forEach(file => {
    const baseUnit = path.join(base, file.name);
    const copyUnit = path.join(copyBase, file.name);
    // fs.unlink(path.join(copyBase, file.name), err => {
    //   if (err) throw err;
    // });
    if (file.isFile()) {
      fs.copyFile(baseUnit, copyUnit, err => {
        if (err) throw err;
        })
      } else {
        copyDirectory(baseUnit, copyUnit);
    }
  })
}


try {
  buildHTML();
  concatStyle();
  copyDirectory(assets, copyAssets);
  // console.log('Сongratulations!')
} catch (err) {
  console.log(err);
}



