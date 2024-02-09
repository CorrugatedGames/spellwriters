import fs from 'fs-extra';
import { ContentModImage } from '../src/app/interfaces';

const validate = async () => {
  const patterns = (await fs.readJson(
    './data/mod/content/images.json',
  )) as unknown as Record<string, ContentModImage>;

  const allIds: Record<string, boolean> = {};

  Object.values(patterns).forEach((imageData: unknown) => {
    const image = imageData as ContentModImage;

    if (!image.name) {
      throw new Error(`Image has no name`);
    }

    if (allIds[image.name]) {
      throw new Error(`Duplicate image name ${image.name}`);
    }

    allIds[image.name] = true;

    if (!image.spritesPerRow) {
      throw new Error(`Image ${image.name} has no spritesPerRow`);
    }

    if (!image.spriteSize) {
      throw new Error(`Image ${image.name} has no spriteSize`);
    }

    if (!image.framesPerAnimation) {
      throw new Error(`Image ${image.name} has no framesPerAnimation`);
    }
  });

  console.info('[Validation] All images are valid!');
};

validate();
