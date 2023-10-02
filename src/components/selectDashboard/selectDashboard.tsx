import { json } from "react-router-dom";
import "./style.css"
interface InfConf{
    vals: any[];
    filterGet: any;
    setFilterGet: any;
    filterField: any;
}
export default function SelectDashboard(props:InfConf){
    const myArray = ["sodimm", "udimm"];
    
    return(
        <select  
        className="input_select_dashboard" 
        id="itens" 
        name="itens"
        onChange={(e)=>{props.setFilterGet((inf:any)=>({...props.filterGet,  [props.filterField]:e.target.value.split(",")}))}}>
            
            {props.filterField == "typeM"?
            <option key={0.0} className="select_dashboard" value={myArray}>blank</option>
            :<option key={0.0} className="select_dashboard" value={props.vals.map((e)=>e.name)}>blank</option>
            }
            {props.vals.map((val:any, index:any)=>
                <option key={index} className="select_dashboard" value={val.name}>{val.name}</option>
            )}
        </select>
    )
}