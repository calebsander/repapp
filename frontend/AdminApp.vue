<template>
  <div>
    <md-toolbar>
      <md-button class="md-icon-button" @click.native="toggleSidebar">
        <md-icon>menu</md-icon>
      </md-button>

      <h2 class="md-title">College Rep App > Admin Page</h2>
    </md-toolbar>

    <md-sidenav class="md-left" ref="sidebar">
      <md-toolbar class="md-large">
        <div class="md-toolbar-container">
          <h3 class="md-title">Admin Pages</h3>
        </div>
      </md-toolbar>

      <md-list>
        <md-list-item>
          <router-link to="/admin/calendar" @click.native="toggleSidebar">
            <md-icon>view_week</md-icon>
            Calendar
          </router-link>
        </md-list-item>
        <md-list-item>
          <router-link to="/admin/links" @click.native="toggleSidebar">
            <md-icon>link</md-icon>
            Links
          </router-link>
        </md-list-item>
        <md-list-item>
          <router-link to="/admin/settings" @click.native="toggleSidebar">
            <md-icon>settings</md-icon>
            Settings
          </router-link>
        </md-list-item>
      </md-list>
    </md-sidenav>

    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'admin-app',
    methods: {
      toggleSidebar() {
        this.$refs.sidebar.toggle()
      }
    }
  }
</script>

<style lang="sass">
</style>
