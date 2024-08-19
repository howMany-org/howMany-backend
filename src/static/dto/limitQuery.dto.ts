import { IsInt, Length, Max, Min } from 'class-validator';

export class LimitQueryDto {
  @IsInt({ message: 'Limit must be an integer value.' })
  @Min(1, { message: 'Limit must be at least 1.' })
  @Max(100, { message: 'Limit cannot exceed 100.' })
  limit: number;
}
