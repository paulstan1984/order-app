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
        <v-select v-model="packType" :items="packTypes" label="Ambalaj" :rules="packTypeRules"></v-select>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col md="8" cols="12" align="center">
        <v-btn color="success" class="btn btn-primary btn-user btn-block" @click="AddToCart()">
          Adaugă în coș
        </v-btn>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col md="8" cols="12" align="center">
        <h2>Coșul de cumpărături</h2>


      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col md="8" cols="12" align="center">
        <h2>Detalii cumpărător</h2>
        <div class="form-group">
          <v-text-field v-model="name" :counter="200" :rules="nameRules" label="Nume" required></v-text-field>
        </div>

        <div class="form-group">
          <v-text-field v-model="email" :counter="200" :rules="emailRules" label="Email" required></v-text-field>
        </div>

        <div class="form-group">
          <v-text-field v-model="phone" :counter="200" :rules="phoneRules" label="Telefon" required></v-text-field>
        </div>

        <v-btn color="success" class="btn btn-primary btn-user btn-block" @click="Submit()">
          Comandă
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// @ts-ignore
//import { appStore } from '@/stores/appstore.ts';

export default defineComponent({
  components: {

  },

  data() {
    return {
      flourTypes: ['Albă', 'Integrală', 'Fără gluten'],
      colorTypes: ['Suc de sfeclă Bio', 'Suc de morcovi Bio', 'Extract de afine',
        'Pudră de aronia și apă', 'Pudră de urzici și apă', 'Pudră de Kale și apă'],
      pastaTypes: ['Tagliatelle', "Spaghete"],
      packTypes: ['100 gr', '250 gr', '400 gr'],
      flourType: '',
      colorType: '',
      pastaType: '',
      packType: '',
      //appStore: appStore(),
      error: undefined,
      email: undefined,
      name: undefined,
      phone: undefined,
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
    }
  },

  methods: {
    AddToCart() {

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
