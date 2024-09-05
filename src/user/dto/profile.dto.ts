import { ApiProperty } from '@nestjs/swagger';
import { GamesDto } from './game.dto';
import { UserSummaryDto, UserStatsDto } from './user.dto';

export class ProfileDto {
  @ApiProperty({
    description: 'Steam 사용자 기본정보',
    type: UserSummaryDto,
  })
  userInfo: UserSummaryDto;

  @ApiProperty({
    description: 'Steam 사용자 세부정보',
    type: UserStatsDto,
  })
  userStats: UserStatsDto;

  @ApiProperty({
    description: '사용자가 소유한 게임정보',
    type: GamesDto,
  })
  gameList: GamesDto;
}
