import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Home, Search, AltaCatalogo, Formularios_session, Perfil_Cliente, Direcciones_clientes } from './pages/index';
import './App.css';
import 'animate.css';
import { CarritoProvider } from './context/cartContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';



function App() {
  
  return (
    <>
    <AuthProvider>
      <CarritoProvider>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<Formularios_session />}/>
          <Route path='/mi_perfil' element={<Perfil_Cliente />}/>

          <Route path='/direcciones_perfil' element={<Direcciones_clientes />}/>

          {/* <Route element={<ProtectedRoute />}> */}
            <Route path='/search/:modulo/:searchTerm/' element={<Search />}/>
          {/* </Route> */}
        
          <Route path='/admin/alta/catalogo' element={<AltaCatalogo />} />
        </Routes>
      </CarritoProvider>
    </AuthProvider>
    
    </>
  )
}

export default App
