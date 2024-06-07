import * as fs from 'fs';
import dotenv from 'dotenv';
import yaml from 'yaml';
import core from '@actions/core';

function main() {
  const envPath = core.getInput('envPath');
  const outputFile = core.getInput('outputFile');
  const imageTag = core.getInput('imageTag');
  const subPath = core.getInput('subPath', { required: false });

  const { parsed } = dotenv.config({ path: envPath });
  const data = fs.readFileSync(outputFile, 'utf8');
  const doc = yaml.parseDocument(data);
  
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
    currentObj.get(subPathKeys[subPathKeys.length - 1]).set('imageTag', imageTag);
  } else {
    doc.set('env', parsed);
    doc.set('imageTag', imageTag);
  }
  
  const yamlOut = doc.toString();
  fs.writeFileSync(outputFile, yamlOut);
}

main();
