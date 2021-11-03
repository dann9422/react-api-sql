import React, { useState , useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

function App() {
  const baseUrl="https://localhost:44377/api/Client";
  const [data, setData]=useState([]);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);
  const [gestorSeleccionado, setGestorSeleccionado]=useState({
    idclient:'',
    name:'',
    age:'',
    email:'',
    address:''
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setGestorSeleccionado({
      ...gestorSeleccionado,
      [name]: value
    });
    console.log(gestorSeleccionado);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

   const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    delete gestorSeleccionado.idclient;
    await axios.post(baseUrl, gestorSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    
    await axios.put(baseUrl+"/"+gestorSeleccionado.idclient, gestorSeleccionado)
    .then(response=>{
      var respuesta=response.data;
      var dataAuxiliar=data;
      dataAuxiliar.map(gestor=>{
        if(gestor.idclient===gestorSeleccionado.idclient){
          gestor.name=respuesta.name;
          gestor.age=respuesta.age;
          gestor.email=respuesta.email;
          gestor.address=respuesta.address;
        }
      });
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+gestorSeleccionado.idclient)
    .then(response=>{
     setData(data.filter(gestor=>gestor.idclient!==response.data));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarGestor=(gestor, caso)=>{
    setGestorSeleccionado(gestor);
    (caso==="Editar")?
    abrirCerrarModalEditar(): abrirCerrarModalEliminar();
  }

  useEffect(()=>{
    peticionGet();
  },[])

  return (
    <div className="App">
      <br/><br/>
      <button onClick={()=>abrirCerrarModalInsertar()} className="btn btn-success">Insertar Nuevo Gestor</button>
      <br/><br/>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Adrress</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {data.map(gestor=>(
          <tr key={gestor.idclient}>
            <td>{gestor.idclient}</td>
            <td>{gestor.name}</td>
            <td>{gestor.age}</td>
            <td>{gestor.email}</td>
            <td>{gestor.address}</td>
            
            <td>
              <button className="btn btn-primary" onClick={()=>seleccionarGestor(gestor, "Editar")}>Editar</button> {"  "}
              <button className="btn btn-danger" onClick={()=>seleccionarGestor(gestor, "Eliminar")}>Eliminar</button>
            </td>
            </tr>
        ))}
        </tbody>

      </table>

      <Modal isOpen={modalInsertar}>
      <ModalHeader>Insertar Gestor de Base de Datos</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Name: </label>
          <br />
          <input type="text" className="form-control" name="name"  onChange={handleChange}/>
          <br />
          <label>Age: </label>
          <br />
          <input type="number" className="form-control" name="age" onChange={handleChange}/>
          <br />
          <label>Email: </label>
          <br />
          <input type="text" className="form-control" name="email" onChange={handleChange}/>
          <br />
          <label>Adrress: </label>
          <br />
          <input type="text" className="form-control" name="address" onChange={handleChange}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalEditar}>
      <ModalHeader>Editar Gestor de Base de Datos</ModalHeader>
      <ModalBody>
        <div className="form-group">
        <label>ID: </label>
          <br />
          <input type="text" className="form-control" readOnly value={gestorSeleccionado && gestorSeleccionado.idclient}/>
          <br />
          <label>Name: </label>
          <br />
          <input type="text" className="form-control" name="name" onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.name}/>
          <br />
          <label>Age: </label>
          <br />
          <input type="number" className="form-control" name="lanzamiento" onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.age}/>
          <br />
          <label>Email: </label>
          <br />
          <input type="text" className="form-control" name="email" onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.email}/>
          <br />
        
          <label>Adrress: </label>
          <br />
          <input type="text" className="form-control" name="address" onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.address}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>


    <Modal isOpen={modalEliminar}>
        <ModalBody>
        ¿Estás seguro que deseas eliminar el Gestor de Base de datos {gestorSeleccionado && gestorSeleccionado.name}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={()=>abrirCerrarModalEliminar()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
