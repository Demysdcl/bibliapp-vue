// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
import { routes as dashboard } from './dashboard'
import { routes as authors } from './authors'
import { routes as books } from './books'
import { routes as auth } from './auth'

// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Spread_operator
// Thus a new array is created, containing all objects that match the routes.
// ...dashboard must be the last one because of the catchall instruction
export default [...auth, ...authors, ...books, ...dashboard]
