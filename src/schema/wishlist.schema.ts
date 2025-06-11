// src/modules/wishlist/schemas/wishlist-item.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type WishlistDocument = Wishlist & Document;

@Schema()
export class WishlistItem {
  @ApiProperty({ description: 'Product ID', example: '64f1a2b3c4d5e6f7g8h9i0j1' })
  @Prop({ required: true }) productId: string;

  @ApiProperty({ description: 'Product name', example: 'Nike Air Max 270' })
  @Prop({ required: true }) name: string;

  @ApiProperty({ description: 'Product description', example: 'Comfortable running shoes' })
  @Prop({ required: true }) description: string;

  @ApiProperty({ description: 'Product price', example: 8999.99 })
  @Prop({ required: true }) price: number;

  @ApiProperty({ description: 'Product image URL', example: 'https://example.com/image.jpg' })
  @Prop({ required: true }) image: string;

  @ApiProperty({ description: 'Available stock', example: 10 })
  @Prop({ required: true }) stock: number;

  @ApiProperty({ description: 'Date when item was added to wishlist' })
  @Prop({ default: Date.now }) addedAt: Date;
}


@Schema({ timestamps: true,})
export class Wishlist{

 @ApiProperty({
    description: 'User ID',
    example: 'user123',
  })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({
    description: 'Items in the cart',
    type: [WishlistItem],
  })
  @Prop({ type: [WishlistItem], default: [] })
  items: WishlistItem[];

}

export const WishlistItemSchema = SchemaFactory.createForClass(WishlistItem);