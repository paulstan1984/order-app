<template>
  <v-img src="https://paste-colorate-natural.ro/wp-content/uploads/2023/07/paste-cu-faina-alba-varsate.jpeg"
    height="200px" width="100%" cover />

  <v-row justify="center">
    <v-col md="8" cols="12" align="center">
      <v-btn color="success" class="btn btn-primary btn-user btn-block mt-5" href="https://paste-colorate-natural.ro">
        <font-awesome-icon :icon="backIcon" size="1x" />
        Înapoi la site
      </v-btn>
    </v-col>
  </v-row>

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
        <v-select v-model="colorType" :items="appStore.getColorTypes(flourType)" label="Colorant Natural"
          :rules="colorTypeRules"></v-select>
      </v-col>
    </v-row>

    <v-row justify="center">
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
              <td>
                {{ p.packType }} cu făină {{ p.flourType }} și {{ p.colorType }}
              </td>
              <td class="text-right" nowrap>{{ appStore.getUnitPrice(p) }} Lei</td>
              <td class="text-right" nowrap>
                <v-text-field v-model="p.quantity" @keypress="digits($event)" min="1" type="number"></v-text-field>
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
          <v-text-field v-model="email" :counter="200" :rules="emailRules" label="Email" persistent-hint
            hint="opțional"></v-text-field>
        </div>
      </v-col>

      <v-col md="4" cols="12">
        <div class="form-group">
          <v-text-field v-model="phone" @keypress="digits($event)" type="number" :counter="13" :rules="phoneRules"
            label="Telefon" required></v-text-field>
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
        <strong>Mulțimesc!</strong> <br /> <br />
        Te voi contacta curând pentru confirmarea comenzii și a livrării.
        <br /><br />
        O zi frumoasă, <br />
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
        <strong>Eroare</strong> <br /> <br />
        Ceva nu a funcționat corect. Te rog să mai încerci. Dacă problema persistă te rog să mă contactezi la telefon
        0742321007.
        <br /><br />
        O zi frumoasă, <br />
        Ioana!

        <br /><br />
        <v-expansion-panels>
          <v-expansion-panel title="Erori">
            <v-expansion-panel-text>
              <v-alert v-for="(err, index) in errors" :key="index" type="error" variant="tonal" class="text-left">{{ err
              }}</v-alert>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="errorDialog = false">Închide</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <div class="loader-wrapper" v-if="appStore.loading">
    <div class="loader">
      <font-awesome-icon :icon="faSpinner" size="2x" :spin="true" />
    </div>
  </div>
</template>


<style scoped>
.loader {
  font-size: 40px;
  position: fixed;
  z-index: 999;
  top: 30%;
  left: 40%;
}

.loader-wrapper {
  display: block;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: #FFFFFF;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import { faBackward, faCartShopping, faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// @ts-ignore
import { appStore, FlourType, ProductDTO } from '@/store/appstore.ts';

export default defineComponent({
  components: {

  },

  data() {
    return {
      flourTypes: ['Albă', 'Integrală', 'Secară', 'Năut Solaris', 'Fulgi de ovăz FG', 'Năut FG', 'Linte FG', 'Mazăre FG'],
      flourType: '' as FlourType,
      colorType: '',
      pastaType: '',
      packType: '' as string,

      cartIcon: faCartShopping,
      faSpinner: faSpinner,
      backIcon: faArrowLeft,

      appStore: appStore(),
      errors: [] as string[],
      email: undefined,
      name: undefined,
      phone: undefined as undefined | number,
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
      this.colorType = this.appStore.getColorTypes(val)[0];
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

    digits: function (evt: any) {
      evt = (evt) ? evt : window.event;
      let expect = evt.target.value.toString() + evt.key.toString();

      if (!/^[-+]?[0-9]*\.?[0-9]*$/.test(expect)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

    AddToCart() {
      //@ts-ignore 
      this.$refs.form.validate();
      if (this.valid) {
        this.appStore.addToCart({
          flourType: this.flourType as FlourType,
          colorType: this.colorType,
          packType: this.packType,
          quantity: 1
        } as ProductDTO)
      }
    },
    RemoveFromCart(index: number) {
      this.appStore.removeFromCart(index);
    },
    Submit() {
      //@ts-ignore 
      this.$refs.orderForm.validate();

      if (!this.validOrderForm) {
        return;
      }

      this.appStore.cart.forEach(p => p.price = this.appStore.getPrice(p));

      const request = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        description: this.description,
        cart: this.appStore.cart,
        totalPrice: this.appStore.getTotalPrice(),
        deliveryPrice: this.appStore.deliveryPrice
      };

      this.appStore.makeOrder(request, (success: boolean, data: any) => {
        if (success) {
          this.successDialog = true;
          window.scroll(0, 0);
        } else {
          let errors = new Array() as string[];

          Object.keys(data).forEach(function (key, index) {
            errors.push(data[key].join(', '));
          });

          this.errors = errors;

          this.errorDialog = true;
          //@ts-ignore 
          this.$refs.orderForm.validate();
        }
      });
    },
  },
})
</script>
