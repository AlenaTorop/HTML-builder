const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const createStream = fs.createWriteStream(filePath, 'utf-8');

const { stdout, stdin, exit } = process;

stdout.write('Привет, введите что-нибудь!\n');

stdin.on('data', data => {
    const dataString = data.toString();
    if (dataString.indexOf('exit') != -1) {
        goodBye();
    } else {
        createStream.write(data);
    }
});

process.on('SIGINT', goodBye);

function goodBye() {
  stdout.write('Удачного дня!');
  exit();
}