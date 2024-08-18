import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
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
    description: 'Steam 아바타 URL',
    example:
      'https://avatars.steamstatic.com/54b97d0998d152f01d876d03dad1fdd2fb642dd2_full.jpg',
  })
  steamAvatarUrl: string;
}

export class UserStatsDto {
  @ApiProperty({
    description: 'Steam 가입 날짜',
    example: '2008-09-16T02:52:45',
  })
  steamJoinDate: string;

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
    additionalProperties: true,
  })
  badges: Record<string, any>;

  @ApiProperty({
    description: '밴 정보',
    type: 'object',
    additionalProperties: true,
  })
  bans: Record<string, any>;
}
