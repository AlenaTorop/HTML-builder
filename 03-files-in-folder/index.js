const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'secret-folder');

fs.promises.readdir(filePath, {withFileTypes: true})
  .then(files =>{
    files.forEach(file => {
        let pathF = path.join(filePath, file.name);
        let fileInfo = file.name.split('.');
        fs.stat(pathF, (err, stats)=>{
            if (err) throw err;
            if (stats.isFile()) {
                let size = (stats.size / 1024).toFixed(3)+'kb';
                fileInfo.push(size);
                let result = fileInfo.join(' - ');
                console.log(result);
            }
        });
    })
})
  .catch(err => {
    console.log(err);
})