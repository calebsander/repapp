<template>
  <div>
    <md-toolbar class="md-accent">
      <h2 class="md-title">Upcoming</h2>
      <md-spinner md-indeterminate md-size="40" class="md-accent" v-if="loading"></md-spinner>
    </md-toolbar>
    <md-whiteframe md-elevation="2">
      <md-list>
        <md-list-item>
          <md-button class="md-raised md-accent" :disabled="offset === 0" @click.native="previous">
            <md-icon>chevron_left</md-icon>
          </md-button>
          <md-button class="md-raised md-accent" :disabled="offset + 10 >= count" @click.native="next">
            <md-icon>chevron_right</md-icon>
          </md-button>
          <md-divider></md-divider>
        </md-list-item>
        <md-list-item v-for="visit in upcoming">
          <md-icon>event_available</md-icon>
          <a :href="'/' + visit.uuid">
            {{ visit.college }}
            -
            {{ visit.scheduledTimeStart.toUpcomingString() }}
          </a>
        </md-list-item>
      </md-list>
    </md-whiteframe>
  </div>
</template>

<script>
  import adminFetch from './admin-fetch'

  function addZero(num) {
    if (num < 10) return '0' + String(num)
    return String(num)
  }
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  Date.prototype.toUpcomingString = function() {
    return (
      MONTHS[this.getMonth()] +
      ' ' +
      String(this.getDate()) +
      ' at ' +
      String((this.getHours() + 11) % 12 + 1) +
      ':' +
      addZero(this.getMinutes())
    )
  }

  export default {
    name: 'upcoming-view',
    data() {
      return {
        upcoming: [],
        loading: true,
        offset: 0,
        count: 0 //disables buttons by default
      }
    },
    methods: {
      fetchUpcoming() {
        adminFetch({
          url: '/api/admin/link/upcoming/' + String(this.offset),
          handler: ({visits}) => {
            this.upcoming = visits.map(({college, period: {start}, scheduledDate, uuid}) => {
              const [hour, minute] = start.split(':').map(Number)
              scheduledDate = new Date(scheduledDate)
              const scheduledTimeStart = new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate(), hour, minute)
              return {college, uuid, scheduledTimeStart}
            })
          },
          router: this.$router
        })
      },
      previous() {
        this.offset -= 10
        this.fetchUpcoming()
      },
      next() {
        this.offset += 10
        this.fetchUpcoming()
      }
    },
    mounted() {
      adminFetch({
        url: '/api/admin/link/upcoming/count',
        handler: ({count}) => this.count = count,
        router: this.$router
      })
      this.fetchUpcoming()
    }
  }
</script>