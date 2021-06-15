import { useState, useEffect } from "react";
import "./App.css";
import Film from "./components/Film/Film";
import Review from "./components/Review/Review";
import posterList from "./assets/posterList";

import Header from './components/Header/Header';


export default function App() {
  const [state, setState] = useState({
    films: [], 
    posters: [],
    currentPoster: [],
    viewingMovie: false,
    newReview: {
      review: "",
    },
    filmReviews: [{}],
  });

  useEffect(function() {
    getAppData();
    renderAllPosters();
    getReviews();

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

  function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  
  const images = importAll(require.context('./assets', false, /\.(png|jpe?g|svg)$/));

  const allFilms = state.films.map((film, idx) => 
    <Film key={idx} data={film} imgDb={images} />
  );

  // =================
  // film posters
  // =================
 
  function renderAllPosters() {
    state.posters = Object.values(posterList);
  };

  function clickPoster(imageId) {
    if(!state.viewingMovie){
      const testPoster = 'f0' + imageId;
      const currentPoster = posterList[testPoster];
      setState(prevState => ({
        ...prevState,
        films: [],
        posters: [currentPoster],
        viewingMovie: true,
      }));
    }
    else {
      renderAllPosters();
      setState(prevState => ({
        ...prevState,
        films: [],
        viewingMovie: false,
      }));
  
    }
  }

  const allFilmPosters = state.posters.map((poster, idx) => 
    <img src={poster} alt="invalid" className="poster" onClick={() => clickPoster(idx)} />
  );

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

      setState(prevState => ({
        ...prevState,
        newReview: {
          review: ""
        },
    }));

    getReviews();

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

  return (
    <>
    <section className="flex-container">
      <Header />
      <div className="row">
          {/* {allFilms} */}
          {allFilmPosters}
      </div>
      <form onSubmit={handleSubmit}>
        <span>Review:</span>
        <input name="review" value={state.newReview.review} onChange={handleChange}/>
        <button>Submit</button>
      </form>
      <div>
        {allReviews}
      </div>
    </section>
    </>
  );
}