import { useState, useEffect } from 'react';
import { getAllPokemon } from './services/pokemon';

import Card from './components/Cards/Card';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import PokemonDetails from './components/PokemonDetails/PokemonDetails';

import './App.css';

import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from 'react-icons/md';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';

export default function App() {

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
      const response = await getAllPokemon(initialUrl);
      await loadingPokemon(response.results);
      setNextUrl(response.next);
      setPrevUrl(response.prevUrl);
      setLoading(false);
      setCurrentPage(0);
    }
    fetchData();

    const mainContainer = document.querySelector('.main-container');
    mainContainer.addEventListener('scroll', () => {
      const isElementInView = mainContainer.scrollTop < 100;
      const scrollUpIcon = document.querySelector('.up-icon');
      const behindScrollButton = document.querySelector('.behind-up-icon');

      if(scrollUpIcon && behindScrollButton) {
        if(isElementInView) {
          scrollUpIcon.classList.add('hidden');
          behindScrollButton.classList.add('hidden');
        }
        else {
          scrollUpIcon.classList.remove('hidden');
          behindScrollButton.classList.remove('hidden');
        }
      }
    })
  }, []);

  const next = async () => {
    setLoading(true);
    const data = await getAllPokemon(nextUrl);
    await loadingPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
    setCurrentPage(currentPage + 1);
  }

  const prev = async () => {
    if (!prevUrl || currentPage <= 0) return;
    setLoading(true);
    const data = await getAllPokemon(prevUrl);
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

  const filteredData = pokemonData.filter(val => 
    val.name.toLowerCase().includes(searchPokemon.toLowerCase())
  );

  const setCurrentPokemonData = pokemon => {
    setCurrentPokemonDataState(pokemon);
    setPokemonDetailsVisible(true);
  }

  return (
    <>
      <Navbar />
      <div className='main-container'>
        {
          loading ? <h1 className='loading-text'>Loading...</h1> : (
            <>
              <div className='button-input' id='search-bar'>
                <input className='search-pokemon' type='text' placeholder='Search pokemon' onChange = {
                    event => {
                      setSearchPokemon(event.target.value)
                      if(pokemonDetailsVisible) setPokemonDetailsVisible(false);
                    }
                  }>  
                </input>
              </div>
                
              <div className='grid-container'>
                <a href='#search-bar' className='scrollToTop'>
                  <div className='up-icon hidden'><BsFillArrowUpCircleFill /></div>
                  <div className='behind-up-icon hidden'></div>
                </a>

                {
                  !pokemonDetailsVisible && 
                  <>
                    {
                      currentPage !== 0 && 
                      <div className='pagination-arrows left-arrow' onClick={prev}><MdOutlineArrowBackIosNew /></div>
                    }
                    <div className='pagination-arrows right-arrow' onClick={next}><MdOutlineArrowForwardIos /></div>
                  </>
                }

                {
                  pokemonDetailsVisible ? 
                    <PokemonDetails data={currentPokemonData} closeDetails={()=>{setPokemonDetailsVisible(false)}}/> :
                    filteredData.map((pokemon, index) => {
                      return <Card key={index} onClick={() => setCurrentPokemonData(pokemon)} pokemon={pokemon}/>
                    })
                }

                {
                  !filteredData.length && <h1 className='no-result'>No Pokemon Found</h1>
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