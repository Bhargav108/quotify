import React,{ useEffect, useState } from 'react';
import './App.css';

function App() {

  const [ genres, setGenres ] = useState([]);
  const [ category, setCategory ] = useState('Random');
  const [ quote, setQuote ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ quoteLoading, setQuoteLoading ] = useState(false);

  const { REACT_APP_QUOTE_API } = process.env;

  async function getCategories() {
    try {
      setLoading(true);
      const response = await fetch(`${REACT_APP_QUOTE_API}/genres`);
      const jsonResponse = await response.json();
      setGenres(['select a category',...jsonResponse.data]);
    } finally {
      setLoading(false);
    }
  }

  async function getRandomeQuotes(category = '') {
    try {
      setQuoteLoading(true);
      const response = await fetch(`${REACT_APP_QUOTE_API}/quotes/random?genre=${category}`);
      const jsonResponse = await response.json();
      setQuote(jsonResponse.data);
    } finally {
      setQuoteLoading(false);
    }
  }

  const capitalize = (string) => {
    return (string.charAt(0).toUpperCase() + string.slice(1))
  };

  function updateCategory(event) {
    let selectedCategory = event.target.value;
    selectedCategory = selectedCategory.split(' ').length > 1 ? '' : selectedCategory; 
    setCategory(capitalize(selectedCategory));
    getRandomeQuotes(selectedCategory);
  }

  useEffect(()=> {
    getCategories();
    getRandomeQuotes();
    return (()=> {
      setCategory('')
    });
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='container'>
      <div className='header'>
        <span>Quotify</span>
      </div>
      { loading ? <div className="loading"><span className='loading-text'>Loading random quotes ...</span></div> :
        <div className="quote-section">
          {
            genres.length ?
              <label className="custom-select">
                <select name="sample" className='select-css' onChange={(e) => updateCategory(e)}>
                { genres.map((genre) => <option key={genre}>{genre}</option>) }
                </select>
              </label>
            : 
            ''
          }
          <span className='sub-header'>{category ? category : 'Random'} Quotes</span>
          {
            quoteLoading ? <div className="loading"><span className='loading-text'>Loading {category} quotes ...</span></div> :
            quote.length ?
            <div className='quote-container'>
              {/* <span>{quote.message}</span> */}
              <div className='quote'>{quote[0].quoteText}</div>
              <span className='author'> ~ {quote[0].quoteAuthor} ~</span>
            </div> : ''
          }

        <button 
          className='button' 
          onClick={() => getRandomeQuotes(category === 'Random' ? '' : category.toLowerCase())}
        >Another</button>
        </div>
      }
    </div>
  );
}

export default App;
