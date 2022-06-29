import * as fs from 'fs'
import dotenv from 'dotenv'
import yaml from 'js-yaml'
import core from '@actions/core'

function main() {
  const envPath = core.getInput('envPath');
  const outputFile = core.getInput('outputFile');
  const imageTag = core.getInput('imageTag');
  const { parsed } = dotenv.config({ path: envPath })
  const data = fs.readFileSync(outputFile)
  let yamlIn = yaml.load(data, 'utf8')
  yamlIn['env'] = parsed
  yamlIn['imageTag'] = imageTag
  const yamlOut = yaml.dump(yamlIn);
  fs.writeFileSync(outputFile, yamlOut);
}
main()