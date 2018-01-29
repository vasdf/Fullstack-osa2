import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'

const CountryFullInfo = (country) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <p>capital: {country.capital}</p>
      <p>population: {country.population}</p>
      <img src={country.flag} alt="country flag" width="400" height="225" />
    </div>
  )
}

const Country = (country) => {
  return (
    <div onClick={country.handleClick}>
      {country.name}
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      countries: [],
      search: ''
    }
  }

  handleCountryClick = (country) => {
    return () => {
      this.setState({ search: country })
    }
  }

  handleSearchChange = (event) => {
    this.setState({ search: event.target.value })
  }

  componentWillMount() {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        this.setState({ countries: response.data })
      })
  }

  listCountries = () => {
    const countries = this.state.countries.filter(country =>
      country.name.toLowerCase().includes(
        this.state.search.toLowerCase()))

    if (countries.length > 10) {
      return (
        <div>
          too many maches, specify another filter
        </div>
      )
    }

    if (countries.length === 1) {
      return (
        <div>
          {countries.map(country =>
            <CountryFullInfo
              key={country.name}
              name={country.name}
              capital={country.capital}
              flag={country.flag}
              population={country.population}
            />)}
        </div>
      )
    }

    return (
      <div>
        Click on country to show more information!
        {countries.map(country =>
          <Country key={country.name} name={country.name} handleClick={this.handleCountryClick(country.name)} />)}
      </div>
    )
  }

  render() {
    return (
      <div>
        <div>
          find countries: <input
            value={this.state.search}
            onChange={this.handleSearchChange}
          />
        </div>
        <div>
          {this.listCountries()}
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));