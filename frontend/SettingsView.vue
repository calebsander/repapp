<template>
  <div>
    <md-layout md-align="center" md-gutter="8">
      <md-layout>
        <md-card>
          <md-card-header>
            <div class="md-title">Manage admins</div>
          </md-card-header>
          <md-card-content>
            <md-button class="md-raised md-accent" @click.native="openAdminForm" id="new-admin">
              <md-icon>add</md-icon>
            </md-button>
            <md-list>
              <md-list-item class="list-item-row">
                You (cannot delete)
                <md-button class="md-raised left-spaced" @click.native="changePassword" id="password">
                  <md-icon>lock_outline</md-icon>
                </md-button>
              </md-list-item>
              <md-list-item class="list-item-row" v-for="admin in admins">
                {{ admin }}
                <md-button class="md-raised left-spaced" @click.native="deleteAdmin(admin)">
                  <md-icon>delete</md-icon>
                </md-button>
              </md-list-item>
            </md-list>
          </md-card-content>
        </md-card>
      </md-layout>
      <md-layout>
        <md-card>
          <md-card-header>
            <div class="md-title">Email preferences</div>
          </md-card-header>
          <md-card-content>
            <div v-if="emailSettings">
              <email-setting v-for="(on, setting) in emailSettings"
              :setting="setting"
              :on="on"
              :label="EMAIL_SETTING_NAMES[setting]">
              </email-setting>
            </div>
          </md-card-content>
        </md-card>
      </md-layout>
      <md-layout>
        <md-card>
          <md-card-header>
            <div class="md-title">Tiers</div>
          </md-card-header>
          <md-card-content>
            <md-button class="md-raised md-accent" @click.native="openTierForm" id="new-tier">
              <md-icon>add</md-icon>
            </md-button>
            <md-table>
              <md-table-header>
                <md-table-row>
                  <md-table-head>Priority</md-table-head>
                  <md-table-head>College description</md-table-head>
                  <md-table-head>Unavailability description</md-table-head>
                  <md-table-head>Delete</md-table-head>
                </md-table-row>
              </md-table-header>
              <md-table-body>
                <md-table-row v-for="tier in tiers">
                  <md-table-cell md-numeric>{{ tier.priority }}</md-table-cell>
                  <md-table-cell>{{ tier.collegeDescription }}</md-table-cell>
                  <md-table-cell>{{ tier.unavailabilityDescription }}</md-table-cell>
                  <md-table-cell>
                    <md-icon class="delete-tier" @click.native="deleteTier(tier.priority)">delete</md-icon>
                  </md-table-cell>
                </md-table-row>
              </md-table-body>
            </md-table>
          </md-card-content>
        </md-card>
      </md-layout>
    </md-layout>

    <md-dialog md-open-from="#new-admin" md-close-to="#new-admin" ref="adminForm">
      <md-dialog-title>Make new admin</md-dialog-title>
      <md-dialog-content>
        <md-input-container>
          <label>E-mail</label>
          <md-input type="email" required v-model="adminForm.email" ref="email"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Password</label>
          <md-input type="password" required v-model="adminForm.password" @keyup.enter.native="createAdmin"></md-input>
        </md-input-container>
      </md-dialog-content>
      <md-dialog-actions>
        <md-spinner md-indeterminate v-show="waitingForCreate"></md-spinner>
        <md-button class="md-primary" @click.native="closeAdminForm">Cancel</md-button>
        <md-button class="md-primary" @click.native="createAdmin">Done</md-button>
      </md-dialog-actions>
    </md-dialog>
    <!--Logs annoying errors if content is empty-->
    <md-dialog-alert ref="adminCreationError" md-title="Error creating admin" :md-content="adminForm.error || ' '"></md-dialog-alert>

    <md-dialog md-open-from="#new-tier" md-close-to="#new-tier" ref="tierForm">
      <md-dialog-title>Make new tier</md-dialog-title>
      <md-dialog-content>
        <md-input-container>
          <label>Priority</label>
          <md-input type="number" required v-model="tierForm.priority" ref="priority"></md-input>
        </md-input-container>
        <md-input-container>
          <label>College description</label>
          <md-input v-model="tierForm.collegeDescription"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Unavailability description</label>
          <md-input v-model="tierForm.unavailabilityDescription" @keyup.enter.native="createTier"></md-input>
        </md-input-container>
      </md-dialog-content>
      <md-dialog-actions>
        <md-spinner md-indeterminate v-show="waitingForCreate"></md-spinner>
        <md-button class="md-primary" @click.native="closeTierForm">Cancel</md-button>
        <md-button class="md-primary" @click.native="createTier">Done</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog md-open-from="#password" md-close-to="#password" ref="passwordForm">
      <md-dialog-title>Change password</md-dialog-title>
      <md-dialog-content>
        <md-input-container md-has-password>
          <label>New password</label>
          <md-input type="password" required v-model="newPassword" ref="password" @keyup.enter.native="savePassword"></md-input>
        </md-input-container>
      </md-dialog-content>
      <md-dialog-actions>
        <md-spinner md-indeterminate v-show="waitingForCreate"></md-spinner>
        <md-button class="md-primary" @click.native="savePassword">Done</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import adminFetch from './admin-fetch'
  import EmailSetting from './EmailSetting.vue'

  function emptyAdminForm() {
    return {
      email: '',
      password: '',
      error: null
    }
  }
  function emptyTierForm() {
    return {
      priority: 0,
      collegeDescription: '',
      unavailabilityDescription: ''
    }
  }
  export default {
    name: 'settings-view',
    data() {
      return {
        EMAIL_SETTING_NAMES: {
          emailOnPeriodChoice: 'E-mail when rep chooses period',
          emailOnCancellation: 'E-mail when rep cancels',
          emailOnNoteChange: 'E-mail when notes from college change',
          emailDailyDigest: 'E-mail a summary each day of notifications'
        },
        emailSettings: null,
        adminForm: emptyAdminForm(),
        tierForm: emptyTierForm(),
        waitingForCreate: false,
        admins: [],
        tiers: [],
        newPassword: ''
      }
    },
    mounted() {
      adminFetch({
        url: '/api/admin/settings/all',
        handler: ({settings}) => this.emailSettings = settings,
        router: this.$router
      })
      this.fetchAdmins()
      this.fetchTiers()
    },
    methods: {
      openAdminForm() {
        this.$refs.adminForm.open()
        setTimeout(() => this.$refs.email.$el.focus(), 300)
      },
      closeAdminForm() {
        this.$refs.adminForm.close()
      },
      createAdmin() {
        let error = null
        if (!this.adminForm.email) error = 'Please specify an e-mail address'
        else if (!this.adminForm.password) error = 'Please specify an initial password'
        if (error) {
          this.adminForm.error = error
          this.$refs.adminCreationError.open()
          return
        }

        adminFetch({
          url: '/api/admin/settings/new-admin',
          data: {
            email: this.adminForm.email,
            password: this.adminForm.password
          },
          handler: () => {
            this.fetchAdmins()
            this.closeAdminForm()
            this.waitingForCreate = false
            this.adminForm = emptyAdminForm()
          },
          router: this.$router
        })
        this.waitingForCreate = true
      },
      fetchAdmins() {
        adminFetch({
          url: '/api/admin/settings/admins',
          handler: ({admins}) => this.admins = admins,
          router: this.$router
        })
      },
      deleteAdmin(admin) {
        adminFetch({
          url: '/api/admin/settings/admin/' + admin,
          method: 'DELETE',
          handler: () => this.fetchAdmins(),
          router: this.$router
        })
      },
      fetchTiers() {
        adminFetch({
          url: '/api/admin/tiers/all',
          handler: ({tiers}) => this.tiers = tiers,
          router: this.$router
        })
      },
      deleteTier(priority) {
        adminFetch({
          url: '/api/admin/tiers/' + String(priority),
          method: 'DELETE',
          handler: () => this.fetchTiers(),
          router: this.$router
        })
      },
      openTierForm() {
        this.$refs.tierForm.open()
        setTimeout(() => this.$refs.priority.$el.focus(), 300)
      },
      closeTierForm() {
        this.$refs.tierForm.close()
      },
      createTier() {
        adminFetch({
          url: '/api/admin/tiers',
          data: {
            priority: Number(this.tierForm.priority),
            collegeDescription: this.tierForm.collegeDescription || null,
            unavailabilityDescription: this.tierForm.unavailabilityDescription || null
          },
          handler: () => {
            this.fetchTiers()
            this.closeTierForm()
            this.waitingForCreate = false
            this.tierForm = emptyTierForm()
          },
          router: this.$router
        })
        this.waitingForCreate = true
      },
      changePassword() {
        this.newPassword = ''
        this.$refs.passwordForm.open()
        setTimeout(() => this.$refs.password.$el.focus(), 300)
      },
      savePassword() {
        adminFetch({
          url: '/api/admin/settings/password',
          data: {password: this.newPassword},
          handler: () => {
            this.waitingForCreate = false
            this.$refs.passwordForm.close()
          }
        })
      }
    },
    components: {EmailSetting}
  }
</script>

<style lang="sass">
  .md-card
    width: 100%

  button.trash
    margin-left: 20px

  button.left-spaced
    margin-left: 20px

  .list-item-row div
    justify-content: flex-start !important

  .delete-tier:hover
    color: red
</style>