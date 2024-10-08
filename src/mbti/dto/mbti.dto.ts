import { IsArray, IsNumber } from 'class-validator';

export class AnswersDto {
  @IsArray()
  @IsNumber({}, { each: true }) // 각 요소가 숫자인지 확인
  answers: number[];
}
