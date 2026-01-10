
import { Routes, Route, Router } from "react-router-dom";
import { Home, Search, AltaCatalogo, Formularios_session, Perfil_Cliente, Direcciones_clientes, Shop, ConfigShop, Detalle_shop, 
  UploadConstancia, UploadFile, Order_send, Pedidos_clientes, Pedidos_admin, 
  Clientes,
  AltaProductosTop,
  Formularios_registro,
  RecuperarPassword, AdminRangosEnvio} from './pages/index';
import './App.css';
import 'animate.css';
import { CarritoProvider } from './context/cartContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { ScrollToTop } from "./components/ScrollToTop"


function App() {
  
  return (
    <>
    <Toaster
      position="top-center"
      reverseOrder={false}
    />
    
    <AuthProvider>
      <CarritoProvider>

        <ScrollToTop />      


        <Routes>  
          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<Formularios_session />}/>
          <Route path='/registro' element={<Formularios_registro />}/>
          <Route path='/recuperar' element={<RecuperarPassword />}/>

          <Route path='/mi_perfil' element={<Perfil_Cliente />}/>

          <Route path='/direcciones_perfil' element={<Direcciones_clientes />}/>
          <Route path='/pedidos_perfil' element={<Pedidos_clientes />}/>

          <Route element={<ProtectedRoute />}>
            <Route path='/search/:modulo/:searchTerm/' element={<Search />}/>
            <Route path='/shop/:nameShop/shopid/:shopid' element={<Shop />}/>
            <Route path='/detalle_shop' element={<Detalle_shop/>}/>
            <Route path='/order_send/:orden' element={<Order_send/>}/>

            <Route path='/upload' element={<UploadFile/>}/>
          </Route>
        
          <Route path='/admin/pedidos' element={<Pedidos_admin />} />
          <Route path='/admin/clientes' element={<Clientes />} />

          <Route path='/admin/alta/catalogo' element={<AltaCatalogo />} />
          <Route path='/admin/alta/catalogotop' element={<AltaProductosTop />} />
          <Route path='/admin/configuraciones' element={<ConfigShop />} />
          <Route path='/documentos' element={<UploadConstancia />}/>
          <Route path='/admin/rangos' element={<AdminRangosEnvio />} />
        </Routes>
      </CarritoProvider>
    </AuthProvider>
    
    </>
  )
}

export default App
