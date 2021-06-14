import { useState, useEffect } from "react";
import "./App.css";
import Film from "./components/Film";
import f00 from './assets/00.jpg';
import f01 from './assets/01.jpg';
import f02 from './assets/02.jpg';
import f03 from './assets/03.jpg';

export default function App() {
  const [state, setState] = useState({
    films: [],
    posters: [f00, f01, f02, f03],
    currentPoster: [],
    viewingMovie: false,
    newReview: {
      review: "",
    },
  });


  async function getAppData() {
    const films = await fetch('https://ghibliapi.herokuapp.com/films')
    .then(res => res.json())

    //console.log(films);
    
    setState(prevState => ({
      ...prevState,
      films
    }));
  }
  useEffect(function() {
    
    getAppData();

  }, [])

  // importing film info

  function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  
  const images = importAll(require.context('./assets', false, /\.(png|jpe?g|svg)$/));

  const allFilms = state.films.map((film, idx) => 
    <Film key={idx} data={film} imgDb={images} />
  );

  // film posters

  const allFilmPosters = state.posters.map((poster, idx) => 
    <img src={poster} alt="" className="poster" onClick={() => clickPoster()} />
  );

  function clickPoster() {
    if(!state.viewingMovie){

      setState(prevState => ({
        films: [],
        posters: [f00],
        viewingMovie: true,
      }));
    }
    else {
      setState(prevState => ({
        films: [],
        posters: [f00, f01, f02, f03],
        viewingMovie: false,
      }));
  
    }
  }

  // handler functions

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
      const review = await fetch('http://localhost:3001/database/reviews', {
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

    } 
    catch (error) {
      console.log(error);
    }
  }

  return (
    <section className="flex-container">
      <h2>At the Bus Stop</h2>
      <div className="row">
          {/* {allFilms} */}
          {allFilmPosters}
      </div>
      <form onSubmit={handleSubmit}>
        <span>Review:</span>
        <input name="review" value={state.newReview.review} onChange={handleChange}/>
        <button>Submit</button>
      </form>
    </section>
  );
}