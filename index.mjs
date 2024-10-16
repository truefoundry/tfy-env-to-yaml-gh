import * as fs from 'fs';
import dotenv from 'dotenv';
import yaml from 'yaml';
import core from '@actions/core';

function main() {
  const envPath = core.getInput('envPath');
  const outputFile = core.getInput('outputFile');
  const imageTag = core.getInput('imageTag');
  const subPath = core.getInput('subPath', { required: false });

  console.log('envPath', envPath);
  const { parsed } = dotenv.config({ path: envPath });
  console.log('parsed', parsed);
  const data = fs.readFileSync(outputFile, 'utf8');
  console.log('data', data);
  const doc = yaml.parseDocument(data);
  console.log('doc', doc);
  
  if (subPath) {
    let currentObj = doc;
    const subPathKeys = subPath.split('.');
    for (let i = 0; i < subPathKeys.length - 1; i++) {
      const key = subPathKeys[i];
      if (!currentObj.get(key)) {
        currentObj.set(key, {});
      }
      currentObj = currentObj.get(key);
    }
    currentObj.get(subPathKeys[subPathKeys.length - 1]).set('env', parsed);
    currentObj.get(subPathKeys[subPathKeys.length - 1]).get('image').set('tag', imageTag);
  } else {
    doc.set('env', parsed);
    doc.get('image').set('tag', imageTag);
  }
  
  const yamlOut = doc.toString({
    lineWidth: 0,
    minContentWidth: 0,
  });
  fs.writeFileSync(outputFile, yamlOut);
}

main();
