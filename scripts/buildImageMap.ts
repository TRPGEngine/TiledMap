import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const publicDir = path.resolve(__dirname, '../public');

// const token = fs.readdirSync(path.resolve(__dirname, '../public/image/token'));

function buildFileMap(dir: string) {
  // const files = fs.readdirSync(path.resolve(__dirname, '../public/image/tiles'));
  const files = fs.readdirSync(dir);

  return _.fromPairs(
    files.map((fileName) => [
      path.basename(fileName, path.extname(fileName)),
      path.join(dir, fileName).replace(publicDir, ''),
    ]),
  );
}

const imageMap = {
  tiles: buildFileMap(path.resolve(__dirname, '../public/image/tiles')),
  token: buildFileMap(path.resolve(__dirname, '../public/image/token')),
};

const targetPath = path.resolve(__dirname, '../src/image-map.json');
fs.writeFileSync(targetPath, JSON.stringify(imageMap));
console.log('image map generated!', targetPath);
