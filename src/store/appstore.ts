// Utilities
import { defineStore } from 'pinia'
import axios from 'axios';

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

const accessToken = 'BJFKELVBJRKELDBNRJKEL';
const APIURL = 'http://api-paste-colorate-natural.test/api/';

export const appStore = defineStore('appStore', {
  state: () => ({
    cart: [] as ProductDTO[],
    deliveryPrice: 20
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

    getUnitPrice(p: ProductDTO) {
      let price = 0;
      if (prices[p.flourType].hasOwnProperty(p.packType)) {
        //@ts-ignore
        price = prices[p.flourType][p.packType] as number;
      };
      return price;
    },

    getPrice(p: ProductDTO) {

      return p.quantity * this.getUnitPrice(p);
    },

    getTotalPrice() {
      let price = 0;
      this.cart.forEach(p => price += this.getPrice(p));
      return price;
    },

    makeOrder(request: any, cb: (success: boolean, data: any) => void) {
      axios
        .post(APIURL + 'new-order', request, { headers: { 'Authorization': accessToken } })
        .then(data => cb(true, data.data))
        .catch(err => cb(false, err?.response?.data))
    },
  }
})
