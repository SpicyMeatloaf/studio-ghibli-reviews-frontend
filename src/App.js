import { useState, useEffect } from "react";
import "./App.css";
//import Film from "./components/Film/Film";
import Review from "./components/Review/Review";
import posterList from "./assets/posterList";

import Header from './components/Header/Header';

<style>
@import url('https://fonts.googleapis.com/css2?family=Averia+Gruesa+Libre&display=swap');
</style> 


export default function App() {
  const [state, setState] = useState({
    films: [], 
    posters: [],
    currentPoster: [],
    newReview: {
      review: "",
    },
    filmReviews: [{}],
    reviewPage: false,
  });

  useEffect(function() {
    getAppData();
    renderAllPosters();

  }, [])

  // =================
  // fetch data functions
  // =================

  async function getAppData() {
    const films = await fetch('https://ghibliapi.herokuapp.com/films')
    .then(res => res.json())

    //console.log(films);
    
    setState(prevState => ({
      ...prevState,
      films
    }));
  }

  async function getReviews() {
    const filmReviews = await fetch('http://localhost:3001/database/reviews')
    .then(res => res.json())
    
    setState(prevState => ({
      ...prevState,
      filmReviews
    }));
  }

  // =================
  // importing film info
  // =================
  
  /*
  function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  
  const images = importAll(require.context('./assets', false, /\.(png|jpe?g|svg)$/));

  const allFilms = state.films.map((film, idx) => 
    <Film key={idx} data={film} imgDb={images} />
  );
  */

  // =================
  // film posters
  // =================
 
  function renderAllPosters() {
    state.posters = Object.values(posterList);
  };

  function clickPoster(imageId) {
    // displays film information
    if(!state.reviewPage){
      let posterId = 'f'
      if(imageId < 10) {
        posterId += '0' + imageId;
      } else {
        posterId += imageId;
      }

      getReviews();

      const currentPoster = posterList[posterId];

      setState(prevState => ({
        ...prevState,
        films: [],
        posters: [],
        currentPoster: [currentPoster],
        reviewPage: true,
      }));
    }
    // return to the landing page
    else {
      renderAllPosters();
      setState(prevState => ({
        ...prevState,
        films: [],
        currentPoster: [],
        reviewPage: false,
      }));
  
    } 
  }

  const allFilmPosters = state.posters.map((poster, idx) => 
    <img key={idx} src={poster} alt="" className="poster" onClick={() => clickPoster(idx)}/>
  );

  const currentFilm = <img src={state.currentPoster} alt="" className="poster-review" onClick={() => clickPoster(null)}/>

  // =================
  // display reviews
  // =================

  const allReviews = state.filmReviews.map((review, idx) => 
    <Review key={idx} data={review} onClick={handleDelete}/>
  );

  // =================
  // handler functions
  // =================

  function handleChange(e) {
    
    setState(prevState => ({
        ...prevState,
        newReview: {
          ...prevState.newReview,
          [e.target.name]: e.target.value,
        }
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/database/reviews', {
        method: 'POST',
        headers: {
          'Content-type': 'Application/json',
        },
        body: JSON.stringify(state.newReview),
      }).then(res => res.json());

      getReviews();
      setState(prevState => ({
        ...prevState,
        newReview: {
          review: ""
        },
      }));
    } 
    catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(id) {
    try {
      const filmReviews = await fetch(`http://localhost:3001/database/reviews/${id}`, {
        method: 'DELETE',
      }).then(res => res.json());
      setState(prevState => ({
        ...prevState,
        filmReviews
      }));
    } catch (error) {
      console.log(error);
    }
  }

  // =================
  // display page
  // =================

  if(!state.reviewPage){
    return (
      <>
      <Header />
      <section className="flex-container">
        <div className="row">
            {/* {allFilms} */}
            {allFilmPosters}
        </div>
        
      </section>
      </>
    );
  } else {
    return(
      <>
        <Header />
        <section className="flex-container">
          {currentFilm}
          <form onSubmit={handleSubmit}>
              <span>Review:</span>
              <textarea name="review" value={state.newReview.review} onChange={handleChange}rows="4" cols="50" />
              <button>Submit</button>
          </form>
      
          <div>
            {allReviews}
          </div>
        </section>
      </>
    )
  }
}