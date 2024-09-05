import { ApiProperty } from '@nestjs/swagger';

export class SteamUserDto {
  @ApiProperty({
    description: 'Steam 사용자 이름',
    example: 'an0rose',
  })
  steam_name: string;

  @ApiProperty({
    description: 'Steam ID',
    example: '76561198001221571',
  })
  steam_id: string;

  @ApiProperty({
    description: 'Steam Ladder 프로필 URL',
    example: 'https://steamladder.com/profile/76561198001221571/',
  })
  steamladder_url: string;

  @ApiProperty({
    description: 'Steam 가입 날짜',
    example: '2008-09-16T02:52:45',
  })
  steam_join_date: string;

  @ApiProperty({
    description: 'Steam 국가 코드',
    example: 'KR',
  })
  steam_country_code: string;

  @ApiProperty({
    description: 'Steam 아바타 URL',
    example:
      'https://avatars.steamstatic.com/dc59a43c5e23c60b83c22b9841ad09a36ac5a4f8_full.jpg',
  })
  steam_avatar_src: string;
}

export class SteamStatsDto {
  @ApiProperty({
    description: 'Steam 사용자 레벨',
    example: 458,
  })
  level: number;

  @ApiProperty({
    description: '경험치',
    example: 1076164,
  })
  xp: number;

  @ApiProperty({
    description: '배지 정보',
    type: 'object',
    additionalProperties: true, // Additional properties are allowed
  })
  badges: Record<string, any>; // Use Record<string, any> for flexible properties

  //   @ApiProperty({
  //     description: '게임 정보',
  //     type: GamesDto,
  //   })
  //   games: GamesDto;

  @ApiProperty({
    description: '밴 정보',
    type: 'object',
    additionalProperties: true, // Additional properties are allowed
  })
  bans: Record<string, any>; // Use Record<string, any> for flexible properties
}

export class LadderDto {
  @ApiProperty({
    description: '순위',
    example: 0,
  })
  pos: number;

  @ApiProperty({
    description: 'Steam 사용자 정보',
    type: SteamUserDto,
  })
  steam_user: SteamUserDto;

  @ApiProperty({
    description: 'Steam 통계',
    type: SteamStatsDto,
  })
  steam_stats: SteamStatsDto;
}

export class TopPlayTimeUserDto {
  @ApiProperty({
    description: '타입',
    example: 'G',
  })
  type: string;

  @ApiProperty({
    description: '타입 URL',
    example: 'games',
  })
  type_url: string;

  @ApiProperty({
    description: '국가 코드',
    example: 'KR',
  })
  country_code: string;

  @ApiProperty({
    description: '계층',
    type: [LadderDto], // 배열의 항목 타입을 지정
  })
  ladder: LadderDto[];
}
