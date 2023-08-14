<template>
  <v-row justify="center">
    <v-col md="8" cols="12" align="center">
      <h1>Paste colorate natural</h1>
      <h2>Formular de comandă</h2>
    </v-col>
  </v-row>


  <v-form ref="form" v-model="valid" class="user">
    <v-row justify="center">
      <v-col md="4" cols="12">
        <v-select v-model="flourType" :items="flourTypes" label="Tip Făină" :rules="flourTypeRules"></v-select>
      </v-col>

      <v-col md="4" cols="12">
        <v-select v-model="colorType" :items="colorTypes" label="Colorant Natural" :rules="colorTypeRules"></v-select>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col md="4" cols="12">
        <v-select v-model="pastaType" :items="pastaTypes" label="Tip de paste" :rules="pastaTypeRules"></v-select>
      </v-col>

      <v-col md="4" cols="12">
        <v-select v-model="packType" :items="appStore.getPackTypes(flourType)" label="Ambalaj"
          :rules="packTypeRules"></v-select>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col md="8" cols="12" align="center">
        <v-btn color="success" class="btn btn-primary btn-user btn-block" @click="AddToCart()">
          <font-awesome-icon :icon="cartIcon" size="1x" />
          Adaugă în coș
        </v-btn>
      </v-col>
    </v-row>
  </v-form>


  <v-form ref="orderForm" v-model="validOrderForm" v-if="appStore?.cart?.length > 0">

    <v-row justify="center">
      <v-col md="8" cols="12" align="center">
        <h2>Coșul de cumpărături</h2>

        <v-alert type="info" variant="tonal" class="text-left">La cumpărături de peste {{ appStore.deliveryPrice }} Lei
          transportul este gratuit.</v-alert>

        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                Produs
              </th>
              <th class="text-right" nowrap>Preț unitar</th>
              <th class="text-right" nowrap>
                Cantitate
              </th>
              <th class="text-right" nowrap>Preț</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, index) in appStore.cart" :key="index">
              <td>{{ p.packType }} de {{ p.pastaType }} cu făină {{ p.flourType }} și {{ p.colorType }}</td>
              <td class="text-right" nowrap>{{ appStore.getUnitPrice(p) }} Lei</td>
              <td class="text-right" nowrap>
                <v-text-field v-model="p.quantity" min="1" type="number"></v-text-field>
              </td>
              <td class="text-right" nowrap>{{ appStore.getPrice(p) }} Lei</td>
              <td>
                <v-btn size="small" variant="flat" class="btn" color="red" @click="RemoveFromCart(index)">
                  <font-awesome-icon :icon="cartIcon" size="1x" />
                </v-btn>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                Total
              </td>
              <td class="text-right" nowrap>
                {{ appStore.getTotalPrice() }} Lei
              </td>
              <td></td>
            </tr>

            <tr v-if="appStore.getTotalPrice() < 100">
              <td colspan="3">
                Transport
              </td>
              <td class="text-right" nowrap>
                {{ appStore.deliveryPrice }} Lei
              </td>
              <td></td>
            </tr>

            <tr v-if="appStore.getTotalPrice() < 100">
              <td colspan="3">
                Total de plată
              </td>
              <td class="text-right" nowrap>
                {{ appStore.getTotalPrice() + appStore.deliveryPrice }} Lei
              </td>
              <td></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col md="8" cols="12" align="center">
        <h2>Detalii cumpărător</h2>
        <div class="form-group">
          <v-text-field v-model="name" :counter="200" :rules="nameRules" label="Nume" required></v-text-field>
        </div>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col md="4" cols="12">
        <div class="form-group">
          <v-text-field v-model="email" :counter="200" :rules="emailRules" label="Email" persistent-hint hint="opțional"></v-text-field>
        </div>
      </v-col>

      <v-col md="4" cols="12">
        <div class="form-group">
          <v-text-field v-model="phone" type="number" :counter="13" :rules="phoneRules" label="Telefon" required></v-text-field>
        </div>
      </v-col>

      <v-col md="8" cols="12" align="center">

        <v-alert type="info" variant="tonal" class="text-left">Vă rog să precizați adresa de livrare în secțiunea de
          Observații.</v-alert>
        <div class="form-group">
          <v-textarea v-model="description" :counter="5000" :rules="descriptionRules" label="Observații"></v-textarea>
        </div>
        <v-btn color="success" class="btn btn-primary btn-user btn-block" @click="Submit()">
          Comandă
        </v-btn>
      </v-col>
    </v-row>
  </v-form>

  <v-dialog v-model="successDialog" width="auto">
    <v-card>
      <v-card-text>
        <strong>Mulțimesc!</strong> <br/> <br/>
        Te voi contacta curând pentru confirmarea comenzii și a livrării. 
        <br/><br/>
        O zi frumoasă, <br/> 
        Ioana!
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="clearOrder()">Închide</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="errorDialog" width="auto">
    <v-card>
      <v-card-text>
        <strong>Eroare</strong> <br/> <br/>
        Ceva nu a funcționat corect. Te rog să mai încerci. Dacă problema persistă te rog să mă contactezi la telefon 0742321007.
        <br/><br/>
        O zi frumoasă, <br/> 
        Ioana!
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="errorDialog = false">Închide</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
// @ts-ignore
import { appStore, FlourType } from '@/store/appstore.ts';
import { throwStatement } from '@babel/types';

export default defineComponent({
  components: {

  },

  data() {
    return {
      flourTypes: ['Albă', 'Integrală', 'Fără gluten'],
      colorTypes: ['Suc de sfeclă Bio', 'Suc de morcovi Bio', 'Extract de afine',
        'Pudră de aronia și apă', 'Pudră de urzici și apă', 'Pudră de Kale și apă'],
      pastaTypes: ['Tagliatelle', "Spaghete"],
      flourType: '' as FlourType,
      colorType: '',
      pastaType: '',
      packType: '' as string,

      cartIcon: faCartShopping,

      appStore: appStore(),
      error: undefined,
      email: undefined,
      name: undefined,
      phone: undefined,
      description: '',
      valid: false,
      validOrderForm: false,
      successDialog: false,
      errorDialog: false,
      colorTypeRules: [(v: any) => !!v || 'Obligatoriu'],
      flourTypeRules: [(v: any) => !!v || 'Obligatoriu'],
      packTypeRules: [(v: any) => !!v || 'Obligatoriu'],
      pastaTypeRules: [(v: any) => !!v || 'Obligatoriu'],

      nameRules: [
        (v: any) => (v || '').length <= 200 || 'Sunt permise maxim 200 de caractere.',
        (v: any) => !!v || 'Obligatoriu',
        // @ts-ignore
        (v: any) => !this.error?.name || this.error.name[0],
      ],
      emailRules: [
        (v: any) => (v || '').length <= 200 || 'Sunt permise maxim 200 de caractere.',
        (v: any) => !v || /.+@.+/.test(v) || 'Trebuie o adresă de E-mail corectă.',
        // @ts-ignore
        (v: any) => !this.error?.email || this.error.email[0],
      ],
      phoneRules: [
        (v: any) => (v || '').length <= 13 || 'Sunt permise maxil 12 caractere.',
        (v: any) => !!v || 'Obligatoriu',
        // @ts-ignore
        (v: any) => !this.error?.email || this.error.email[0],
      ],
      descriptionRules: [
        (v: any) => (v || '').length <= 5000 || 'Sunt permise maxim 5000 caractere.',
      ],
    }
  },

  watch: {
    flourType: function (val) {
      this.packType = this.appStore.getPackTypes(val)[0];
    },
  },

  methods: {
    clearOrder() {
      this.appStore.cart = [];
      this.successDialog = false;
      this.name = undefined;
      this.email = undefined;
      this.phone = undefined;
      this.description = '';
      this.flourType = '' as FlourType;
      this.colorType = '';
      this.pastaType = '';
      this.packType = '';
      //@ts-ignore
      this.$refs.form.reset();
    },

    AddToCart() {
      //@ts-ignore 
      this.$refs.form.validate();
      if (this.valid) {
        this.appStore.addToCart({
          flourType: this.flourType as FlourType,
          colorType: this.colorType,
          pastaType: this.pastaType,
          packType: this.packType,
          quantity: 1
        })
      }
    },
    RemoveFromCart(index: number) {
      this.appStore.removeFromCart(index);
    },
    Submit() {
      //@ts-ignore 
      this.$refs.orderForm.validate();

      const request = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        description: this.description,
        cart: this.appStore.cart
      };

      this.appStore.makeOrder(request, (success: boolean, data: any) => {
        if (success) {
          this.successDialog = true;
        } else {
          this.error = data;
          this.errorDialog = true;
          //@ts-ignore 
          this.$refs.orderForm.validate();
        }
      });
    },
  },
})
</script>
