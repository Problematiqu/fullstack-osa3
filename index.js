const express = require('express')
const morgan = require('morgan')
const app = express()

const cors = require('cors')

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
const morganFormat = (':method :url :status :res[content-length] - :response-time ms :body')
app.use(morgan(morganFormat))
app.use(cors())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people <br> <br> ${new Date()}</p>`)
})

app.post('/api/persons', (request, response) => {
    const body = request.body 

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    } else if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name already exists'
        })
    }

    const person = {
        id: Math.floor(Math.random() * 100000),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})