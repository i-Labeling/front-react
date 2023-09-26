import CardDashboard from "../../components/cardDashboard/cardDashboard"
import Menu from "../../components/menu/menu"
import SelectDashboard from "../../components/selectDashboard/selectDashboard"
import "./style.css"
export default function Dashboard(){
    return(
        <>
            <Menu/>
            <main className="container_page_dashboard">
                <div className="container_menu_header_dashboard">
                    <div className="container_menu_dashboard">
                        <SelectDashboard/>
                        <SelectDashboard/>
                        <SelectDashboard/>
                    </div>
                    <div className="container_date_dashboard">
                        <h1 className="date_dashboard">
                            Data: 20/10/2023
                        </h1>
                    </div>
                </div> 
                <div className="container_cards_dasboard">
                    <CardDashboard tittle="To Rework" val="3"/>
                    <CardDashboard tittle="Labelled" val="3"/>
                    <CardDashboard tittle="Trays Worked" val="3"/>
                    <CardDashboard tittle="Bad On Label" val="3"/>
                    <CardDashboard tittle="Bad On Label" val="3"/>
                    <CardDashboard tittle="Visual Invalidation" val="3"/>
                </div>
                <div className="container_graph">
                </div>      
            </main>
        </>
    )
}