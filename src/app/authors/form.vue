
<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'CcAuthorForm',

    /**
    * Component's local state
    */
    data() {
      return {
        author: {
          id: null,
          firstName: '',
          lastName: '',
          fullName () {
            firstName + " " + lastName
          }
        },
      }
    },

    /**
    * Fetch author when component is first mounted
    */
    mounted() {
      this.fetch()
    },

    /**
    * Also fetch author every time route changes
    */
    watch: {
      $route: 'fetch',
    },

    /**
    * Determines based on the presence of
    * author id if the current actions
    * is editing instead of creating.
    */
    computed: {
      isEditing() {
        return this.author.id > 0
      },
      isValid() {
        this.resetMessages()
        if (this.author.firstName === '') {
          this.setMessage({ type: 'error', message: ['Please fill author firstName'] })
          return false
        }
        return true
      },
    },

    methods: {
      ...mapActions(['setFetching', 'resetMessages', 'setMessage']),

      /**
      * If there's an ID in the route params
      * then use it to fetch the author
      * from the server
      */
      fetch() {
        const id = this.$route.params.id

        /**
        * This same component is used for create
        * and update so we have to check if
        * ID is not undefined.
        */
        if (id !== undefined) {
          /**
          * Fetch the author from the server
          */
          this.setFetching({ fetching: true })
          this.$http.get(`authors/${id}`).then((res) => {
            const { id: _id, firstName, lastName } = res.data.data // http://wesbos.com/destructuring-renaming/
            this.author.id = _id
            this.author.firstName = firstName
            this.author.lastName = lastName
            this.setFetching({ fetching: false })
          })
        }
      },
      submit() {
        /**
        * Pre-conditions are met
        */
        if (this.isValid) {
          /**
          * Shows the global spinner
          */
          this.setFetching({ fetching: true })

          if (this.isEditing) {
            this.update()
          } else {
            this.save()
          }
        }
      },
      save() {
        this.$http.post('authors', { firstName: this.author.firstName, lastName:this.author.lastName }).then(() => {
          /**
          * This event will notify the world about
          * the author creation. In this case
          * the Category main component will intercept
          * the event and refresh the list.
          */
          this.$bus.$emit('author.created')

          /**
          * Hides the global spinner
          */
          this.setFetching({ fetching: false })

          /**
          * Sets the global feedback message
          */
          this.setMessage({ type: 'success', message: 'New author was created' })

          /**
          * Resets component's state
          */
          this.reset()
        })
      },
      update() {
        this.$http.put(`authors/${this.author.id}`, this.author).then(() => {
          /**
          * This event will notify the world about
          * the author creation. In this case
          * the Category main component will intercept
          * the event and refresh the list.
          */
          this.$bus.$emit('author.updated')

          /**
          * Hides the global spinner
          */
          this.setFetching({ fetching: false })

          /**
          * Sets the global feedback message
          */
          this.setMessage({ type: 'success', message: 'Category was updated' })
        })
      },
      reset() {
        this.author.id = 0
        this.author.firstName = ''
        this.author.lastName = ''
      },
    },
  }
</script>

<template>
  <div class="well">
    <el-form ref="form" :model="author" label-width="120px">
      <el-form-item label="Author firtName">
        <el-input v-model="author.firstName"></el-input>
      </el-form-item>
      <el-form-item label="Author lastName">
        <el-input v-model="author.lastName"></el-input>
      </el-form-item>
      <el-button @click="submit">Save</el-button>
    </el-form>
  </div>
</template>
