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

  async scrapMostPlayedCharts(): Promise<MostPlayedDto[]> {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-gpu',
        '--user-data-dir=/tmp/chrome-profile',
      ],
      executablePath:
        process.env.MODE === 'develop'
          ? undefined
          : '/home/ubuntu/.cache/puppeteer/chrome/linux-127.0.6533.99/chrome-linux64/chrome',
    });

    const page = await browser.newPage();

    try {
      await page.goto('https://store.steampowered.com/charts/mostplayed');

      // const tableSelector =
      //   '#page_root > div:nth-child(5) > div > div > div > div._3sJkwsBQuiAc_i3VOWX4tv > table';
      const tableSelector = 'table._3arZn0BMPzyhcYNADe193m';
      await page.waitForSelector(tableSelector);

      // 각 행의 데이터를 추출
      const games = await page.evaluate((tableSelector) => {
        const rows = document.querySelectorAll(`${tableSelector} > tbody > tr`);

        return Array.from(rows).map((row) => {
          const columns = row.querySelectorAll('td');

          // 이미지 URL 추출
          let imageUrl = '';
          const imgElement = columns[2].querySelector(
            'a > img',
          ) as HTMLImageElement; // 이미지가 있는 <a> 내부의 <img> 태그를 찾음
          if (imgElement) {
            imageUrl = imgElement.src;
          }

          // 링크와 텍스트 추출
          const linkElement = columns[2].querySelector(
            'a',
          ) as HTMLAnchorElement;
          const linkHref = linkElement ? linkElement.href : null;

          return {
            rank: columns[1].innerText.trim(),
            name: columns[2].innerText.trim(),
            price: columns[3].innerText.trim(),
            currentPlayers: columns[4].innerText.trim(),
            peakPlayers: columns[5].innerText.trim(),
            imageUrl, // 이미지 URL 추가
            linkHref,
          };
        });
      }, tableSelector);

      // 캐시에 데이터 저장
      await this.cacheService.set('mostPlayedCharts', JSON.stringify(games));
      this.logger.debug('Most played charts data cached');
      return games;
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
      args: ['--no-sandbox', '--disable-gpu'],
      executablePath:
        process.env.MODE === 'develop'
          ? undefined
          : '/home/ubuntu/.cache/puppeteer/chrome/linux-127.0.6533.99/chrome-linux64/chrome',
    });

    const page = await browser.newPage();

    try {
      await page.goto(
        `https://store.steampowered.com/charts/topselling/${region}`,
      );

      // const tableSelector =
      // '#page_root > div:nth-child(5) > div > div > div > div._3sJkwsBQuiAc_i3VOWX4tv > table > tbody > tr';
      const tableSelector = 'table._3arZn0BMPzyhcYNADe193m';
      await page.waitForSelector(tableSelector);

      const games = await page.evaluate((tableSelector) => {
        const rows = document.querySelectorAll(`${tableSelector} > tbody > tr`);
        return Array.from(rows).map((row) => {
          const columns = row.querySelectorAll('td');

          // 이미지 URL 추출
          let imageUrl = '';
          const imgElement = columns[2].querySelector(
            'a > img',
          ) as HTMLImageElement;
          if (imgElement) {
            imageUrl = imgElement.src;
          }

          // 링크와 텍스트 추출
          const linkElement = columns[2].querySelector(
            'a',
          ) as HTMLAnchorElement;
          const gameUrl = linkElement ? linkElement.href : null;

          return {
            rank: columns[1].innerText.trim(),
            name: columns[2].innerText.trim(),
            price: columns[3].innerText.trim(), //Today's price for this game.
            change: columns[4].innerText.trim(), //Change in rank compared to previous week.
            weeks: columns[5].innerText.trim(), //Number of weeks in top 100
            imageUrl, // 이미지 URL
            gameUrl, // 게임 URL
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
      args: [
        '--no-sandbox',
        '--disable-gpu',
        '--user-data-dir=/tmp/chrome-profile',
      ],
      executablePath:
        process.env.MODE === 'develop'
          ? undefined
          : '/home/ubuntu/.cache/puppeteer/chrome/linux-127.0.6533.99/chrome-linux64/chrome',
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
            const broadcastInfoContainer = row.querySelector(
              'a > div.apphub_CardMetaData',
            );
            const broadcastLink = row.querySelector('a').href;
            const viewers = broadcastInfoContainer
              ? broadcastInfoContainer
                  .querySelector('div.apphub_CardContentViewers.ellipsis')
                  .textContent.trim()
              : null;
            const title = broadcastInfoContainer
              ? broadcastInfoContainer
                  .querySelector('div.apphub_CardContentTitle.ellipsis')
                  .textContent.trim()
              : null;
            const streamerInfo = row.querySelector(
              `div > div.apphub_friend_block_container > div > div > a:nth-child(2)`,
            );

            return {
              broadcastLink,
              viewers,
              title,
              streamerInfo: streamerInfo?.textContent?.trim() ?? null,
              streamerInfoLink: streamerInfo?.href ?? null,
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
}
