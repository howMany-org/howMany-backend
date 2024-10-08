import { ApiProperty } from '@nestjs/swagger';

export class MostPlayedDto {
  @ApiProperty({
    description: '게임의 순위',
    example: 1,
  })
  rank: string;

  @ApiProperty({
    example: 'Counter-Strike 2',
    description: '게임 이름',
  })
  name: string;

  @ApiProperty({
    description: '이 게임의 오늘 가격',
    example: 'Free To Play',
  })
  price: string;

  @ApiProperty({
    description: '현재 플레이 중인 플레이어 수',
    example: '867,766',
  })
  currentPlayers: string;

  @ApiProperty({
    description: '최고 동시 플레이어 수',
    example: '1,313,419',
  })
  peakPlayers: string;

  @ApiProperty({
    description: '게임 페이지 URL',
    example:
      'https://store.steampowered.com/app/381210/Dead_by_Daylight?snr=1_7001_7005__7003',
  })
  gameUrl: string;

  @ApiProperty({
    description: '게임 이미지 URL',
    example:
      'https://shared.akamai.steamstatic.com//store_item_assets/steam/apps/730/capsule_231x87.jpg?t=1719426374',
  })
  imageUrl: string;

  @ApiProperty({
    description: '게임의 접속자수 변화',
    example: 1,
  })
  playerChange: string;

  @ApiProperty({
    description: '게임의 순위변화',
    example: 1,
  })
  rankChange: string;

  @ApiProperty({
    description: '새로운 차트여부',
    example: 1,
  })
  newChart: boolean;
}

export class TopSellerDto {
  @ApiProperty({
    description: '게임의 순위',
    example: 9,
  })
  rank: string;

  @ApiProperty({
    description: '게임 이름',
    example: 'Dead by Daylight',
  })
  name: string;

  @ApiProperty({
    description: '이 게임의 오늘 가격',
    example: '-60%\n₩ 21,500\n₩ 8,600',
  })
  price: string;

  @ApiProperty({
    description: '이전 주와 비교한 순위 변화',
    example: '▲ 17',
  })
  ranckChange: string;

  @ApiProperty({
    description: '탑 100에 머문 주 수',
    example: '376',
  })
  weeks: string;

  @ApiProperty({
    description: '게임 페이지 URL',
    example:
      'https://store.steampowered.com/app/381210/Dead_by_Daylight?snr=1_7001_7005__7003',
  })
  gameUrl: string;

  @ApiProperty({
    description: '게임 이미지 URL',
    example:
      'https://shared.akamai.steamstatic.com//store_item_assets/steam/apps/381210/capsule_231x87.jpg?t=1721927210',
  })
  imageUrl: string;
}

export class UserChartDto {
  @ApiProperty({
    description: 'Steam 사용자 이름',
    example: 'Sonix',
  })
  steamName: string;

  @ApiProperty({
    description: 'Steam ID',
    example: '76561198028121353',
  })
  steamId: string;

  @ApiProperty({
    description: 'Steam 국가 코드',
    example: 'CN',
  })
  countryCode: string;

  @ApiProperty({
    description: 'Steam 사용자 프로필 URL',
    example: 'https://steamcommunity.com/profiles/76561199115107502/',
  })
  SteamProfileUrl: string;

  @ApiProperty({
    description: 'Steam 아바타 URL',
    example:
      'https://avatars.steamstatic.com/54b97d0998d152f01d876d03dad1fdd2fb642dd2_full.jpg',
  })
  steamAvatarUrl: string;
}

export class TopPlayTimeUserDto {
  @ApiProperty({
    description: '순위',
    example: 1,
  })
  rank: number;

  @ApiProperty({
    description: '총 플레이타임',
    example: 160450322,
  })
  totalPlaytime: number;

  @ApiProperty({
    description: 'Steam 사용자 기본정보',
    type: UserChartDto,
  })
  userInfo: UserChartDto;
}

export class TopGamesOwnerDto {
  @ApiProperty({
    description: '순위',
    example: 1,
  })
  rank: number;

  @ApiProperty({
    description: '총 게임 수',
    example: 38780,
  })
  totalGames: number;

  @ApiProperty({
    description: 'Steam 사용자 기본정보',
    type: UserChartDto,
  })
  userInfo: UserChartDto;
}

export class BroadcastsDto {
  @ApiProperty({
    description: '방송 URL',
    example: 'https://steamcommunity.com/broadcast/watch/76561198936960354',
  })
  broadcastLink: string;

  @ApiProperty({
    description: '시청자수 정보',
    example: '2,486',
  })
  viewers: string;

  @ApiProperty({
    description: '방송 제목',
    example: 'Crime Scene Cleaner',
  })
  title: string;

  @ApiProperty({
    description: '방송인 정보',
    example: 'Intuition',
  })
  streamerInfo: string;

  @ApiProperty({
    description: '방송인 프로필 링크',
    example: 'https://steamcommunity.com/profiles/76561198936960354/',
  })
  streamerInfoLink: string;

  @ApiProperty({
    description: '방송인 아바타 URL',
    example:
      'https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg',
  })
  avatarUrl: string;

  @ApiProperty({
    description: '방송 썸네일 URL',
    example:
      'https://steambroadcast.akamaized.net/broadcast/76561199651133947/665924553976484462/thumbnail/?broadcast_origin=ext3-fra2.steamserver.net',
  })
  thumbnailUrl: string;
}
