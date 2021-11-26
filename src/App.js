import react, { useState, useEffect } from 'react';
import { getAllPokemon } from './services/pokemon';
import Card from './components/Cards/Card';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import Footer from './components/Footer/Footer';
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from 'react-icons/md';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';
import PokemonDetails from './components/PokemonDetails/PokemonDetails';

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState(['']);
  const [loading, setLoading] = useState(true);
  const [searchPokemon, setSearchPokemon] = useState('');
  const [pokemonDetailsVisible, setPokemonDetailsVisible] = useState(false);
  const [currentPokemonData, setCurrentPokemonDataState] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
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
      setCurrentPage(0);
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
    setCurrentPage(currentPage + 1);
  }

  const prev = async () => {
    if (!prevUrl || currentPage <= 0) {
      console.log(prevUrl)
      return;
    }
    setLoading(true);
    let data = await getAllPokemon(prevUrl);
    await loadingPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
    setCurrentPage(currentPage - 1);
  }

  const loadingPokemon = async (data) => {
    let _pokemonData = await Promise.all(data.map(async pokemon => {
      let pokemonRecord = await getAllPokemon(pokemon.url);
      return pokemonRecord;
    }))

    setPokemonData(_pokemonData);
  }
  const filteredData = pokemonData.filter(val => {
    if(searchPokemon === "") return val;
    else if (val.name.toLowerCase().includes(searchPokemon.toLowerCase())) return val;
  });

  const setCurrentPokemonData = (pokemon) => {
    setCurrentPokemonDataState(pokemon);
    setPokemonDetailsVisible(true);
  }

  console.log(currentPage);

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
                  if(pokemonDetailsVisible) setPokemonDetailsVisible(false);
                }
              }>  
            </input>
          </div>
            
            <div className='grid-container'>
            <div className="up-icon"><BsFillArrowUpCircleFill /></div>
            <div className="behind-up-icon"></div>
              {!pokemonDetailsVisible && <>
                {currentPage !== 0 && <div className="pagination-arrows left-arrow" onClick={prev}><MdOutlineArrowBackIosNew /></div>}
                <div className="pagination-arrows right-arrow" onClick={next}><MdOutlineArrowForwardIos /></div>
              </>}
              {
                pokemonDetailsVisible ? <PokemonDetails data={currentPokemonData} closeDetails={()=>{setPokemonDetailsVisible(false)}}/>:
                filteredData.map((pokemon, i) => {
                  return <Card key={i} onClick={() => setCurrentPokemonData(pokemon)} pokemon={pokemon}/>})
              }
              {
                !filteredData.length && <h1 className="no-result">No Pokemon Found</h1>
              }
            </div>
          </>
        )
      }
    </div>
    <Footer />
    </>
  );
}

export default App;
