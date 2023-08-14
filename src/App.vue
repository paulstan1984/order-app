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
        <v-select v-model="packType" :items="appStore.getPackTypes(flourType)" label="Ambalaj" :rules="packTypeRules"></v-select>
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

    <div v-if="appStore?.cart?.length > 0">

      <v-row justify="center">
        <v-col md="8" cols="12" align="center">
          <h2>Coșul de cumpărături</h2>

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
                <td>{{ p.packType }} de {{p.pastaType }} cu făină {{p.flourType }} și {{ p.colorType }}</td>
                <td class="text-right" nowrap></td>
                <td class="text-right" nowrap>{{ p.quantity }}</td>
                <td class="text-right" nowrap></td>
                <td>
                  <v-btn size="small" variant="flat" class="btn" color="red" @click="RemoveFromCart(index)">
                    <font-awesome-icon :icon="cartIcon" size="1x" />
                  </v-btn>
                </td>
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
            <v-text-field v-model="email" :counter="200" :rules="emailRules" label="Email" required></v-text-field>
          </div>

        </v-col>

        <v-col md="4" cols="12">
          <div class="form-group">
            <v-text-field v-model="phone" :counter="200" :rules="phoneRules" label="Telefon" required></v-text-field>
          </div>
        </v-col>

        <v-col md="8" cols="12">

          <div class="form-group">
            <v-textarea v-model="description" :counter="5000" :rules="descriptionRules" label="Observații"></v-textarea>
          </div>


          <v-btn color="success" class="btn btn-primary btn-user btn-block" @click="Submit()">
            Comandă
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
// @ts-ignore
import { appStore, FlourType } from '@/store/appstore.ts';

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
      colorTypeRules: [(v: any) => !!v || 'Obligatoriu'],
      flourTypeRules: [(v: any) => !!v || 'Obligatoriu'],
      packTypeRules: [(v: any) => !!v || 'Obligatoriu'],
      pastaTypeRules: [(v: any) => !!v || 'Obligatoriu'],

      nameRules: [
        (v: any) => (v || '').length <= 200 || 'A maximum of 200 characters is allowed.',
        (v: any) => !!v || 'Obligatoriu',
        (v: any) => /.+@.+/.test(v) || 'E-mail must be valid',
        // @ts-ignore
        (v: any) => !this.error?.email || this.error.email[0],
      ],
      emailRules: [
        (v: any) => (v || '').length <= 200 || 'A maximum of 200 characters is allowed.',
        (v: any) => !!v || 'Obligatoriu',
        (v: any) => /.+@.+/.test(v) || 'E-mail must be valid',
        // @ts-ignore
        (v: any) => !this.error?.email || this.error.email[0],
      ],
      phoneRules: [
        (v: any) => (v || '').length <= 200 || 'A maximum of 200 characters is allowed.',
        (v: any) => !!v || 'Obligatoriu',
        (v: any) => /.+@.+/.test(v) || 'E-mail must be valid',
        // @ts-ignore
        (v: any) => !this.error?.email || this.error.email[0],
      ],
      descriptionRules: [
        (v: any) => (v || '').length <= 5000 || 'Sunt permise maxim 5000 caractere.',
      ],
    }
  },

  methods: {
    AddToCart() {
      this.appStore.addToCart({
        flourType: this.flourType as FlourType,
        colorType: this.colorType,
        pastaType: this.pastaType,
        packType: this.packType,
        quantity: 1
      })
    },
    RemoveFromCart(index: number) { 
      this.appStore.removeFromCart(index);
    },
    Submit() {
      const s = { email: this.email };
      this.appStore.forgotPassword(s, (success: boolean, data: any) => {
        if (success) {
          alert('Your received an email with the password reset link.');
          this.$router.push('/login');
        } else {
          this.error = data;
          console.log(this.error);
          //@ts-ignore 
          this.$refs.form.validate();
        }
      });
    },
  },
})
</script>
@/store/appstore