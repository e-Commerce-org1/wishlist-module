import { Injectable, HttpException } from '@nestjs/common';
import { WishlistDao } from '..//wishlist/dao/wishlist.dao';
import { ProductGrpcClient } from '../../grpc/clients/product.client';
import { CartGrpcClient } from '../../grpc/clients/cart.client';
import { CustomLogger } from '../../../common/logger/custom-logger.service';
import {  HTTP_STATUS } from '../common/constants/http-status.constants';
import { RESPONSE_MESSAGES } from '../common/constants/response-messages.constants';
import { AddToWishlistDto} from '../wishlist/dto/add-to-wishlist.dto';
import { RemoveFromWishlistDto } from '../wishlist/dto/remove-from-wishlist.dto';
import { GetWishlistDto } from '../wishlist/dto/get-wishlist.dto';
import { MoveToCartDto } from '../wishlist/dto/move-to-cart.dto';
import { IWishlist, IWishlistItem } from '../interface/wishlist.interface';
import { ApiResponse } from '../common/response.helper';

@Injectable()
export class WishlistService {
  constructor(
    private readonly wishlistDao: WishlistDao,
    private readonly productGrpcClient: ProductGrpcClient,
    private readonly cartGrpcClient: CartGrpcClient,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('WishlistService');
  }

  async getWishlist(getWishlistDto: GetWishlistDto): Promise<ApiResponse<IWishlist>> {
    try {
      const { userId } = getWishlistDto;
      const wishlist = await this.wishlistDao.findOrCreateWishlist(userId);

      return {
        success: true,
        message: RESPONSE_MESSAGES.WISHLIST_RETRIEVED,
        data: wishlist,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error) {
      this.logger.error(`Error fetching wishlist: ${error.message}`);
      throw new HttpException(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async addItemToWishlist(dto: AddToWishlistDto): Promise<ApiResponse<IWishlist>> {
    try {
      const { userId, productId } = dto;
      await this.wishlistDao.findOrCreateWishlist(userId);

      const product = await this.productGrpcClient.getProduct(productId);
      if (!product) {
        throw new HttpException(RESPONSE_MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
      }

      if (product.stock <= 0) {
        throw new HttpException(RESPONSE_MESSAGES.PRODUCT_OUT_OF_STOCK, HTTP_STATUS.BAD_REQUEST);
      }

      const wishlistItem: IWishlistItem = {
        productId: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        stock: product.stock,
        addedAt: new Date(),
      };

      const updatedWishlist = await this.wishlistDao.addItemToWishlist(userId, wishlistItem);

      return {
        success: true,
        message: RESPONSE_MESSAGES.ITEM_ADDED_TO_WISHLIST,
        data: updatedWishlist,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error) {
      this.logger.error(`Add to wishlist error: ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new HttpException(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async removeItemFromWishlist(dto: RemoveFromWishlistDto): Promise<ApiResponse<IWishlist>> {
    try {
      const { userId, productId } = dto;
      const existingItem = await this.wishlistDao.getItemFromWishlist(userId, productId);
      if (!existingItem) {
        throw new HttpException(RESPONSE_MESSAGES.ITEM_NOT_IN_WISHLIST, HTTP_STATUS.NOT_FOUND);
      }

      const updatedWishlist = await this.wishlistDao.removeItemFromWishlist(userId, productId);

      return {
        success: true,
        message: RESPONSE_MESSAGES.ITEM_REMOVED_FROM_WISHLIST,
        data: updatedWishlist,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error) {
      this.logger.error(`Remove from wishlist error: ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new HttpException(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async moveItemToCart(dto: MoveToCartDto): Promise<ApiResponse<{ moved: boolean; cartAdded: boolean }>> {
    try {
      const { userId, productId } = dto;

      const wishlistItem = await this.wishlistDao.getItemFromWishlist(userId, productId);
      if (!wishlistItem) {
        throw new HttpException(RESPONSE_MESSAGES.ITEM_NOT_IN_WISHLIST, HTTP_STATUS.NOT_FOUND);
      }

      const stockResponse = await this.productGrpcClient.checkStock(productId, 1);
      if (!stockResponse?.inStock) {
        throw new HttpException(RESPONSE_MESSAGES.PRODUCT_OUT_OF_STOCK, HTTP_STATUS.BAD_REQUEST);
      }

      const cartSuccess = await this.cartGrpcClient.addToCart(userId, productId, wishlistItem.price, 'wishlist');
      if (!cartSuccess?.success) {
        throw new HttpException(RESPONSE_MESSAGES.GRPC_ERROR, HTTP_STATUS.SERVICE_UNAVAILABLE);
      }

      await this.wishlistDao.removeItemFromWishlist(userId, productId);

      return {
        success: true,
        message: RESPONSE_MESSAGES.ITEM_MOVED_TO_CART,
        data: { moved: true, cartAdded: true },
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error) {
      this.logger.error(`Move to cart error: ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new HttpException(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async clearWishlist(userId: string): Promise<ApiResponse<boolean>> {
    try {
      const deleted = await this.wishlistDao.deleteWishlist(userId);
      if (!deleted) {
        throw new HttpException(RESPONSE_MESSAGES.WISHLIST_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
      }

      return {
        success: true,
        message: 'Wishlist cleared successfully',
        data: true,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error) {
      this.logger.error(`Clear wishlist error: ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new HttpException(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}
