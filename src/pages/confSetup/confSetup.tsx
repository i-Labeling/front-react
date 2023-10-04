
import { useNavigate } from "react-router-dom"
import BasicButton from "../../components/basiclButton/basicButton"
import BoxSetup from "../../components/boxSetup/boxSetup"
import Menu from "../../components/menu/menu"
import axiosInstance from "../../services/instanceAxios"
import "./style.css"
import { useState,useEffect } from "react"

export default function confSetup(){
    const styleBtn = {
        margin:"20px",
        width: "40%"
    }
    const navigate = useNavigate()
    const [setupInf, setSetupInf] = useState({
        customer: "1",
        serviceOrder: "null",
        amauntMemory: "null",
        typeMemory: "UDIMM",
        inspectionIgnore: false
    })
    const createSetup = async (e:any) =>{
        e.preventDefault()
        await axiosInstance.post('post',{
            customer:setupInf.customer,
            serviceOrder:setupInf.serviceOrder,
            amauntMemory:setupInf.amauntMemory,
            typeMemory:setupInf.typeMemory,
        })
        .then((res)=>{
            console.log(res)
            navigate('/')
        })
        .catch((res)=>console.log(res))
    }
    useEffect(()=>{console.log(setupInf)},[setupInf])
    return(
        <>
            <Menu/>
            <main className="container_page_setup">
                <div className="container_box_conf">
                    <div className="container_menu_box_status">
                        <h1>
                            ILabeling
                        </h1>
                    </div>
                    <BoxSetup setSetupInf={setSetupInf} setupInf={setupInf}/>
                   
                    <form action="" className="container_form_setup">
                        <input type="text" 
                        className="input_text_setup"
                        id="order" 
                        name="order_service" 
                        placeholder="Ordem de Serviço"
                        onChange={(e)=>{setSetupInf(inf=>({...setupInf,serviceOrder:e.target.value}))}}
                        ></input>
                        <input type="text" 
                        className="input_text_setup"
                        id="quantity" 
                        name="quantity" 
                        placeholder="Quantidade de Memorias"
                        onKeyDown={(e)=>{const charCode = e.charCode}}
                        onChange={(e)=>{setSetupInf(inf=>({...setupInf,amauntMemory:e.target.value}))}}
                        ></input>
                        <select  
                        className="input_select_setup" 
                        id="memory" 
                        name="memory"
                        onChange={(e)=>{setSetupInf(inf=>({...setupInf,typeMemory:e.target.value}))}}>
                            <option value="UDIMM">UDIMM</option>
                            <option value="SODIMM">SODIMM</option>
                        </select>
                        <div className="input_checkbox_setup">
                            <input type="checkbox" className="checkbox"
                            checked={!setupInf.inspectionIgnore}
                            onChange={()=>{setSetupInf({ ...setupInf, inspectionIgnore: !setupInf.inspectionIgnore })}}/> 
                            <label className="label_box">Inspection Ignore</label>
                        </div>
                        
                    </form>
                    <BasicButton text="Confirmar" 
                    personalizedStyle={styleBtn}
                    functionButton={createSetup}/>
                </div>
            </main>
        </>
    )
}