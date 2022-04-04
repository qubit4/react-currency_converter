import './App.css';
import React, { useEffect, useState } from 'react';
import CurrencyRow from './CurrencyRow';






// API Problem .... current API does not allow changing base currency
const ACCESS_KEY = "76cea629b23857f47aaf5af5af07dae5"
const BASE_URL = `http://api.exchangeratesapi.io/latest?access_key=${ACCESS_KEY}`


// better API: 

// const ACCESS_KEY = "46b85ef01386aeb2ffc24f0851133c927b6a11ad"
// const BASE_URL = `https://api.getgeoapi.com/v2/currency/list
// ?api_key=${ACCESS_KEY}`

// fetch(BASE_URL)
//  .then(response => response.json())
//  .then(data => console.log(data));


function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
  
  let toAmount, fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

 
  useEffect(() => {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(data => {
      const firstCurrency = Object.keys(data.rates)[0]
      setCurrencyOptions([data.base, ...Object.keys(data.rates)])
      setFromCurrency(data.base)
      setToCurrency(firstCurrency)
      setExchangeRate(data.rates[firstCurrency])
    })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(BASE_URL)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <>
    <div class="container">
    <h1 className='title'>currency converter <small>from EUR</small></h1>
    <div class="jumbotron">
    
    
    <CurrencyRow currencyOptions={currencyOptions} selectedCurrency={fromCurrency} onChangeCurrency={e => setFromCurrency(e.target.value)} onChangeAmount={handleFromAmountChange} amount = {fromAmount} />
    <div className='equals'>=</div>
    <CurrencyRow currencyOptions={currencyOptions} selectedCurrency={toCurrency} onChangeCurrency={e => setToCurrency(e.target.value)}  onChangeAmount={handleToAmountChange} amount = {toAmount}/>
    
    </div></div>
    </>
  );
}

export default App;
