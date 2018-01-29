import React from 'react';
import ReactDOM from 'react-dom';
import personService from './services/persons'
import './index.css'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="notification">
      {message}
    </div>
  )
}

const Person = ({ person, clickHandler }) => {
  return (
    <tr>
      <td>{person.name}</td>
      <td>{person.number}</td>
      <td>
        <button onClick={clickHandler}>
          poista
        </button>
      </td>
    </tr>
  )
}

const listContains = (list, object) => {
  if (list.indexOf(object) === -1) {
    return false
  } else {
    return true
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newName: '',
      newNumber: '',
      search: '',
      notification: null
    }
  }

  componentWillMount() {
    personService
      .getAll()
      .then(response => {
        this.setState({ persons: response.data })
      })
  }

  setNotificationToNullAfterSomeTime() {
    setTimeout(() => {
      this.setState({ notification: null })
    }, 2000)
  }

  addNumber = (event) => {
    event.preventDefault()

    const nimet = this.state.persons.map(person => person.name.toLowerCase())

    if (!listContains(nimet, this.state.newName.toLowerCase())) {

      const personObject = {
        name: this.state.newName,
        number: this.state.newNumber
      }

      personService
        .create(personObject)
        .then(response => {
          this.setState({
            persons: this.state.persons.concat(response.data),
            notification: this.state.newName + "lisätty",
            newName: '',
            newNumber: ''
          })
        })
      this.setNotificationToNullAfterSomeTime();
    } else {

      const updatePerson = this.state.persons.filter(
        person =>
          person.name.toLowerCase() === this.state.newName.toLowerCase()
      )
      this.updateNumber(updatePerson[0].id, this.state.newNumber)
    }
  }

  updateNumber = (id, number) => {
    var result = window.confirm(`${this.state.newName} on jo luettelossa, korvataanko vanha numero uudella?`)

    if (result) {
      const person = this.state.persons.find(person => person.id === id)
      const changedPerson = { ...person, number: this.state.newNumber }

      personService
        .update(id, changedPerson)
        .then(response => {
          this.setState({
            persons: this.state.persons.map(person => person.id !== id ? person : changedPerson),
            notification: this.state.newName + " numeroa muutettu",
            newName: '',
            newNumber: ''
          })
        })
        .catch(error => {
          const errorPerson = {
            name: changedPerson.name,
            number: changedPerson.number
          }
          personService
            .create(errorPerson)
            .then(response => {
              this.setState({
                persons: this.state.persons.filter(person => person.id !== id).concat(response.data),
                notification: this.state.newName + " numeroa muutettu",
                newName: '',
                newNumber: ''
              })
            })
        })
      this.setNotificationToNullAfterSomeTime();

    } else {
      this.setState({
        newName: '',
        newNumber: ''
      })
    }

  }

  deleteNumber = (id, name) => {
    return () => {
      var result = window.confirm("Poistetaanko " + name)

      if (result) {
        personService
          .deletePerson(id)
          .then(response => {
            this.setState({
              persons: this.state.persons.filter(person => person.id !== id),
              notification: name + " poistettu"
            })
          })
        this.setNotificationToNullAfterSomeTime()
      }
    }
  }

  handleNumberChange = (event) => {
    this.setState({ newNumber: event.target.value })
  }

  handleNameChange = (event) => {
    this.setState({ newName: event.target.value })
  }

  handleSearchChange = (event) => {
    this.setState({ search: event.target.value })
  }

  listNumbers = () => {
    const persons = this.state.persons.filter(
      person =>
        person.name.toLowerCase().includes(
          this.state.search.toLowerCase()
        )
    )

    return (
      <table>
        <tbody>
          {persons.map(person =>
            <Person
              key={person.id}
              person={person}
              clickHandler={this.deleteNumber(person.id, person.name)}
            />
          )}
        </tbody>
      </table>
    )
  }

  render() {
    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <Notification message={this.state.notification} />
        <div>
          rajaa näytettäviä: <input
            value={this.state.search}
            onChange={this.handleSearchChange}
          />
        </div>
        <form onSubmit={this.addNumber}>
          <div>
            nimi: <input
              value={this.state.newName}
              onChange={this.handleNameChange}
            />
          </div>
          <div>
            numero: <input
              value={this.state.newNumber}
              onChange={this.handleNumberChange}
            />
          </div>
          <div>
            <button type="submit">lisää</button>
          </div>
        </form>
        <h2>Numerot</h2>
        {this.listNumbers()}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));