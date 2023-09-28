import "./style.css"
interface ConfInf{
    functionButton?:  any;
    text: string;
    personalizedStyle?: any;
}

export default function BasicButton(props:ConfInf){
   return(
        <button className="btn_basic" 
        style={props.personalizedStyle}
        onClick={props.functionButton}>
            {props.text}
        </button>
   ) 
}