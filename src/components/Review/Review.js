import styles from './Review.module.css';

function Review(props) {
    return(
        <section>
            <article className={styles.review}>
                <div>{props.data.review}</div>
                <div className={styles.controls} onClick={() => props.onClick(props.data._id)}>{'Delete'}</div>
            </article>
        </section>
    )
}

export default Review;