import {AiOutlineLoading3Quarters} from "react-icons/ai"
import {motion} from "framer-motion"
import "./style.css"
export default function Loading(){
    return(
        <motion.div
            className="container_icon_loading"
            initial={{
                rotate:0,
            }}
            animate={{
                rotate: 360, 
            }}
            transition={{
                duration: 1, 
                repeat:Infinity, 
                ease: 'linear',
                repeatDelay: 0
            }}>
                <AiOutlineLoading3Quarters size="20" />
        </motion.div> 
    )
}