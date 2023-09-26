import {useState} from "react"
import "./style.css"
export default function BoxSetup(){
    const [infs,setInfs] = useState([
        {inf: "IBM - .  - IT CUSTOMER"},
        {inf: "IBM - .  - IT CUSTOMER"},
        {inf: "IBM - .  - IT CUSTOMER"}
    ])
    return(
        <div className="container_inf_setup">
            <h1 className="title">
                Setup I-Labeling
            </h1>
            <ul className="list_inf">
                {
                    infs.map((inf,index)=>(
                        <li key={index} className="inf">
                           {inf.inf} 
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}