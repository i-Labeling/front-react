import "./cardLog.css"
interface ConfInf{
    icon:any;
    title: string;
    val: string;
    style?:object;
}
export default function CardLog(props:ConfInf){
    return(
        <div className="container_card_log">
            <div className="container_icon_log">
                {props.icon}
            </div>
            <div className="container_inf">
                <div className="container_header_card">
                    <h2 className="title_card">
                        {props.title}
                    </h2>
                </div>
                <div className="container_content_card" style={props.style}>
                    <h2 className="val">
                        {props.val}
                    </h2>
                </div>
            </div>
        </div>
    )
}