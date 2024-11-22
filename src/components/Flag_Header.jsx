import React from 'react';
import { FaWhatsapp } from "react-icons/fa";
import { LuClock9 } from "react-icons/lu";

export const Flag_Header = () => {
  return (
    <div id='flag_header'>
        <div>
        <span>El mejor surtido para tu farmacia o negocio.</span>
        <span><FaWhatsapp /> 55 1093 5095  </span> 
        <span><LuClock9 /> L-V de 8:00-18:00 y S de 8:00-16:00</span>
        </div>
    </div>
  )
}
