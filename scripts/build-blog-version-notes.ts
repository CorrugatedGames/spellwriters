import fs from 'fs-extra';

const date = new Date();
const year = date.getFullYear();
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const day = date.getDate().toString().padStart(2, '0');

const hours = date.getHours().toString().padStart(2, '0');
const minutes = date.getMinutes().toString().padStart(2, '0');
const seconds = date.getSeconds().toString().padStart(2, '0');

const header = `---
title: Version Updates
date: ${year}-${month}-${day} ${hours}:${minutes}:${seconds}
categories: [New Version]
tags: [spellwriters, version-notes]
---
`;

const changelog = fs.readFileSync('./CHANGELOG-current.md', 'utf8');

const content = `${header}

${changelog}

[Download the latest update on itch.io](https://seiyria.itch.io/spellwriters) or [play online](https://play.spellwritersgame.com).
`;

const filename = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}-version-update.md`;
fs.writeFileSync(`./${filename}`, content);

fs.writeFileSync('blog-post.txt', filename);
