import "./style.css"
interface ConfInf{
    tittle:string;
    val:string;
}
export default function CardDashboard(props:ConfInf){
    return(
        <div className="container_card_dashboard">
            <div className="container_card_menu_dashboard">
                <h1 className="title_card_dashboard">{props.tittle}</h1>
            </div>
            <div className="content_card_dashboard">
                <p>
                    {props.val}
                </p>
            </div>
        </div>
    )
}