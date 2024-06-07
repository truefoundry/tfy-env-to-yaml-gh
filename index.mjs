import * as fs from 'fs'
import dotenv from 'dotenv'
import yaml from 'js-yaml'
import core from '@actions/core'

function main() {
  const envPath = core.getInput('envPath');
  const outputFile = core.getInput('outputFile');
  const imageTag = core.getInput('imageTag');
  const subPath = core.getInput('subPath', { required: false });
  const { parsed } = dotenv.config({ path: envPath })
  const data = fs.readFileSync(outputFile)
  let yamlIn = yaml.load(data, 'utf8')
  if (subPath) {
    let currentObj = yamlIn;
    const subPathKeys = subPath.split('.');
    for (let i = 0; i < subPathKeys.length - 1; i++) {
      const key = subPathKeys[i];
      if (!currentObj[key]) {
        currentObj[key] = {};
      }
      currentObj = currentObj[key];
    }
    currentObj[subPathKeys[subPathKeys.length - 1]]['env'] = parsed;
    currentObj[subPathKeys[subPathKeys.length - 1]]['imageTag'] = imageTag;
  } else {
    yamlIn['env'] = parsed;
    yamlIn['imageTag'] = imageTag;
  }
  const yamlOut = yaml.dump(yamlIn);
  fs.writeFileSync(outputFile, yamlOut);
}
main()