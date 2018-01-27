import React from 'react'

const Kurssi = (props) => {
  return (
    <div>
      <Otsikko kurssi={props.kurssi} />
      <Sisalto kurssi={props.kurssi} />
    </div>
  )
}

const Osa = (props) => <p>{props.osa} {props.tehtavia}</p>

const Otsikko = (props) => <h1>{props.kurssi.nimi}</h1>

const Sisalto = (props) => {
  const osat = props.kurssi.osat

  const rivit = () => osat.map(osa => <Osa key={osa.id} osa={osa.nimi} tehtavia={osa.tehtavia} />)

  return (
    <div>
      <ul>
        {rivit()}
        <Yhteensa kurssi={props.kurssi} />
      </ul>
    </div>
  )
}

const Yhteensa = (props) => {
  const osat = props.kurssi.osat

  const reducer = (accumulator, currentValue) => accumulator + currentValue.tehtavia

  const tehtavia = () => osat.reduce(reducer, 0)

  return (
    <p>yhteensä {tehtavia()} tehtävää</p>
  )
}

export default Kurssi