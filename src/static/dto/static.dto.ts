import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/dto/user.dto';

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
  change: string;

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

export class TopPlayTimeUserDto {
  @ApiProperty({
    description: '순위',
    example: 1,
  })
  rank: number;

  @ApiProperty({
    description: 'Steam 사용자 기본정보',
    type: UserDto,
  })
  userInfo: UserDto;

  @ApiProperty({
    description: '총 플레이타임',
    example: 160450322,
  })
  totalPlaytime: number;
}

export class TopGamesOwnerDto {
  @ApiProperty({
    description: '순위',
    example: 1,
  })
  rank: number;

  @ApiProperty({
    description: 'Steam 사용자 기본정보',
    type: UserDto,
  })
  userInfo: UserDto;

  @ApiProperty({
    description: '총 게임 수',
    example: 38780,
  })
  totalGames: number;
}

export class BroadcastsDto {
  @ApiProperty({
    description: '방송 URL',
    example: 'https://steamcommunity.com/broadcast/watch/76561198936960354',
  })
  broadcastLink: string;

  @ApiProperty({
    description: '시청자수 정보',
    example: '2,486 viewers',
  })
  viewers: string;

  @ApiProperty({
    description: '방송 제목',
    example: 'Crime Scene Cleaner',
  })
  title: string;

  @ApiProperty({
    description: '방송자 정보',
    example: 'Intuition',
  })
  streamerInfo: string;

  @ApiProperty({
    description: '방송자 프로필 링크',
    example: 'https://steamcommunity.com/profiles/76561198936960354/',
  })
  streamerInfoLink: string;
}
