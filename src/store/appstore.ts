// Utilities
import { defineStore } from 'pinia'

export interface ProductDTO {
  flourType: string;
  colorType: string;
  pastaType: string;
  packType: string;
  quantity: number;
}

export const appStore = defineStore('appStore', {
  state: () => ({
    cart: [] as ProductDTO[]
  }),

  actions: {
    addToCart(p: ProductDTO) {
      this.cart.push(p);
    }
  }
})
