import React from 'react';
import { FaWhatsapp } from "react-icons/fa";
import { LuClock9 } from "react-icons/lu";

export const Flag_Header = () => {
  return (
    <div id='flag_header'>
        <div>
        <span>El mejor surtido para tu farmacia o negocio.</span>
        <span><FaWhatsapp /> 56 3571 2250  </span> 
        <span><LuClock9 /> L-V de 9:00-18:00 y S de 9:00-16:00</span>
        </div>
    </div>
  )
}
