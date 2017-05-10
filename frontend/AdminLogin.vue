<template>
  <div>
    <md-dialog ref="login" @close="openLogIn(true)"> <!--disabling click outside to close doesn't seem to do anything-->
      <md-dialog-title>Login</md-dialog-title>
      <md-dialog-content>
        <md-input-container>
          <label>E-mail</label>
          <md-input type="email" required v-model="email"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Password</label>
          <md-input type="password" required v-model="password"></md-input>
        </md-input-container>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click.native="logIn">Log in</md-button>
      </md-dialog-actions>
    </md-dialog>
    <!--Logs annoying errors if content is empty-->
    <md-dialog-alert ref="loginError" md-title="Error loging in" :md-content="loginError || ' '"></md-dialog-alert>
  </div>
</template>

<script>
  export default {
    name: 'admin-login',
    data() {
      return {
        loggedIn: false,
        email: '',
        password: '',
        loginError: ''
      }
    },
    methods: {
      openLogIn(delay) {
        if (this.loggedIn) return //to avoid reopening after successful login

        const waitTime = (() => {
          if (delay) return 450
          else return 0
        })()
        setTimeout(
          () => this.$refs.login.open(),
          waitTime //must wait for it to close first
        )
      },
      logIn() {
        fetch('/api/login', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          }),
          credentials: 'include'
        })
          .then(response => response.json())
          .then(({success, message}) => {
            if (success) {
              this.loggedIn = true
              this.$refs.login.close()
              this.redirectAfterLogIn()
            }
            else {
              this.loginError = message
              this.$refs.loginError.open()
            }
          })
      },
      redirectAfterLogIn() {
        this.$router.push('/admin/calendar')
      }
    },
    mounted() {
      fetch('/api/logged-in', {credentials: 'include'})
        .then(response => response.json())
        .then(({success, loggedIn}) => {
          if (success && loggedIn) this.redirectAfterLogIn()
          else this.openLogIn(false)
        })
    }
  }
</script>