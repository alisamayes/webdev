require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()

app.use(express.json())

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (!result) {
        return response.status(404).end()
      }
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments()
    .then(count => {
      const time = new Date().toLocaleString()
      response.send(`<p>Phonebook has ${count} entries for ${time}</p>`)
    })
    .catch(error => next(error))
})

app.use(express.static('dist'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

if (mongoose.connection.readyState === 1) {
  startServer()
} else {
  mongoose.connection.once('open', startServer)
}
