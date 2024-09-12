###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM --platform=linux/amd64 node:18 AS development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM --platform=linux/amd64 node:18 AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

# Production dependencies 설치
RUN npm ci --only=production

COPY --chown=node:node . .

RUN npm run build

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# Prisma 클라이언트 생성
RUN mkdir -p /usr/src/app/dist/prisma && cp src/prisma/schema.prisma /usr/src/app/dist/prisma/schema.prisma
RUN npx prisma generate --schema=/usr/src/app/dist/prisma/schema.prisma

# Prisma 시드 스크립트 실행
# 'src/prisma/seed.ts' 대신 'dist/prisma/seed.js'를 사용해야 할 수 있습니다.
RUN npx ts-node src/prisma/seed.ts --schema=/usr/src/app/dist/prisma/schema.prisma

# Puppeteer-core 설치
RUN npm install puppeteer-core

USER node

EXPOSE 8080

###################
# PRODUCTION
###################

FROM --platform=linux/amd64 node:18

WORKDIR /usr/src/app

# .env 파일 복사
COPY .env /usr/src/app/dist/config/.env

# 환경 변수 설정 (Cloud Run에 배포할 때 환경 변수 설정도 필요)
ENV NODE_ENV production
COPY .env /usr/src/app/dist/config/.env

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Google Chrome 설치
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable

CMD [ "node", "dist/main.js" ]
