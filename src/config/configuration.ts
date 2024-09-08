import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { resolve } from 'path';

// 환경 변수에서 현재 환경을 가져옵니다. 기본값은 'development'입니다.
const ENV = process.env.NODE_ENV || 'develop';

// 설정 파일 경로를 정의합니다.
const DEFAULT_CONFIG_PATH = resolve(__dirname, '../config', 'default.yaml');
const PRODUCTION_CONFIG_PATH = resolve(
  __dirname,
  '../config',
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
