import {useState,useEffect} from "react"
import axiosInstance from "../../services/instanceAxios";
import "./style.css"

interface InfConf{
    setupInf: {};
    setSetupInf: any;
}
interface Costumer{
    name: string;
}
export default function BoxSetup(props:InfConf){
    const [infs,setInfs] = useState<Costumer[]>([])

    const getCostumers = async () =>{
        await axiosInstance.get('costumer')
            .then((res)=>{
                setInfs(res.data)
            })
            .catch((res)=>console.log(res))
    }

    useEffect(()=>{
        getCostumers()
    },[])
    
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
                i-Labeling Setup
            </h1>
            {infs.map((inf,index) =>(
                <div 
                className="inf" 
                key={index}
                onClick={()=>{
                props.setSetupInf((e:any)=>({...props.setupInf,customer:inf.name}));
                setSelectedColor({
                    val: inf.name,
                    select: !selectColor.select
                })
                }}
                style={color(inf.name)}>
                    {inf.name}
                </div>
            ))}
            
        </div>
    )
}