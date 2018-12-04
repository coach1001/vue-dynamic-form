<template>
  <b-row align-h="center">
    <b-col lg="5" md="8" sm="12">
      <b-card border-variant="primary" header="Login" class="shadow-lg" header-bg-variant="primary" header-text-variant="white">
        <b-form @submit.prevent="onSubmit">
          <b-form-group :invalid-feedback="errors.first('email')"
                        :state="$fieldUtils.checkErrors('email', errors, $veeFields)"
                        label="Email address:">
            <b-form-input :state="$fieldUtils.checkErrors('email', errors, $veeFields)"
                          v-model="loginForm.userEmaiAddress"
                          @input="loginError = null"
                          placeholder="Enter email"
                          v-validate="'required|email'"
                          name="email"
                          type="text">
            </b-form-input>
          </b-form-group>
          <b-form-group :invalid-feedback="errors.first('password')"
                        :state="$fieldUtils.checkErrors('password', errors, $veeFields)"
                        label="Email address:">
            <b-form-input :state="$fieldUtils.checkErrors('password', errors, $veeFields)"
                          v-model="loginForm.userPassword"
                          @input="loginError = null"
                          placeholder="Enter password"
                          v-validate="'required|min:6'"
                          name="password"
                          type="password">
            </b-form-input>
          </b-form-group>
          <div class="mb-3">  
            <span class="text-danger">{{ loginError }}</span>
          </div>
          <b-button class="btn-block" type="submit" variant="primary">Sign in</b-button>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import to from 'await-to-js';
const firebase = require('../firebase/firebaseConfig.js');

export default {
  name: 'UserAccessPage',
  data() {
    return {
      loginForm: {
        userEmaiAddress: '',
        userPassword: ''
      },
      loginError: null
    };
  },
  methods: {
    onSubmit() {
      if (
        this.errors.items.length <= 0 &&
        this.loginForm.userEmaiAddress !== '' &&
        this.loginForm.userPassword !== ''
      ) {
        this.login();
      } else {
        this.$fieldUtils.markAllFiedsAsDirty(this.$veeFields)
        this.$validator.validateAll();
      }
    },
    async login() {
      this.$store.commit('setShowLoader', true);
      let err, response;
      [err, response] = await to(
        firebase.auth.signInWithEmailAndPassword(
          this.loginForm.userEmaiAddress,
          this.loginForm.userPassword
        )
      );
      if (err) {
        this.$store.commit('setShowLoader', false);
        this.$store.commit('setBackendError', err);
        this.loginError = 'Invalid Username or Password';
      } else {
        this.$store.commit('setCurrentUser', response.user);
        await this.$store.dispatch('fetchUserProfile');
        this.$router.push('/search');
      }
    }
  }
};
</script>

<style scoped>
</style>