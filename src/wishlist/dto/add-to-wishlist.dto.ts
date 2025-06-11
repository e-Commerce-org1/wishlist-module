import { IsString } from 'class-validator';

export class AddToWishlistDto {
  @IsString()
  userId: string;

  @IsString()
  productId: string;
}
