
/**
* Components are lazy-loaded - See "Grouping Components in the Same Chunk"
* http://router.vuejs.org/en/advanced/lazy-loading.html
*/
/* eslint-disable global-require */
const Books = r => require.ensure([], () => r(require('./main')), 'books-bundle')
const Form = r => require.ensure([], () => r(require('./form')), 'books-bundle')

const meta = {
  requiresAuth: true,
}

export default [
  {
    name: 'books.index',
    path: '/books',
    component: Books,
    meta,
    children: [
      {
        name: 'books.new',
        path: 'create',
        component: Form,
        meta,
      }, {
        name: 'books.edit',
        path: ':id/edit',
        component: Form,
        meta,
      },
    ],
  },
]
