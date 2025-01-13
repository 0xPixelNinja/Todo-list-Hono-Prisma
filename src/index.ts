import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import todoRoutes from './routes/todo'

const app = new Hono()

app.use(cors())
app.route('/api/todos', todoRoutes)

// Welcome route
app.get('/', (c) => {
  return c.json({ message: 'Welcome to Hono-Prisma Todo API' })
})

// Start the server
const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})