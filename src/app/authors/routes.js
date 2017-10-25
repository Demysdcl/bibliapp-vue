
/**
* Components are lazy-loaded - See "Grouping Components in the Same Chunk"
* http://router.vuejs.org/en/advanced/lazy-loading.html
*/
/* eslint-disable global-require */
const Authors = r => require.ensure([], () => r(require('./main')), 'authors-bundle')
const Form = r => require.ensure([], () => r(require('./form')), 'authors-bundle')

const meta = {
  requiresAuth: true,
}

export default [
  {
    name: 'authors.index',
    path: '/authors',
    component: Authors,
    meta,
    children: [
      {
        name: 'authors.new',
        path: 'create',
        component: Form,
        meta,
      }, {
        name: 'authors.edit',
        path: ':id/edit',
        component: Form,
        meta,
      },
    ],
  },
]
