import styles from './Review.module.css';

function Review(props) {
    return(
        <section>
            <article className={styles.review}>
                <div>{props.data.review}</div>
                <div onClick={() => props.onClick(props.data._id)}>{'Delete Review'}</div>
            </article>
        </section>
    )
}

export default Review;