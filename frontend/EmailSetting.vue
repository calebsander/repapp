<template>
  <div>
    <md-checkbox v-model="checked" :disabled="loading">{{ label }}</md-checkbox>
    <md-spinner md-indeterminate md-size="30" class="md-accent" v-show="loading"></md-spinner>
  </div>
</template>

<script>
  import adminFetch from './admin-fetch'

  export default {
    name: 'email-setting',
    props: ['setting', 'on', 'label'],
    data() {
      return {
        checked: this.on,
        loading: false
      }
    },
    watch: {
      checked() {
        this.loading = true
        adminFetch({
          url: '/api/admin/settings/set',
          data: {
            setting: this.setting,
            on: this.checked
          },
          handler: () => this.loading = false,
          router: this.$router
        })
      }
    }
  }
</script>