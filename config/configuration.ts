import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { resolve } from 'path';

// 환경 변수에서 현재 환경을 가져옵니다. 기본값은 'development'입니다.
const ENV = process.env.NODE_ENV || 'development';

// // 빌드된 파일의 경로를 기준으로 설정 파일 경로를 정의합니다.
// const CONFIG_DIR = resolve(__dirname, '../../src/config');
// const DEFAULT_CONFIG_PATH = resolve(CONFIG_DIR, 'default.yaml');
// const PRODUCTION_CONFIG_PATH = resolve(CONFIG_DIR, 'production.yaml');

// 설정 파일 경로를 정의합니다.
const DEFAULT_CONFIG_PATH = resolve(__dirname, '../../config', 'default.yaml');
const PRODUCTION_CONFIG_PATH = resolve(
  __dirname,
  '../../config',
  'production.yaml',
);
console.log('Default Config Path:', DEFAULT_CONFIG_PATH);
console.log('Production Config Path:', PRODUCTION_CONFIG_PATH);

// 기본 설정 파일 로드
const defaultConfig = yaml.load(
  readFileSync(DEFAULT_CONFIG_PATH, 'utf8'),
) as Record<string, any>;

// 운영 환경 설정 파일 로드
const productionConfig = yaml.load(
  readFileSync(PRODUCTION_CONFIG_PATH, 'utf8'),
) as Record<string, any>;

// 설정 병합
export default () => {
  return {
    ...defaultConfig,
    ...productionConfig,
  };
};
// // 설정 파일 이름을 결정합니다.
// const YAML_CONFIG_FILENAME =
//   ENV === 'production' ? 'production.yaml' : 'default.yaml';

// // 절대 경로 사용
// const configPath = resolve(__dirname, '../../config', YAML_CONFIG_FILENAME);

// export default () => {
//   return yaml.load(readFileSync(configPath, 'utf8')) as Record<string, any>;
// };
