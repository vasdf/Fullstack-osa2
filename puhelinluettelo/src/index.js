import React from 'react';
import ReactDOM from 'react-dom';

const Person = (person) => {
  return (
    <tr>
      <td>{person.name}</td>
      <td>{person.number}</td>
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
      persons: [
        { name: 'Arto Hellas', number: '04012341234' },
        { name: 'Testi testaaja', number: '020123123' },
        { name: 'Martti Tienari', number: '040-123456' }
      ],
      newName: '',
      newNumber: '',
      search: ''
    }
  }

  addNumber = (event) => {
    event.preventDefault()

    const nimet = this.state.persons.map(person => person.name.toLowerCase())

    if (!listContains(nimet, this.state.newName.toLowerCase())) {

      const personObject = {
        name: this.state.newName,
        number: this.state.newNumber
      }

      const persons = this.state.persons.concat(personObject)

      this.setState({
        persons: persons,
        newName: '',
        newNumber: ''
      })
    } else {
      alert('Henkilö on jo puhelinluettelossa!')
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
    const persons = this.state.persons.filter(person => person.name.toLowerCase().includes(this.state.search.toLowerCase()))

    return (
      <table>
        <tbody>
          {persons.map(person => <Person key={person.name} name={person.name} number={person.number} />)}
        </tbody>
      </table>
    )
  }

  render() {
    return (
      <div>
        <h2>Puhelinluettelo</h2>
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