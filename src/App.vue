<template>
  <v-row justify="center">
    <v-col md="8" cols="12" align="center">
      <h1>Comandă paste colorate natural</h1>
      <h2>Formular de comandă</h2>
    </v-col>
  </v-row>

  <v-row justify="center">
    <v-col md="8" cols="12">
      <v-form ref="form" v-model="valid" class="user">
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

      </v-form>
    </v-col>
  </v-row>
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
      //appStore: appStore(),
      error: undefined,
      email: undefined,
      name: undefined,
      phone: undefined,
      valid: false,
      nameRules: [
        (v: any) => (v || '').length <= 200 || 'A maximum of 200 characters is allowed.',
        (v: any) => !!v || 'E-mail is required',
        (v: any) => /.+@.+/.test(v) || 'E-mail must be valid',
        // @ts-ignore
        (v: any) => !this.error?.email || this.error.email[0],
      ],
      emailRules: [
        (v: any) => (v || '').length <= 200 || 'A maximum of 200 characters is allowed.',
        (v: any) => !!v || 'E-mail is required',
        (v: any) => /.+@.+/.test(v) || 'E-mail must be valid',
        // @ts-ignore
        (v: any) => !this.error?.email || this.error.email[0],
      ],
      phoneRules: [
        (v: any) => (v || '').length <= 200 || 'A maximum of 200 characters is allowed.',
        (v: any) => !!v || 'E-mail is required',
        (v: any) => /.+@.+/.test(v) || 'E-mail must be valid',
        // @ts-ignore
        (v: any) => !this.error?.email || this.error.email[0],
      ],
    }
  },

  methods: {
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
