import React from 'react';
import ReactDOM from 'react-dom';
// https://www.npmjs.com/package/react-loader-spinner
import Loader from 'react-loader-spinner';
// https://www.npmjs.com/package/react-notifications-component
import ReactNotification from 'react-notifications-component';
import { store } from 'react-notifications-component';

import './index.scss';
import 'font-awesome/css/font-awesome.min.css';
import 'react-notifications-component/dist/theme.css';
import "animate.css/source/animate.css";

const { useState, useEffect } = React;

/*

Deployed via Netlify: https://shopify-challenge-timmlui.netlify.app

Author's Notes:
  I took the inspiration from oscar.go.com/nominees, seeming their theme and design fit for this scenario with
  IMDB film nominations. Worked on it over the span of 4 days (Dated Sept 7, 2020). Even if I do not considered,
  I would love any sort of feedback as I'm gaining experience over React hooks and web design, much appreciated.

  Thanks,
  Timothy Lui

Consume the following endpoint:
http://www.omdbapi.com/?apikey=[yourkey]&

If run locally, create .env.local file with REACT_APP_OMDB_API_KEY=[apikey]

Using React 16:

- Search OMDB and display the results (movies only)
- Add a movie from the search results to our nomination list
- View the list of films already nominated
- Remove a nominee from the nomination list

Technical Requirements:

- Search results should come from OMDB's API (free API key: http://www.omdbapi.com/apikey.aspx).
- Each search result should list at least its title, year of release and a button to nominate that film.
- Updates to the search terms should update the result list
- Movies in search results can be added and removed from the nomination list.
- If a search result has already been nominated, disable its nominate button.
- Display a banner when the user has 5 nominations.

Extras:

- Animations for loading, hover

To-Do: (didnt have enough time)

- New border design when film is nominated
- Nominations to be sticky 
- Back to top button
- Lazy loading / Split search results into multiple page counts
- Responsive design (desktop, tablet, mobile)
- Cache nominations list
- Search bar animations
- Create shareable link

*/

const url = 'https://www.omdbapi.com/?apikey=' + process.env.REACT_APP_OMDB_API_KEY;

// Modal Component
const Modal = (props) => {
  const [movieInfo, setMovieInfo] = useState({});
  const { movieData, closeModal, modalIsOpen } = props;
  const { imdbID } = movieData;

  useEffect(() => {
    (async () => {
      const response = await fetch(url + '&i=' + imdbID);
      const json = await response.json();
  
      if (json.Response === 'True') {
        setMovieInfo(json);
      }
    })();
  }, [movieData]);

  const { Title, Year, Director, Actors, Plot, Awards, Poster, Production, imdbRating, imdbVotes, Metascore, Ratings } = movieInfo;
  
  return (
    <div id="modal-container" className={`${modalIsOpen ? 'modal-open' : ''} modal-container`} onClick={closeModal}>
      <div className="modal">
        <span id="close-btn" className="close-btn" onClick={closeModal}>&times;</span>
        <div className="poster" style={{backgroundImage: `url(${Poster})`}}/>
        <div className="text-content">
          <div className="text text-title">{Title}</div>
          <div className="text text-year">{Year}</div>
          <div className="text text-director">{`${Director}, Director(s)`}</div>
          <div className="text text-production">{`${Production}, Production`}</div>
          <h3 className="modal-heading">Film Synopsis</h3>
          <div className="text text-plot">{Plot}</div>
          <h3 className="modal-heading">Featured Actors</h3>
          <div className="text text-actors">{Actors}</div>
          <h3 className="modal-heading">Rating Score</h3>
          <div className="text text-rating">{`IMDB: ${imdbRating} (${imdbVotes} Reviews)`}</div>
          {Ratings && Ratings.length && 
            Ratings.map((rating) => {
              return <div className="text text-rating">{`${rating.Source}: ${rating.Value}`}</div>
            })
          }
          <div className="text text-rating">{`MetaScore: ${Metascore}`}</div>
        </div>
      </div>
    </div>
  )
};

// Nominees Container for 5 movie cards
const NomineesContainer = (props) => {
  const { nomineesList } = props;

  const placeholders = nomineesList.length === 0 ? 5 : 5 - nomineesList.length;
  const updatedMovieList = [...nomineesList, ...Array.from({length:placeholders}).map(x => new Object())];
  console.log('placeHolderMovieList', updatedMovieList)

  return (
    <div className="nominees-container">
      <div className="header-title">IMDB NOMINEES</div>
      <div className="divider" />
      <MovieCardsContainer movieList={updatedMovieList} nominee={true} {...props}/>
    </div>
  )
};

// Search Container including search bar and results
const SearchContainer = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('new');

  function handleSort(e) {
    const sortValue = e.target.value;
    const sortedResults = searchResults.sort((a, b) => (sortValue === 'new' ? a.Year > b.Year : a.Year < b.Year) ? -1: 1);
    setSelectedOption(sortValue);
    setSearchResults(sortedResults);
  }

  function editSearchTerm(e) {
    const userInput = e.target.value;

    (async () => {
      let searchResultsTemp = [];
    
      const response = await fetch(url + '&s=' + userInput);
      const json = await response.json();

      if (json.Response === 'True') {
        setLoading(true);

        const totalPages = Math.ceil(json.totalResults / 10);

        for (let i = 1; i < totalPages + 1; i++) {

          const response = await fetch(url + '&s=' + userInput + '&page=' + i);
          const json = await response.json();

          if (json.Response === 'True') {
            searchResultsTemp = [...searchResultsTemp, ...json.Search];
          }
        }

        // Default sort results by latest year
        const sortedResults = searchResultsTemp.sort((a, b) => (a.Year > b.Year) ? -1: 1);

        setSearchResults(sortedResults);
        setLoading(false);
      } else {
        setSearchResults([]);
        setLoading(false);
      }
    })();

    // Update the state hooks
    setSearchTerm(userInput);
  }

  return (
    <div className="search-container">
      <div className="search-bar">
        <i className="search-icon fa fa-search" />
        <input type='text' value={searchTerm} onChange={editSearchTerm} placeholder='Search by Movie Title' />
      </div>
      {searchResults && searchResults.length > 0 &&
        <div className="sort-filter">
          <div className="text text-sort">Year</div>
          <select className="select-menu" value={selectedOption} onChange={handleSort}>
            <option value="new">New - Old</option>
            <option value="old">Old - New</option>
          </select>
        </div>
      }
      {loading
        ? <Loader className="loader" type="ThreeDots" color="#dec47f" center/>
        : <MovieCardsContainer movieList={searchResults} {...props}/>
      }
    </div>
  )
};

// Movie Cards Container 
const MovieCardsContainer = (props) => {
  const [modalIsOpen, setModalOpen] = useState(false);
  const [movieInfoToShow, setInfoToShow] = useState({});
  const { movieList } = props;

  function openModal(movieInfo) {
    document.body.classList.add('modal-open');
    setInfoToShow(movieInfo);
    setModalOpen(true);
  }

  function closeModal(e) {
    // need id here to differentiate modal from modalContainer
    const target = e.target.id;
    if (target === 'modal-container' || target === 'close-btn') {
      document.body.classList.remove('modal-open');
      setModalOpen(false);
    }
  }

  return (
    <div className="movie-cards-container">
      <Modal movieData={movieInfoToShow} closeModal={closeModal} modalIsOpen={modalIsOpen}/>
      {movieList.map((movieData) =>
        <MovieCard movieData={movieData} openModal={openModal} {...props}/>
      )}
    </div>
  )
}


// Movie Card Component
const MovieCard = (props) => {
  const { movieData, movieList, nominee, nomineesList, openModal, addNominee, removeNominee } = props;
  const { Title, Year, Poster, Type, imdbID } = movieData;

  const isPlaceHolder = !movieData.imdbID ? 'placeholder' : '';
  const isNominated = nomineesList.find(movie => movie.imdbID === imdbID);

  const posterHeight = Poster === 'N/A' ? '270px' : 0;
  const useOverlay = Poster === 'N/A' ? 'use-overlay' : '';
  const imgSrc = Poster === 'N/A' ? '' : Poster;

  function handleNominate(e) {
    e.stopPropagation();
    addNominee(movieData);
  }

  function handleRemoveNominate(e) {
    e.stopPropagation();
    removeNominee(movieData, nomineesList);
  }

  return (
    <div className={`movie-card ${isPlaceHolder}`}>
      {Poster && 
        <div>
          <img src={imgSrc} className="poster" style={{minHeight: posterHeight}}/>
          <div className={`${useOverlay} poster-overlay`} onClick={() => openModal(movieData)}>
            <div className="text text-title">{Title}</div>
            <div className="text text-year">{Year}</div>
            {nominee 
              ? <button className="remove-nominate" onClick={handleRemoveNominate}>Remove</button>
              : <button className="nominate" disabled={isNominated} onClick={handleNominate}>
                  { isNominated ? 'Nominated' : 'Nominate' }
                </button> 
            }
          </div>
        </div>
      }
    </div>
  )
};

const App = () => {
  const [nomineesList, setNomineesList] = useState([]);

  useEffect(() => {
    // window.addEventListener('scroll', onScroll());
    if (nomineesList.length === 5) {
      store.addNotification({
        message: "You have successfully nominated five films",
        type: "default",
        insert: "top",
        container: "top-center",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 3000,
          onScreen: true
        }
      })
    }
  }, [nomineesList])

  // function onScroll() {
  //   console.log('scrollingg')
  // }

  function addNominee(movieData, e) {
    // console.log('nominate this movie', movieData)
    if (nomineesList.length < 5 && !nomineesList.find(movie => movie.imdbID === movieData.imdbID)) {
      setNomineesList(nomineesList => [...nomineesList, movieData]);
    }
  }

  function removeNominee(movieData, movieList) {
    // console.log('remove this nominee', movieData)
    const updatedNomineesList = movieList.filter(movie => movie.imdbID !== movieData.imdbID);
    setNomineesList(updatedNomineesList);
  }
  
  return(
    <div className="app-container">
      <ReactNotification />
      <NomineesContainer nomineesList={nomineesList} removeNominee={removeNominee}/>

      <SearchContainer nomineesList={nomineesList} addNominee={addNominee}/>
    </div>
  );
};

ReactDOM.render(
	<App />,
  document.getElementById('root')
);