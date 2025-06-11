import { IsString } from 'class-validator';

export class GetWishlistDto {
  @IsString()
  userId: string;
}
