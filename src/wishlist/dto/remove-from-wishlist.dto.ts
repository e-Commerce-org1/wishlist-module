import { IsString } from 'class-validator';

export class RemoveFromWishlistDto {
  @IsString()
  userId: string;

  @IsString()
  productId: string;
}
