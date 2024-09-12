import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { resolve } from 'path';

// YAML 파일에서 설정 불러오기
const ENV = process.env.NODE_ENV || 'development';
const configFilePath = resolve(__dirname, `../config/${ENV}.yaml`);
const config = yaml.load(readFileSync(configFilePath, 'utf8')) as Record<
  string,
  any
>;

// 환경 변수로 설정
process.env.DATABASE_URL = config.db.url;

// 환경 변수에 따라 설정 파일 선택
const configFile =
  ENV === 'production' ? 'production.yaml' : 'development.yaml';

// 설정 파일 경로를 정의합니다.
const CONFIG_PATH = resolve(__dirname, '../config', configFile);
console.log('Config Path:', CONFIG_PATH);

// 설정 반환
export default () => {
  return config;
};
