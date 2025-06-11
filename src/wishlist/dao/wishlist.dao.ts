import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from '../../schema/wishlist.schema';
import { IWishlistItem } from '../../interface/wishlist.interface';

@Injectable()
export class WishlistDao {
  constructor(@InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>) {}

  async findOrCreateWishlist(userId: string): Promise<WishlistDocument> {
    let wishlist = await this.wishlistModel.findOne({ userId });
    if (!wishlist) {
      wishlist = await this.wishlistModel.create({ userId, items: [] });
    }
    return wishlist;
  }

  async addItemToWishlist(userId: string, item: IWishlistItem): Promise<WishlistDocument| null> {
    return this.wishlistModel.findOneAndUpdate(
      { userId, 'items.productId': { $ne: item.productId } },
      { $push: { items: item } },
      { new: true }
    );
  }

  async getItemFromWishlist(userId: string, productId: string): Promise<IWishlistItem | null> {
    const wishlist = await this.wishlistModel.findOne({ userId });
    return wishlist?.items.find(item => item.productId === productId) || null;
  }

  async removeItemFromWishlist(userId: string, productId: string): Promise<WishlistDocument | null> {
    return this.wishlistModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    );
  }

  async deleteWishlist(userId: string): Promise<boolean> {
    const result = await this.wishlistModel.deleteOne({ userId });
    return result.deletedCount > 0;
  }
}
