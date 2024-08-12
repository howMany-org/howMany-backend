import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';

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
      this.logger.debug('Initial scraping tasks completed');
    } catch (error) {
      this.logger.error('Error during initial scraping tasks', error);
    }
  }

  //MOSTPLAYED (currentPlayer 15분마다 업데이트)
  @Cron('*/15 * * * *')
  async handleCronFor15minute() {
    this.logger.debug('Running scheduled scraping task for most played charts');
    await this.scrapMostPlayedCharts();
  }

  //TOP SELLERS (Top 100 selling games right now, by revenue)
  //하루마다 불러오도록 cron설정
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCronForEveryDay() {
    this.logger.debug('Running scheduled scraping task for top sellers');
    await this.scrapTopSellerCharts('KR');
    await this.scrapTopSellerCharts('US');
    await this.scrapTopSellerCharts('JP');
    await this.scrapTopSellerCharts('CN');
  }

  async scrapMostPlayedCharts() {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium-browser',
      // args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    try {
      await page.goto('https://store.steampowered.com/charts/mostplayed');
      const tableSelector =
        '#page_root > div:nth-child(5) > div > div > div > div._3sJkwsBQuiAc_i3VOWX4tv > table';
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

          // 브라우저 콘솔에 로그 찍기
          console.log({
            rank: columns[1].innerText.trim(),
            name: columns[2].innerText.trim(),
            price: columns[3].innerText.trim(),
            currentPlayers: columns[4].innerText.trim(),
            peakPlayers: columns[5].innerText.trim(),
            imageUrl,
          });

          return {
            rank: columns[1].innerText.trim(),
            name: columns[2].innerText.trim(),
            price: columns[3].innerText.trim(),
            currentPlayers: columns[4].innerText.trim(),
            peakPlayers: columns[5].innerText.trim(),
            imageUrl, // 이미지 URL 추가
          };
        });
      }, tableSelector);

      // 캐시에 데이터 저장 (TTL 15분)
      await this.cacheService.set(
        'mostPlayedCharts',
        JSON.stringify(games),
        900,
      );
      this.logger.debug('Most played charts data cached');
      return games;
    } catch (error) {
      console.error('Error during scraping:', error);
    } finally {
      await browser.close();
    }
  }

  //TOP SELLERS (Top 100 selling games right now, by revenue)
  async scrapTopSellerCharts(region: string) {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium-browser',
    });
    const page = await browser.newPage();
    try {
      await page.goto(
        `https://store.steampowered.com/charts/topselling/${region}`,
      );

      // 차트 데이터 추출
      const tableSelector =
        '#page_root > div:nth-child(5) > div > div > div > div._3sJkwsBQuiAc_i3VOWX4tv > table';
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

          return {
            rank: columns[1].innerText.trim(),
            name: columns[2].innerText.trim(),
            price: columns[3].innerText.trim(), //Today's price for this game.
            change: columns[4].innerText.trim(), //Change in rank compared to previous week.
            weeks: columns[5].innerText.trim(), //Number of weeks in top 100
            imageUrl, // 이미지 URL 추가
          };
        });
      }, tableSelector);

      //캐시에 데이터 저장 (TTL 15분)
      await this.cacheService.set(
        `topSellerCharts:${region}`,
        JSON.stringify(games),
        86400,
      );
      this.logger.debug(`Top seller charts data for region ${region} cached`);

      return games;
    } catch (error) {
      console.error('Error during scraping:', error);
    } finally {
      await browser.close();
    }
  }

  // 방송 목록 스크래핑
  async scrapBroadcasts() {
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
        '/home/ubuntu/.cache/puppeteer/chrome/linux-127.0.6533.99/chrome-linux64/chrome',
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
            const linkElement = row.querySelector('a');
            const broadcastInfoElement = row.querySelector(
              'a > div.apphub_CardMetaData',
            );
            const friendBlockContainer = row.querySelector(
              'div.apphub_friend_block_container',
            );
            const additionalInfo = friendBlockContainer
              ? friendBlockContainer.querySelector()
              : null;
            const additionalInfoLink = friendBlockContainer
              ? friendBlockContainer.querySelector('div > div > a:nth-child(2)')
              : null;
            return {
              link: linkElement ? linkElement.href : '',
              broadcastInfo: broadcastInfoElement
                ? broadcastInfoElement.textContent.trim()
                : '',
              additionalInfo: additionalInfo,
              additionalInfoLink: additionalInfoLink ? additionalInfo.href : '',
            };
          });
        });
      }, containerSelectors);

      console.log(broadcasts);
      return broadcasts;
    } catch (error) {
      console.error('Error during scraping:', error);
    } finally {
      await browser.close();
    }
  }
}

// scrapBroadcasts();

//       '#page_1_row_1_template_twoLarge > div:nth-child(2) > div'
//       '#page_1_row_1_template_twoLarge > div:nth-child(2) > a';
// for(containerSelectors)
//
//       const broadcasts = await page.evaluate((selector) => {
//         const rows = document.querySelectorAll(selector);
//         return Array.from(rows).map((row) => {
//           const columns = row.querySelectorAll('div:nth-child(2)');

//           // 이미지 URL 추출
//           let imageUrl = '';
//           const imgElement = columns[2].querySelector(
//             'a > img',
//           ) // 이미지가 있는 <a> 내부의 <img> 태그를 찾음
//           if (imgElement) {
//             imageUrl = imgElement.src;
//           }

//       const broadcasts = await page.evaluate((selector) => {
//         const element = document.querySelector(selector);
//         return element ? element.innerHTML : null; // 요소가 존재하면 HTML을 반환
//       }, selector);
//       // 캐시에 데이터 저장 (TTL 15분)
//       await this.cacheService.set(
//         'steamStreamings',
//         JSON.stringify(broadcasts),
//         900,
//       );
//       this.logger.debug('Steam streamings data cached');
//       return broadcasts;
//     })});
//      catch (error) {
//       this.logger.error('Error during scraping:', error);
//     } finally {
//       await browser.close();
//     }
//   }
// }

//   selectors.forEach((selector) => {
//     const container = document.querySelector(selector);
//     if (container) {
//       // 방송 카드 추출
//       const items = container.querySelectorAll('.Broadcast_Card');
//       items.forEach((item) => {
//         const titleElement = item.querySelector(
//           '.apphub_CardContentType',
//         );
//         const viewersElement = item.querySelector(
//           '.apphub_CardContentViewers',
//         );
//         const imageElement = item.querySelector(
//           '.apphub_CardContentPreviewImage',
//         );
//         const linkElement = item.querySelector('a');
//         const authorElement = item.querySelector(
//           '.apphub_CardContentAuthorName',
//         );
//         const authorImageElement = item.querySelector(
//           '.appHubIconHolder img',
//         );
//         return {
//           result: {
//             title: titleElement ? titleElement.innerText.trim() : '',
//             viewers: viewersElement
//               ? viewersElement.innerText.trim()
//               : '',
//             imageUrl: imageElement ? imageElement.src : '',
//             link: linkElement ? linkElement.href : '',
//             author: authorElement ? authorElement.innerText.trim() : '',
//             authorImageUrl: authorImageElement
//               ? authorImageElement.src
//               : '',
//           },
//         };
//       });
//     }
//   });
// }, containerSelectors);
