import { IsString } from 'class-validator';

export class MoveToCartDto {
  @IsString()
  userId: string;

  @IsString()
  productId: string;
}