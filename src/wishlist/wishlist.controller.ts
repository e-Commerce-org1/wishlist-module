import { Controller, Post, Body, Delete, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { WishlistService } from '../wishlist/wishlist.service';
import { AddToWishlistDto} from '../wishlist/dto/add-to-wishlist.dto';
import { RemoveFromWishlistDto } from '../wishlist/dto/remove-from-wishlist.dto';
import { GetWishlistDto } from '../wishlist/dto/get-wishlist.dto';
import { MoveToCartDto } from '../wishlist/dto/move-to-cart.dto';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  getWishlist(@Query() dto: GetWishlistDto) {
    return this.wishlistService.getWishlist(dto);
  }

  @Post('add')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  addToWishlist(@Body() dto: AddToWishlistDto) {
    return this.wishlistService.addItemToWishlist(dto);
  }

  @Delete('remove')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  removeFromWishlist(@Body() dto: RemoveFromWishlistDto) {
    return this.wishlistService.removeItemFromWishlist(dto);
  }

  @Delete('clear')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  clearWishlist(@Body('userId') userId: string) {
    return this.wishlistService.clearWishlist(userId);
  }

  @Post('move-to-cart')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  moveToCart(@Body() dto: MoveToCartDto) {
    return this.wishlistService.moveItemToCart(dto);
  }
}
