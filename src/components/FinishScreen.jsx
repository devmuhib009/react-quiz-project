export default function FinishScreen({points, maxPossiblePoints, highscore, dispatch}){
    const percentage = (points/maxPossiblePoints) * 100;

    let emoji;

    if(percentage === 100) emoji = '🏆';
    if(percentage >= 80 && percentage < 100) emoji = '🍟';
    if(percentage >= 34 && percentage < 80) emoji = '🧁';
    if(percentage <= 33) emoji = '🥹';

    return(
        <>
        <p className="result">
            {emoji} You scored <strong>{points}</strong> out of {maxPossiblePoints} which is {Math.ceil(percentage)}%
        </p>
        <p className="highscore">
            {`Highscore: ${highscore}`}
        </p>
        <button className="btn btn-ui" onClick={() => dispatch({type: 'restart'})}>Restart Quiz</button>
        </>
    )
}