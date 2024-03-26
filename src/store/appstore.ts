// Utilities
import { defineStore } from 'pinia'
import axios from 'axios';

export type FlourType = 'Albă' | 'Integrală' | 'Secară' | 'Năut Solaris' | 'Fulgi de ovăz FG' | 'Năut FG' | 'Linte FG' | 'Mazăre FG';

export interface ProductDTO {
  flourType: FlourType;
  colorType: string;
  packType: string;
  quantity: number;
  unitPrice: number | undefined;
  price: number | undefined;
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
  'Secară': {
    '200 gr': 15,
    '400 gr': 30
  },
  'Fulgi de ovăz FG': {
    '150 gr': 10,
    '300 gr': 20
  },
  'Năut Solaris': {
    '200 gr': 15,
    '400 gr': 30
  },
  'Năut FG': {
    '150 gr': 15,
    '300 gr': 15
  },
  'Mazăre FG': {
    '150 gr': 15,
    '300 gr': 15
  },
  'Linte FG': {
    '150 gr': 15,
    '300 gr': 15
  }
}

const accessToken = 'BJFKELVBJRKELDBNRJKEL';
const APIURL = 'https://api.paste-colorate-natural.ro/api/';

export const appStore = defineStore('appStore', {
  state: () => ({
    cart: [] as ProductDTO[],
    deliveryPrice: 20,
    loading: false
  }),

  actions: {
    addToCart(p: ProductDTO) {
      p.unitPrice = this.getUnitPrice(p);
      p.price = this.getPrice(p);
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

    getColorTypes(flourType: FlourType): string[] {
      switch (flourType) {
        case 'Năut Solaris':
        case 'Mazăre FG':
        case 'Năut FG':
        case 'Linte FG':
            return ['Simplă - fără colorant natural'];

        default:
          return ['Simplă - fără colorant natural', 'Suc de sfeclă Bio', 'Suc de morcovi Bio', 'Extract de afine',
            'Pudră de aronia și apă', 'Pudră de urzici și apă', 'Pudră de Kale și apă'];
      }
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
      this.loading = true;
      axios
        .post(APIURL + 'new-order', request, { headers: { 'Authorization': accessToken } })
        .then(data => cb(true, data.data))
        .catch(err => cb(false, err?.response?.data))
        .finally(() => this.loading = false);
    },
  }
})
