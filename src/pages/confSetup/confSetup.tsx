
import { useNavigate } from "react-router-dom"
import BasicButton from "../../components/basiclButton/basicButton"
import BoxSetup from "../../components/boxSetup/boxSetup"
import Menu from "../../components/menu/menu"
import "./style.css"

export default function confSetup(){
    const styleBtn = {
        margin:"20px",
        width: "40%"
    }
    const navigate = useNavigate()
    const toNavigate = ()=> {
        navigate('/')
    }
    return(
        <>
            <Menu/>
            <main className="container_page_setup">
                <div className="container_box_conf">
                    <div className="container_menu_box_status">
                        <h1>
                            IBelling 4.0
                        </h1>
                    </div>
                    <BoxSetup/>
                    <form action="" className="container_form_setup">
                        <input type="text" 
                        className="input_text_setup"
                        id="order" 
                        name="order_service" 
                        placeholder="Ordem de Serviço"></input>
                        <input type="text" 
                        className="input_text_setup"
                        id="quantity" 
                        name="quantity" 
                        placeholder="Quantidade de Memorias"></input>
                        <select  className="input_select_setup" id="cidade" name="cidade">
                            <option value="1">Tipo 1</option>
                            <option value="2">Tipo 2</option>
                        </select>
                    </form>
                    <BasicButton text="Confirmar" 
                    personalizedStyle={styleBtn}
                    functionButton={toNavigate}/>
                </div>
            </main>
        </>
    )
}