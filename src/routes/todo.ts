import { Hono } from 'hono'
import { prisma } from '../db/client'

const todo = new Hono()

// Get all tasks
todo.get('/getTask', async (c) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return c.json({ success: true, data: todos })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch todos' }, 500)
  }
})

// Create a new task
todo.post('/createTask', async (c) => {
  try {
    const { title, description } = await c.req.json()
    
    if (!title) {
      return c.json({ success: false, error: 'Title is required' }, 400)
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description
      }
    })
    
    return c.json({ success: true, data: todo }, 201)
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create todo' }, 500)
  }
})

// Update a task
todo.put('updateTask/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const { title, description, completed } = await c.req.json()
    
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { title, description, completed }
    })
    
    return c.json({ success: true, data: updatedTodo })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update todo' }, 500)
  }
})

// Delete a task
todo.delete('deleteTask/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    
    await prisma.todo.delete({
      where: { id }
    })
    
    return c.json({ success: true, message: 'Todo deleted successfully' })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to delete todo' }, 500)
  }
})

// Mark task as complete
todo.patch('completeTask/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { completed: true }
    })
    
    return c.json({ success: true, data: updatedTodo })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to mark todo as complete' }, 500)
  }
})

export default todo