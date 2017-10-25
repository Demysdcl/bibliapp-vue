
<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    name: 'CcBooksForm',

    /**
    * Component's local state
    */
    data() {
      return {
        book: {
          id: null,
          authorId: '',
          title: '',
        },
      }
    },

    /**
    * Fetch book when component is first mounted
    */
    mounted() {
      this.fetch()
      this.fetchAuthors()
    },

    /**
    * Also fetch book every time route changes
    */
    watch: {
      $route: 'fetch',
    },

    /**
    * Determines based on the presence of
    * book id if the current actions
    * is editing instead of creating.
    */
    computed: {
      ...mapState({
        authors: state => state.Authors.full_list,
      }),
      isEditing() {
        return this.book.id > 0
      },
      isValid() {
        this.resetMessages()
        if (this.book.title === '') {
          this.setMessage({ type: 'error', message: ['Please fill book title'] })
          return false
        }
        return true
      },
    },

    methods: {
      ...mapActions(['authorsSetData', 'setFetching', 'resetMessages', 'setMessage']),
      /**
      * If there's an ID in the route params
      * then use it to fetch the book
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
          * Fetch the book from the server
          */
          this.setFetching({ fetching: true })
          this.$http.get(`books/${id}`).then((res) => {
            // http://wesbos.com/destructuring-renaming/
            const { id, title, authorId } = res.data.data
            this.book.title = title
            this.book.id = id
            this.book.authorId = authorId
            this.setFetching({ fetching: false })
            // debugger
            /**
            * If you're uncertain of where the data comes from
            * just uncomment the debugger instruction above
            * open Chrome Dev Tools and reload the page
            * this will give you the opportunity to
            * inspect the response and the data
            */
          })
        }
      },
      fetchAuthors() {
        if (!this.authors.length) {
          this.setFetching({ fetching: true })
          this.$http.get('authors').then(({ data }) => {
            /**
            * Vuex action to set full list array in
            * the Vuex Authors module
            */

            data.forEach(author => {
              author.fullName = author.firstName + " " + author.lastName
            })

            this.authorsSetData({
              full_list: data,
            })
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
        this.$http.post('books', this.book).then(() => {
          /**
          * This event will notify the world about
          * the book creation. In this case
          * the Book main component will intercept
          * the event and refresh the list.
          */
          this.$bus.$emit('book.created')

          /**
          * Hides the global spinner
          */
          this.setFetching({ fetching: false })

          /**
          * Sets the global feedback message
          */
          this.setMessage({ type: 'success', message: 'New book was created' })

          /**
          * Resets component's state
          */
          this.reset()
        })
      },
      update() {
        this.$http.put(`books/${this.book.id}`, this.book).then(() => {
          /**
          * This event will notify the world about
          * the book creation. In this case
          * the Book main component will intercept
          * the event and refresh the list.
          */
          this.$bus.$emit('book.updated')

          /**
          * Hides the global spinner
          */
          this.setFetching({ fetching: false })

          /**
          * Sets the global feedback message
          */
          this.setMessage({ type: 'success', message: 'Book was updated' })
        })
      },
      reset() {
        this.book.id = 0
        this.book.authorId = 0
        this.book.name = ''
      },
    },
  }
</script>

<template>
  <div class="well">
    <el-form ref="form" :model="book" label-width="120px">
      <el-form-item label="Book title">
        <el-input v-model="book.title"></el-input>
      </el-form-item>
      <el-form-item label="Author">
        <el-select v-model="book.authorId" placeholder="Select Author" filterable>
          <el-option
            v-for="author in authors"
            :label="author.fullName"
            :value="author.id">
          </el-option>
        </el-select>
        <el-button @click="submit">Save</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
