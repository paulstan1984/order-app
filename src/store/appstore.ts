// Utilities
import { defineStore } from 'pinia'

export type FlourType = 'Albă' | 'Integrală' | 'Fără gluten';

export interface ProductDTO {
  flourType: FlourType;
  colorType: string;
  pastaType: string;
  packType: string;
  quantity: number;
}

export const prices = {
  'Albă': {
    '250 gr': 10,
    '500 gr': 20
  },
  'Integrală': {
    '250 gr': 15,
    '500 gr': 30
  },
  'Fără gluten': {
    '100 gr': 10,
    '200 gr': 20
  }
}


export const appStore = defineStore('appStore', {
  state: () => ({
    cart: [] as ProductDTO[]
  }),

  actions: {
    addToCart(p: ProductDTO) {
      this.cart.push(p);
    },

    removeFromCart(index: number) {
      this.cart.splice(index, 1);
    },

    getPackTypes(flourType: FlourType): string[] {
      const packages = prices[flourType];
      if (packages) {
        return Object.keys(packages);
      }

      return [];
    },

    getPrice(p: ProductDTO) {

    }
  }
})
