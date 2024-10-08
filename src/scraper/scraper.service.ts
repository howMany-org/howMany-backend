import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import {
  BroadcastsDto,
  MostPlayedDto,
  TopSellerDto,
} from 'src/static/dto/static.dto';

const puppeteer = require('puppeteer');

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private readonly maxRetries = 3; // 최대 재시도 횟수
  private readonly retryDelay = 5000; // 재시도 전 대기 시간 (5초)
  private readonly args = [
    '--disable-dbus',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--remote-debugging-port=9222',
    '--mute-audio', // 오디오 음소거
    '--disable-infobars',
    '--disable-gpu',
    '--disable-software-rasterizer',
    '--disable-extensions',
    '--disable-web-security',
    '--log-level=3', // 로그 레벨 조정 (0: DEBUG, 1: INFO, 2: WARNING, 3: ERROR)
  ];

  constructor(private readonly cacheService: CacheService) {}

  // 서버 시작 시 초기 스크래핑 작업
  async onModuleInit() {
    this.logger.debug('Running initial scraping tasks');
    try {
      await this.scrapMostPlayedCharts();
      await this.scrapTopSellerCharts('KR');
      await this.scrapTopSellerCharts('US');
      await this.scrapTopSellerCharts('JP');
      await this.scrapTopSellerCharts('CN');
      await this.scrapTopSellerCharts('global');
      await this.scrapBroadcasts();
      this.logger.debug('Initial scraping tasks completed');
    } catch (error) {
      this.logger.error('Error during initial scraping tasks', error);
    }
  }

  // 재시도 로직 추가
  private async scrapWithRetry(
    scrapFunction: () => Promise<any>,
    retryCount = 0,
  ): Promise<any> {
    try {
      return await scrapFunction();
    } catch (error) {
      this.logger.error(
        `Scraping failed on attempt ${retryCount + 1}: ${error.message}`,
      );
      if (retryCount < this.maxRetries) {
        this.logger.warn(`Retrying... (${retryCount + 1}/${this.maxRetries})`);
        await this.delay(this.retryDelay); // 대기 후 재시도
        return this.scrapWithRetry(scrapFunction, retryCount + 1);
      } else {
        throw new Error(`Scraping failed after ${this.maxRetries} attempts`);
      }
    }
  }

  // 대기 시간 함수
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //MOSTPLAYED
  //currentPlayer 15분마다 업데이트
  @Cron('*/15 * * * *')
  async handleCronFor15minute() {
    this.logger.debug('Running scheduled scraping task for most played charts');
    await this.scrapMostPlayedCharts();
  }

  //TOP SELLERS (Top 100 selling games right now, by revenue)
  //하루마다 업데이트
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCronForEveryDay() {
    this.logger.debug('Running scheduled scraping task for top sellers');
    await this.scrapTopSellerCharts('KR');
    await this.scrapTopSellerCharts('US');
    await this.scrapTopSellerCharts('JP');
    await this.scrapTopSellerCharts('CN');
    await this.scrapTopSellerCharts('global');
  }

  //BROADCASTS
  //5분마다 업데이트
  @Cron('*/5 * * * *')
  async handleCronFor5minute() {
    this.logger.debug('Running scheduled scraping task for Broadcasts');
    await this.scrapBroadcasts();
  }

  //MostPlayed (Top 100 played games right now)
  async scrapMostPlayedCharts(): Promise<MostPlayedDto[]> {
    const browser = await puppeteer.launch({
      headless: true,
      args: this.args,
      executablePath:
        process.env.NODE_ENV === 'development'
          ? undefined
          : '/usr/bin/google-chrome-stable',
      // executablePath: '/usr/bin/google-chrome-stable',
      ignoreHTTPSErrors: true, // 추가: HTTPS 오류 무시
    });

    const page = await browser.newPage();

    try {
      await page.goto('https://store.steampowered.com/charts/mostplayed');

      const tableSelector = 'table._3arZn0BMPzyhcYNADe193m';
      await page.waitForSelector(tableSelector);

      // 각 행의 데이터를 추출
      const currentCharts = await page.evaluate((tableSelector) => {
        const rows = document.querySelectorAll(`${tableSelector} > tbody > tr`);

        return Array.from(rows).map((row) => {
          const columns = row.querySelectorAll('td');

          // 링크와 텍스트 추출
          const gameElement = columns[2].querySelector(
            'a',
          ) as HTMLAnchorElement;
          const gameUrl = gameElement ? gameElement.href : null;

          // 링크에서 앱 ID 추출 (정규 표현식 사용)
          const appIdMatch = gameUrl ? gameUrl.match(/\/app\/(\d+)/) : null;
          const appId = appIdMatch ? appIdMatch[1] : null;

          const imageUrl = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg?t=1723514356`;

          return {
            rank: columns[1].innerText.trim(),
            name: columns[2].innerText.trim(),
            price: columns[3].innerText.trim(),
            currentPlayers: columns[4].innerText.trim(),
            peakPlayers: columns[5].innerText.trim(),
            gameUrl,
            imageUrl,
            playerChange: null,
            rankChange: null,
            newChart: false,
          };
        });
      }, tableSelector);

      // 캐시된 데이터 가져오기
      const previousCharts = await this.cacheService.get('mostPlayedCharts');
      if (!previousCharts) {
        console.log('No previous data. Saving current charts to cache.');
        await this.cacheService.set(
          'mostPlayedCharts',
          JSON.stringify(currentCharts),
        );
        this.logger.debug('Most played charts data cached');
        return currentCharts;
      }

      const previousChartsJson = JSON.parse(previousCharts);

      // 이전 데이터에서 현재 게임과 동일한 게임을 찾음
      currentCharts.forEach((currentChart) => {
        const previousChart = previousChartsJson.find(
          (prevChart) => prevChart.name === currentChart.name,
        );

        // 쉼표를 제거한 후 숫자로 변환
        const currentPlayers = parseInt(
          currentChart.currentPlayers.replace(/,/g, ''),
          10,
        );
        const currentRank = parseInt(currentChart.rank.replace(/,/g, ''), 10);

        // 이전 데이터가 있으면 차이 계산, 없으면 0으로 설정
        const previousPlayers = previousChart
          ? parseInt(previousChart.currentPlayers.replace(/,/g, ''), 10)
          : 0;
        const playerChange = currentPlayers - previousPlayers;

        const previousRank = previousChart
          ? parseInt(previousChart.rank.replace(/,/g, ''), 10)
          : Infinity; // 초기값을 무한대로 설정하여 새 데이터가 가장 높은 순위를 가짐
        const rankChange = previousRank - currentRank;

        // rankChange에 따른 화살표 추가
        let rankChangeDisplay;
        if (rankChange > 0) {
          rankChangeDisplay = `▲ ${rankChange}`; // 순위가 높아지면 ▲
        } else if (rankChange < 0) {
          rankChangeDisplay = `▼ ${Math.abs(rankChange)}`; // 순위가 낮아지면 ▼
        } else {
          rankChangeDisplay = `-`; // 순위 변동이 없을 때
        }

        // 새로운 데이터가 있는 경우
        if (!previousChart) {
          currentChart.newChart = true;
        } else {
          currentChart.newChart = false;
        }

        // currentChart를 직접 업데이트
        currentChart.playerChange = playerChange;
        currentChart.rankChange = rankChangeDisplay;
      });

      // 캐시에 데이터 저장
      await this.cacheService.set(
        'mostPlayedCharts',
        JSON.stringify(currentCharts),
      );
      // this.logger.debug('Most played charts data cached');
      return currentCharts;
    } catch (error) {
      console.error('Error during scraping:', error);
    } finally {
      await browser.close();
    }
  }

  //TOP SELLERS (Top 100 selling games right now, by revenue)
  async scrapTopSellerCharts(region: string): Promise<TopSellerDto[]> {
    const browser = await puppeteer.launch({
      headless: true,
      args: this.args,
      executablePath:
        process.env.NODE_ENV === 'development'
          ? undefined
          : '/usr/bin/google-chrome-stable',
      // executablePath: '/usr/bin/google-chrome-stable',
      ignoreHTTPSErrors: true, // 추가: HTTPS 오류 무시
    });

    const page = await browser.newPage();

    try {
      await page.goto(
        `https://store.steampowered.com/charts/topselling/${region}`,
      );

      const tableSelector = 'table._3arZn0BMPzyhcYNADe193m';
      await page.waitForSelector(tableSelector);

      const games = await page.evaluate((tableSelector) => {
        const rows = document.querySelectorAll(`${tableSelector} > tbody > tr`);
        return Array.from(rows).map((row) => {
          const columns = row.querySelectorAll('td');

          // 링크와 텍스트 추출
          const gameElement = columns[2].querySelector(
            'a',
          ) as HTMLAnchorElement;
          const gameUrl = gameElement ? gameElement.href : null;

          // 링크에서 앱 ID 추출 (정규 표현식 사용)
          const appIdMatch = gameUrl ? gameUrl.match(/\/app\/(\d+)/) : null;
          const appId = appIdMatch ? appIdMatch[1] : null;

          const imageUrl = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg?t=1723514356`;

          return {
            rank: columns[1].innerText.trim(),
            name: columns[2].innerText.trim(),
            price: columns[3].innerText.trim(), //Today's price for this game.
            rankChange: columns[4].innerText.trim(), //Change in rank compared to previous week.
            weeks: columns[5].innerText.trim(), //Number of weeks in top 100
            gameUrl, // 게임 URL
            imageUrl, // 이미지 URL
          };
        });
      }, tableSelector);

      //캐시에 데이터 저장
      await this.cacheService.set(
        `topSellerCharts:${region}`,
        JSON.stringify(games),
      );
      this.logger.debug(`Top seller charts data for region ${region} cached`);
      return games;
    } catch (error) {
      this.logger.error(
        'Error during scraping most played charts:',
        error.message,
      );
      throw error;
    } finally {
      await browser.close();
    }
  }

  // 방송 목록 스크래핑
  async scrapBroadcasts(): Promise<BroadcastsDto[]> {
    const browser = await puppeteer.launch({
      dumpio: true,
      headless: true,
      devtools: true,
      args: this.args,
      executablePath:
        process.env.NODE_ENV === 'development'
          ? undefined
          : '/usr/bin/google-chrome-stable',
      // executablePath: '/usr/bin/google-chrome-stable',
      ignoreHTTPSErrors: true, // 추가: HTTPS 오류 무시
    });

    const page = await browser.newPage();

    try {
      await page.goto('https://steamcommunity.com/?subsection=broadcasts');

      // 컨테이너 셀렉터 동적 생성
      const containerSelectors = [];
      for (let row = 1; row <= 5; row++) {
        for (let col = 2; col <= 3; col++) {
          containerSelectors.push(
            `#page_1_row_${row}_template_twoLarge > div:nth-child(${col})`,
          );
        }
      }

      // 모든 셀렉터가 로드될 때까지 기다리기
      await Promise.all(
        containerSelectors.map((selector) => page.waitForSelector(selector)),
      );

      // 방송 목록을 추출하기
      const broadcasts = await page.evaluate((selectors) => {
        return selectors.flatMap((selector) => {
          const rows = document.querySelectorAll(selector);
          return Array.from(rows).map((row) => {
            // const avatarImg = row.querySelector('img');
            // const avatarUrl = avatarImg ? avatarImg.getAttribute('src') : null;

            const broadcastInfoContainer = row.querySelector(
              'a > div.apphub_CardMetaData',
            );
            const broadcastLink = row.querySelector('a').href;
            const viewers = broadcastInfoContainer
              ? broadcastInfoContainer
                  .querySelector('div.apphub_CardContentViewers.ellipsis')
                  .textContent.trim()
                  .match(/\d{1,3}(,\d{3})*/)[0] // 쉼표 포함 숫자 추출
              : null;
            const title = broadcastInfoContainer
              ? broadcastInfoContainer
                  .querySelector('div.apphub_CardContentTitle.ellipsis')
                  .textContent.trim()
              : null;
            const streamerInfo = row.querySelector(
              `div > div.apphub_friend_block_container > div > div > a:nth-child(2)`,
            );

            const avatarUrl =
              row
                .querySelector(
                  'div > div.apphub_friend_block_container > div > a > div.appHubIconHolder.offline > img',
                )
                ?.getAttribute('src') ?? null; // getAttribute를 사용하여 이미지 URL 추출

            const thumbnailUrl =
              row
                .querySelector(
                  'a > div.apphub_CardContentClickable > div.apphub_CardContentPreviewImageBorder > div > img.apphub_CardContentPreviewImage',
                )
                ?.getAttribute('src') ?? null; // getAttribute를 사용하여 이미지 URL 추출

            return {
              broadcastLink,
              viewers,
              title,
              streamerInfo: streamerInfo?.textContent?.trim() ?? null,
              streamerInfoLink: streamerInfo?.href ?? null,
              avatarUrl,
              thumbnailUrl,
            };
          });
        });
      }, containerSelectors);

      //캐시에 데이터 저장
      await this.cacheService.set(`broadcasts`, JSON.stringify(broadcasts));
      this.logger.debug(`broadcasts data cached`);
      return broadcasts;
    } catch (error) {
      console.error('Error during scraping:', error);
    } finally {
      await browser.close();
    }
  }

  async scrapUserData(): Promise<any> {
    const browser = await puppeteer.launch({
      headless: true,
      args: this.args,
      executablePath:
        process.env.NODE_ENV === 'development'
          ? undefined
          : '/usr/bin/google-chrome-stable',
      // executablePath: '/usr/bin/google-chrome-stable',
      ignoreHTTPSErrors: true, // 추가: HTTPS 오류 무시
    });

    const page = await browser.newPage();
  }
}
