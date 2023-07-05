<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <h1>Coșul de cumpărături</h1>


    </v-responsive>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
//import { profileStore } from '@/stores/profileStore';

export default defineComponent({
  components: {
  },
  data() {
    return {
      //profileStore: profileStore(),

      profile: {
        email: 'paulhoratiustan@gmail.com' as string,

        name: 'Paul Stan' as string,
        dob: '1984-06-18' as string,
        sex: 'M',
        weight: 75,
        height: 175,
        runGoal: 200
      },
      error: () => undefined,
      valid: false,
      nameRules: [
        (v: any) => (v || '').length <= 50 || 'Maxim 50 de caractere!',
        (v: any) => !!v || 'Obligatoriu!',
        () => !this.error()?.name || this.error()?.name[0],
      ],
    }
  },

  methods: {
    
  },

  mounted() {
    
  },
});
</script>
