import styles from './Film.module.css';

function Film(props) {
    return(
        <div className={styles.card}>
            {props.data.title}
            {/* <img src={require( `${ props.imgDb[0].src }` )} /> */}
            {/* <img src={require('../assets/00.jpg').default} alt="invalid" /> */}
        </div>
    )
}

export default Film;
