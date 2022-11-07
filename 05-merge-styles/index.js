const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'styles');
const bundleFile = fs.createWriteStream(path.join(__dirname, 'project-dist/bundle.css'));

fs.promises.readdir(filePath, { withFileTypes: true })
    .then(files =>{
        files.forEach(file => {
          const readStream = fs.createReadStream(path.join(filePath, file.name));
          if (file.isFile() && path.extname(file.name) === '.css'){
            readStream.on('data', (chunk) => {
              bundleFile.write(chunk);
            })
          }
        })
    })
    .catch(err=>{
        console.log(err)
    })
