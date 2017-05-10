<template>
  <md-layout>
    <md-layout md-flex="80">
      <calendar-view admin="true" class="fill-container"></calendar-view>
    </md-layout>
    <md-layout>
      <upcoming-view class="fill-container"></upcoming-view>
    </md-layout>
  </md-layout>
</template>

<script>
  import CalendarView from './CalendarView.vue'
  import UpcomingView from './UpcomingView.vue'

  export default {
    name: 'calendar-page',
    components: {
      CalendarView,
      UpcomingView
    }
  }
</script>

<style lang="sass" scoped>
  .fill-container
    flex-grow: 1
</style>