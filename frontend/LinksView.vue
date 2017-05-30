<template>
  <div>
    <md-button class="md-raised md-primary" id="new-link" @click.native="openLinkForm">
      New Link
    </md-button>
    <md-table>
      <md-table-header>
        <md-table-row>
          <md-table-head>College</md-table-head>
          <md-table-head>Rep name</md-table-head>
          <md-table-head>Link</md-table-head>
          <md-table-head>Status</md-table-head>
          <md-table-head>Notes</md-table-head>
          <md-table-head>Delete</md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row v-for="(link, index) in links">
          <md-table-cell>
            <b>{{ link.college }}</b>
          </md-table-cell>
          <md-table-cell>
            <span v-if="link.repName">
              {{ link.repName }}
            </span>
          </md-table-cell>
          <md-table-cell>
            <a :href="link.url">
              {{ link.uuid }}
            </a>
          </md-table-cell>
          <md-table-cell>
            <span v-if="link.scheduledDate">
              Scheduled for
              {{ link.scheduledDate.toMMDD() }}
            </span>
            <span v-else>
              <span v-if="link.lastSignedIn">
                Last signed in on
                {{ link.lastSignedIn.toMMDD() }}
              </span>
              <span v-else>
                Never logged in
              </span>
            </span>
          </md-table-cell>
          <md-table-cell @click.native="openNotes(link)">
            <span :class="link.notesFromCollegeSeen ? null : 'unseen'">
              {{ link.shortenedNotes }}
            </span>
            <md-icon>message</md-icon>
          </md-table-cell>
          <md-table-cell>
            <md-icon @click.native="deleteLink(index)">delete</md-icon>
          </md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>

    <!--Logs annoying errors if content is empty-->
    <md-dialog-alert :md-content="selectedNotes || ' '" md-ok-text="Close" ref="notesDialog">
    </md-dialog-alert>

    <md-dialog md-open-from="#new-link" md-close-to="#new-link" ref="linkForm">
      <md-dialog-title>Create new link</md-dialog-title>
      <md-dialog-content>
        <form>
          <md-input-container>
            <label>College</label>
            <md-input required v-model="linkForm.college" ref="college"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Rep name</label>
            <md-input v-model="linkForm.repName"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Tier</label>
            <md-select required v-model="linkForm.tier">
              <md-option v-for="tier in tiers" :value="tier.priority">
                {{ tier.collegeDescription }}
              </md-option>
            </md-select>
          </md-input-container>
          <md-input-container>
            <label>Notes to college</label>
            <md-textarea v-model="linkForm.notesToCollege"></md-textarea>
          </md-input-container>
        </form>
      </md-dialog-content>
      <md-dialog-actions>
        <md-spinner md-indeterminate v-show="waitingForLink"></md-spinner>
        <md-button class="md-primary" @click.native="closeLinkForm">Cancel</md-button>
        <md-button class="md-primary" @click.native="createLink">Create</md-button>
      </md-dialog-actions>
    </md-dialog>
    <!--Logs annoying errors if content is empty-->
    <md-dialog-alert ref="creationError" md-title="Error creating link" :md-content="linkForm.error || ' '"></md-dialog-alert>
  </div>
</template>

<script>
  import adminFetch from './admin-fetch'

  Date.prototype.toMMDD = function() {
    return String(this.getMonth() + 1) + '/' + String(this.getDate())
  }
  function parseDate(date) {
    if (date === null) return null
    return new Date(date)
  }
  const MAX_NOTES_LENGTH = 40
  const ELLIPSIS = '...'
  class Link {
    constructor({college, repName, uuid, lastSignedIn, scheduledDate, notesFromCollege, notesFromCollegeSeen}) {
      this.college = college
      this.repName = repName
      this.uuid = uuid
      this.lastSignedIn = parseDate(lastSignedIn)
      this.scheduledDate = parseDate(scheduledDate)
      this.notesFromCollege = notesFromCollege || ''
      this.notesFromCollegeSeen = notesFromCollegeSeen
    }
    get url() {
      return '/' + this.uuid
    }
    get shortenedNotes() {
      const notes = this.notesFromCollege
      if (notes.length > MAX_NOTES_LENGTH) {
        return notes.substring(0, MAX_NOTES_LENGTH - ELLIPSIS.length) + ELLIPSIS
      }
      else return notes
    }
  }
  function emptyLinkForm(tiers) {
    const tierPriority = (() => {
      if (tiers[0]) return tiers[0].priority
      else return null
    })()
    return {
      college: '',
      repName: '',
      tier: tierPriority,
      notesToCollege: '',
      error: null
    }
  }
  export default {
    name: 'links-view',
    data() {
      return {
        links: [],
        tiers: [],
        linkForm: emptyLinkForm([]),
        waitingForLink: false,
        selectedNotes: null
      }
    },
    methods: {
      refreshLinks() {
        adminFetch({
          url: '/api/admin/link/all',
          handler: ({links}) => {
            this.links = links.map(link => new Link(link))
          },
          router: this.$router
        })
      },
      getTiers() {
        adminFetch({
          url: '/api/admin/tiers/college',
          handler: ({tiers}) => {
            this.tiers = tiers
            this.linkForm = emptyLinkForm(tiers)
          },
          router: this.$router
        })
      },
      openNotes(link) {
        this.selectedNotes = link.notesFromCollege
        this.$refs.notesDialog.open()
        if (link.notesFromCollegeSeen) return //had already seen the notes
        link.notesFromCollegeSeen = true
        adminFetch({
          url: '/api/admin/link/read-notes/' + link.uuid,
          router: this.$router
        })
      },
      openLinkForm() {
        this.$refs.linkForm.open()
        setTimeout(() => this.$refs.college.$el.focus(), 300)
      },
      closeLinkForm() {
        this.$refs.linkForm.close()
      },
      createLink() {
        let error = null
        if (!this.linkForm.college) error = 'Please specify a college'
        this.linkForm.error = error
        if (error) {
          this.$refs.creationError.open()
          return
        }

        adminFetch({
          url: '/api/admin/link',
          data: {
            college: this.linkForm.college,
            repName: this.linkForm.repName || null,
            tierPriority: this.linkForm.tier,
            notesToCollege: this.linkForm.notesToCollege || null
          },
          handler: () => {
            this.closeLinkForm()
            this.waitingForLink = false
            this.linkForm = emptyLinkForm(this.tiers)
            this.refreshLinks()
          },
          router: this.$router
        })
        this.waitingForLink = true
      },
      deleteLink(index) {
        const link = this.links[index]
        adminFetch({
          url: '/api/admin/link/' + link.uuid,
          method: 'DELETE',
          handler: () => this.links.splice(index, 1),
          router: this.$router
        })
      }
    },
    mounted() {
      this.refreshLinks()
      this.getTiers()
    }
  }
</script>

<style lang="sass" scoped>
  span.unseen
    background: yellow
</style>