import react, { useState, useEffect } from 'react';
import { getAllPokemon } from './services/pokemon';
import Card from './components/Cards/Card';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import Footer from './components/Footer/Footer';
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from 'react-icons/md';

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState(['']);
  const [loading, setLoading] = useState(true);
  const [searchPokemon, setSearchPokemon] = useState('');
  const initialUrl = 'https://pokeapi.co/api/v2/pokemon';

  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(initialUrl);
      console.log(response);
      setNextUrl(response.next);
      setPrevUrl(response.prevUrl);
      const pokemon = await loadingPokemon(response.results);
      console.log(pokemon);
      setLoading(false);
    }
    fetchData();
  }, []);

  const next = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextUrl);
    await loadingPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }

  const prev = async () => {
    if (!prevUrl) return;
    setLoading(true);
    let data = await getAllPokemon(prevUrl);
    await loadingPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }

  const loadingPokemon = async (data) => {
    let _pokemonData = await Promise.all(data.map(async pokemon => {
      let pokemonRecord = await getAllPokemon(pokemon.url);
      return pokemonRecord;
    }))

    setPokemonData(_pokemonData);
  }
  console.log(pokemonData);
  
  const filteredData = pokemonData.filter(val => {
    if(searchPokemon === "") return val;
    else if (val.name.toLowerCase().includes(searchPokemon.toLowerCase())) return val;
  });

  return (
    <>
    <Navbar />


    <div className="main-container">
      
      {
        loading ? <h1 className="loading-text">Loading...</h1> : (
          <>
          <div className="button-input">
            <input className="search-pokemon" type="text" placeholder="Search pokemon" onChange={
                event => {
                  setSearchPokemon(event.target.value)
                }
              }>  
            </input>
          </div>
            
            <div className='grid-container'>
              <div className="pagination-arrows left-arrow" onClick={prev}><MdOutlineArrowBackIosNew /></div>
              <div className="pagination-arrows right-arrow" onClick={next}><MdOutlineArrowForwardIos /></div>
              {
                filteredData.map((pokemon, i) => {
                  return <Card key={i} pokemon={pokemon}/>})
              }
              {
                !filteredData.length && <h1 className="no-result">No Pokemon Found</h1>
              }
            </div>

            {/* <div className='btn btn-common btn-bottom'>
              <button onClick={prev}>Prev</button>
              <button onClick={next}>Next</button>
            </div> */}
          </>
        )
      }
    </div>
    <Footer />
    </>
  );
}

export default App;
