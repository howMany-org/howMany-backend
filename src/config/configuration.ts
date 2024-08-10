import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join, resolve } from 'path';

// 절대 경로 사용
const YAML_CONFIG_FILENAME = 'default.yaml';
const configPath = resolve(__dirname, '../../config', YAML_CONFIG_FILENAME);

export default () => {
  return yaml.load(readFileSync(configPath, 'utf8')) as Record<string, any>;
};
