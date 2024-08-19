import { ApiProperty } from '@nestjs/swagger';

export class GameDto {
  @ApiProperty({
    description: 'appId',
    example: 322330,
  })
  appId: number;

  @ApiProperty({
    description: '플레이타임',
    example: 1472,
  })
  playtime: number;

  @ApiProperty({
    description: '마지막 플레이',
    example: 1672673515,
  })
  lastPlayed: number;
}

export class GamesDto {
  @ApiProperty({
    description: '게임 목록',
    type: [GameDto],
  })
  gameList: GameDto[];

  @ApiProperty({
    description: '총 게임 수',
    example: 24224,
  })
  totalGames: number;
}
