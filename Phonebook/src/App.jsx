import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'
import './index.css'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  useEffect(() => {
    personService.getAll()
      .then(initialPersons => setPersons(initialPersons))
      .catch(() =>
        showNotification(
          'Failed to load phonebook data from the server',
          'error'
        )
      )
  }, [])

  const deletePerson = id => {
    personService
      .remove(id)
      .then(() => {
        setPersons(prev => prev.filter(p => String(p.id) !== String(id)))
      })
      .catch(() => {
        showNotification(
          'Failed to delete person from the server',
          'error'
        )
      })
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNumber }
    const existing = persons.find((p) => p.name === newName)

    if (existing) {
      if (
        !window.confirm(
          `${newName} is already added to phonebook, replace old number with a new one?`
        )
      ) {
        return
      }

      const changedPerson = { ...existing, number: newNumber }
      personService
        .update(existing.id, changedPerson)
        .then(returnedPerson => {
          setPersons(prev =>
            prev.map(p =>
              String(p.id) === String(existing.id) ? returnedPerson : p
            )
          )
          setNewName('')
          setNewNumber('')
          showNotification(
            `Updated ${returnedPerson.name}'s number to ${returnedPerson.number}`,
            'success'
          )
        })
        .catch(() => {
          showNotification(
            `Person '${existing.name}' has already been removed from the server`,
            'error'
          )
          setPersons(prev =>
            prev.filter(p => String(p.id) !== String(existing.id))
          )
        })
      return
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(prev => prev.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showNotification(
          `Added ${returnedPerson.name} ${returnedPerson.number}`,
          'success'
        )
      })
  }

  const personsToShow =
  filter.trim() === ''
    ? persons
    : persons.filter((p) =>
        p.name.toLowerCase().includes(filter.toLowerCase())
      )
  
  return (
    <div>
      <h1>Phonebook</h1>
      <Notification
        message={notification?.message ?? null}
        type={notification?.type}
      />
      <Filter value={filter} onChange={(e) => setFilter(e.target.value)} />
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        onNumberChange={(e) => setNewNumber(e.target.value)}
      />
      <h1>Numbers</h1>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
      
    </div>
  )
}

export default App