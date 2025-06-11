export const RESPONSE_MESSAGES = {
  // Success Messages
  SUCCESS: 'Operation completed successfully',
  WISHLIST_CREATED: 'Wishlist created successfully',
  ITEM_ADDED_TO_WISHLIST: 'Item added to wishlist successfully',
  ITEM_REMOVED_FROM_WISHLIST: 'Item removed from wishlist successfully',
  WISHLIST_RETRIEVED: 'Wishlist retrieved successfully',
  ITEM_MOVED_TO_CART: 'Item moved to cart successfully',
  
  // Error Messages
  VALIDATION_ERROR: 'Validation failed',
  INTERNAL_SERVER_ERROR: 'Internal server error occurred',
  WISHLIST_NOT_FOUND: 'Wishlist not found',
  PRODUCT_NOT_FOUND: 'Product not found',
  ITEM_NOT_IN_WISHLIST: 'Item not found in wishlist',
  PRODUCT_OUT_OF_STOCK: 'Product is out of stock',
  GRPC_ERROR: 'gRPC service error',
  DATABASE_ERROR: 'Database operation failed',
  DUPLICATE_ITEM: 'Item already exists in wishlist',
} as const;