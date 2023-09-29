import {useState} from "react"
import "./style.css"

interface InfConf{
    setupInf: {};
    setSetupInf: any;
}
export default function BoxSetup(props:InfConf){
    const [infs,setInfs] = useState([
        {inf: "IBM - .  - IT CUSTOMER",val:"1"},
        {inf: "IBM - .  - IT CUSTOMER",val:"2"},
        {inf: "IBM - .  - IT CUSTOMER",val:"3"}
    ])
    
    const [selectColor,setSelectedColor] = useState({
        val:"",
        select:false
    });
    const color = (val:string)=>{
        return selectColor.val === val? 
        {
            backgroundColor: "rgb(64, 64, 216)",
            color: "white"
        }
        :
        {
            backgroundColor: "transparent",
            color: "black"
        }
            
    }
    return(
        <div className="container_inf_setup">
            <h1 className="title">
                ILabeling Setup
            </h1>
            {infs.map((inf,index) =>(
                <div 
                className="inf" 
                key={index}
                onClick={()=>{
                props.setSetupInf((e:any)=>({...props.setupInf,customer:inf.inf}));
                setSelectedColor({
                    val: inf.val,
                    select: !selectColor.select
                })
                }}
                style={color(inf.val)}>
                    {inf.inf}
                </div>
            ))}
            
        </div>
    )
}