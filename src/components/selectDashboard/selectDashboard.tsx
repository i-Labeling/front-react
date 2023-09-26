import "./style.css"
export default function SelectDashboard(){
    return(
        <select  className="input_select_dashboard" id="itens" name="itens">
            <option className="select_dashboard" value="1">Tipo 1</option>
            <option className="select_dashboard" value="2">Tipo 2</option>
        </select>
    )
}