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
            <a v-bind:href="link.url">
              {{ link.uuid }}
            </a>
          </md-table-cell>
          <md-table-cell>
            <span v-if="link.scheduledTime">
              Scheduled for
              {{ link.scheduledTime[0].getMonth() + 1 }}/{{ link.scheduledTime[0].getDate() }}
            </span>
            <span v-else>
              <span v-if="link.lastSignedIn">
                Last signed in on
                {{ link.lastSignedIn.getMonth() + 1 }}/{{ link.lastSignedIn.getDate() }}
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
        </md-table-row>
      </md-table-body>
    </md-table>

    <md-dialog-alert :md-content='selectedNotes' md-ok-text="Close" ref="notesDialog">
    </md-dialog-alert>

    <md-dialog md-open-from="#new-link" md-close-to="#new-link" ref='linkForm'>
      <md-dialog-title>Create new link</md-dialog-title>
      <md-dialog-content>
        <form>
          <md-input-container>
            <label>College</label>
            <md-input required v-model="linkForm.college"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Rep name</label>
            <md-input v-model="linkForm.repName"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Tier</label>
            <md-select required v-model="linkForm.tier">
              <md-option v-for="tier in tiers" v-bind:value="tier.priority">
                {{ tier.description }}
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
  </div>
</template>

<script>
  const MAX_NOTES_LENGTH = 40
  const ELLIPSIS = '...'
  class Link {
    constructor({college, repName, uuid, lastSignedIn, scheduledTime, notesFromCollege, notesFromCollegeSeen}) {
      this.college = college
      this.repName = repName
      this.uuid = uuid
      this.lastSignedIn = lastSignedIn
      this.scheduledTime = scheduledTime
      this.notesFromCollege = notesFromCollege
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
    return {
      college: '',
      repName: '',
      tier: tiers[0].priority,
      notesToCollege: ''
    }
  }
  export default {
    name: 'links-view',
    data() {
      const tiers = [ //will eventually be populated from a request
        {priority: 1, description: 'High'},
        {priority: 2, description: 'Low'}
      ]
      return {
        links: [ //will eventually be populated from a request
          new Link({
            college: 'Swarthmore',
            repName: 'Josh Throckmorton',
            uuid: 'abcdef',
            lastSignedIn: null,
            scheduledTime: null,
            notesFromCollege: 'Long notes string, hoping this gets cut off',
            notesFromCollegeSeen: true
          }),
          new Link({
            college: 'UMass Amherst',
            repName: null,
            uuid: '123456',
            lastSignedIn: new Date,
            scheduledTime: [new Date, new Date(new Date().getTime() + 40 * 60 * 1000)],
            notesFromCollege: 'Blah blah blah',
            notesFromCollegeSeen: false
          }),
          new Link({
            college: 'University of Toronto',
            repName: 'John',
            uuid: 'efefef',
            lastSignedIn: new Date,
            scheduledTime: null,
            notesFromCollege: 'Long notes string, hoping this gets cut off',
            notesFromCollegeSeen: false
          })
        ],
        tiers,
        linkForm: emptyLinkForm(tiers),
        waitingForLink: false,
        selectedNotes: "Click on a college's notes" //should never be shown to the user
      }
    },
    methods: {
      openNotes(link) {
        this.selectedNotes = link.notesFromCollege
        this.$refs.notesDialog.open()
      },
      openLinkForm() {
        this.$refs.linkForm.open()
      },
      closeLinkForm() {
        this.$refs.linkForm.close()
      },
      createLink() {
        this.waitingForLink = true
        setTimeout(() => { //will eventually actually send a request, so we simulate it here
          this.closeLinkForm()
          this.waitingForLink = false
          this.linkForm = emptyLinkForm(this.tiers)
        }, 1000)
      }
    }
  }
</script>

<style lang="sass" scoped>
  span.unseen
    background: yellow
</style>