import { useReducer } from "react"

export default function Counter(){

    function reducer(state, action){

        switch(action.type){
            case "INC":
                return {...state, count: state.count + state.step }
            case "DEC":
                return {...state, count: state.count - state.step }
            case "setCount":
                return {...state, count: action.payload }
            case "INCSTEP":
                return {...state, step: state.step + 1}
            case "DECSTEP":
                return {...state, step: state.step - 1}
            case "SETSTEP":
                return {...state, step: action.payload}
            default:
                throw new Error("Unknown Action Type");
        }

    }
    const initialState = {count:0, step:1}
    const [state, dispatch] = useReducer(reducer, initialState);
    const {count, step} = state;
   
    return(
        <>
           <div>
                <p>Steps: {step}</p>
                <button onClick={() => dispatch({type:"INCSTEP"})}>+</button>
                <input type="text" value={step} onChange={(e) => dispatch({type:"SETSTEP", payload: Number(e.target.value)})}/>
                <button onClick={() => dispatch({type:"DECSTEP"})}>-</button>
           </div>
           <div>
                <p>Count: {count}</p>
                <button onClick={() => dispatch({type:"INC"})}>+</button>
                <input type="text" value={count} onChange={(e) => dispatch({type:"setCount", payload:(Number(e.target.value))})}/>
                <button onClick={() => dispatch({type:"DEC"})}>-</button>
           </div>
           
        </>
    )
}