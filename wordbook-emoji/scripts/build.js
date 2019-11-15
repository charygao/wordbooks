const fs = require('fs');
const YAML = require('yamljs');


const cwd = `${process.cwd()}`;

const db = JSON.parse(
  fs.readFileSync(`${cwd}/source/emoji.json`).toString()
);

const chapters = [];

for (let i = 0; i < db.length; i++) {
  const item = db[i];

  let chapter = chapters.find((v) => v.title === item.category);
  if (!chapter) {
    chapter = {
      slug: `chapter${chapters.length + 1}`,
      title: item.category,
      words: [],
    };

    chapters.push(chapter);
  }

  if (item.aliases.length === 1 && item.aliases[0].indexOf('_') === -1) {
    const word = item.aliases[0].replace(/_/g, ' ');
    if (/\d/.test(word) || word.length <= 2) {
      continue;
    }

    const wordItem = {
      word,
      remark: `${item.emoji} ${item.description}` ,
    };

    chapter.words.push(wordItem);
  }
}

for (let i = 0; i < chapters.length; i++) {
  const chapter = chapters[i];

  fs.writeFileSync(`${cwd}/chapters/${chapter.slug}.yaml`, YAML.stringify(chapter, 8, 2));
}
