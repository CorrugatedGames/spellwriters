const Jimp = require('jimp');
const imagemin = require('imagemin');
const webp = require('imagemin-webp');

const fs = require('fs-extra');

const spriteSize = 64;
const spritesPerRow = 20;
const spritesheets = ['characters', 'spells'];

const compressImages = async () => {
  await imagemin([`./src/assets/spritesheets/*.png`], {
    destination: `./src/assets/spritesheets/`,
    plugins: [
      webp({
        lossless: true,
      }),
    ],
  });
};

const createSpritesheets = async () => {
  await Promise.all(
    spritesheets.map(async (spritegroup) => {
      const files = fs.readdirSync(`./data/sprites/${spritegroup}`);
      const height = Math.ceil(files.length / spritesPerRow);

      let curCol = 0;
      let curRow = 0;

      const allFileImages = await Promise.all(
        files
          .filter((x: string) => x.includes('.png'))
          .map((x: string) => {
            return Jimp.read(`./data/sprites/${spritegroup}/${x}`);
          }),
      );

      const spritesheet = new Jimp(
        spriteSize * spritesPerRow,
        spriteSize * height,
      );
      const finalImage = allFileImages.reduce((prev, cur) => {
        const newImg = prev.blit(cur, curCol * spriteSize, curRow * spriteSize);

        curCol++;
        if (curCol === spritesPerRow) {
          curCol = 0;
          curRow++;
        }

        return newImg;
      }, spritesheet);

      await finalImage
        .quality(100)
        .writeAsync(`./src/assets/spritesheets/${spritegroup}.png`);
    }),
  );
};

const generateSpritesheets = async () => {
  await createSpritesheets();
  await compressImages();
};

generateSpritesheets();
