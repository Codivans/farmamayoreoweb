import imgBanner from './../assets/banner.webp';
import imgCuadrada1 from './../assets/cuadrada1.webp';

export const Banner_principal = () => {
  return (
    <div id='container_banners'>
        <div id='banner_top'>
            <div className='banner_auto'>
                <img src={imgBanner} />
            </div>
            <div className='banner_cuadrado'>
                <img src={imgCuadrada1} />
            </div>
        </div>
        
    </div>
  )
}
