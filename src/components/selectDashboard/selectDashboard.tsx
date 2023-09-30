import "./style.css"
interface InfConf{
    vals: any;
    filterGet: any;
    setFilterGet: any;
    filterField: any;
}
export default function SelectDashboard(props:InfConf){
    return(
        <select  
        className="input_select_dashboard" 
        id="itens" 
        name="itens"
        onChange={(e)=>{props.setFilterGet((inf:any)=>({...props.filterGet,  [props.filterField]:e.target.value}))}}>
            {props.vals.map((val:any)=>
                <option className="select_dashboard" value={val.name}>{val.name}</option>
            )}
        </select>
    )
}