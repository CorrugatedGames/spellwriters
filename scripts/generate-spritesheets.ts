import fs from 'fs-extra';
import imagemin from 'imagemin';
import webp from 'imagemin-webp';
import Jimp from 'jimp';

const spriteSize = 64;
const spritesPerRow = 20;
const spritesheets = ['characters', 'spells', 'relics'];

const compressImages = async () => {
  await imagemin([`./data/mod/spritesheets/*.png`], {
    destination: `./data/mod/spritesheets/`,
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
        .writeAsync(`./data/mod/spritesheets/${spritegroup}.png`);

      console.log(`[Build] Built ${spritegroup}!`);
    }),
  );
};

const generateSpritesheets = async () => {
  console.log('[Build] Building spritesheets...');
  await createSpritesheets();

  console.log('[Build] Spritesheets built!');
  await compressImages();

  console.log('[Build] Spritesheets compressed!');
};

generateSpritesheets();
