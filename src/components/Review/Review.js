
function Review(props) {
    return(
        <article>
            <div>{props.data.review}</div>
            <div className="controls" onClick={() => props.onClick(props.data._id)}>{'🗑️'}</div>
        </article>
    )
}

export default Review;