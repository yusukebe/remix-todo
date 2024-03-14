import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/cloudflare'
import { useLoaderData, Form } from '@remix-run/react'

type TodoType = {
  id: string
  title: string
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { DB } = context.cloudflare.env
  const { results } = await DB.prepare('SELECT id, title from todos').all<TodoType>()
  const todos = results
  return json({ todos })
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const method = request.method
  const formData = await request.formData()

  const { DB } = context.cloudflare.env

  if (method === 'DELETE') {
    const id = formData.get('id')
    await DB.prepare('DELETE FROM todos WHERE id = ?;').bind(id).run()
    return redirect('/')
  } else {
    const title = formData.get('title')
    const id = crypto.randomUUID()
    await DB.prepare('INSERT INTO todos(id, title) VALUES(?, ?);').bind(id, title).run()
    return {
      id,
      title
    }
  }
}

export default function Index() {
  const { todos } = useLoaderData<{ todos: TodoType[] }>()

  return (
    <div>
      <Form method="post" className="mb-4">
        <div className="mb-2">
          <input
            name="title"
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5"
          />
        </div>
        <button className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2 text-center" type="submit">
          Submit
        </button>
      </Form>
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between py-1 px-4 my-1 rounded-lg text-lg border bg-gray-100 text-gray-600 mb-2"
        >
          {todo.title}
          <Form method="delete">
            <input type="hidden" name="id" value={todo.id} />
            <button type="submit" className="font-medium">
              Delete
            </button>
          </Form>
        </div>
      ))}
    </div>
  )
}
