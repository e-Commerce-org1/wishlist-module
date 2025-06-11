export interface IWishlistItem {
  productId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  addedAt: Date;
}

export interface IWishlist {
  userId: string;
  items: IWishlistItem[];
}