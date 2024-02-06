import React, { useState, useEffect, Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { colors } from "react-native-elements";
import * as SQLite from "expo-sqlite";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginForm from "./LoginForm";
import Navigation from "../navegations/Navegation";
import { AuthContext } from "../components/Context";
import moment from "moment";
import { Button } from "react-native-elements";
import NetInfo from "@react-native-community/netinfo";
import { err } from "react-native-svg";

const APIpedidosvendedor =
  "https://app.cotzul.com/Pedidos/getPedidosVendedor.php?idvendedor=";
  const APIpedidosvendedorEnviados =
  "https://app.cotzul.com/Pedidos/getPedidosVendedorEnviados.php?idvendedor=";
const APItransportes = "https://app.cotzul.com/Pedidos/pd_getTransporte.php";
const APIVendedores = "https://app.cotzul.com/Pedidos/getVendedoresList.php";
const APIClientes =
  "https://app.cotzul.com/Pedidos/getClientes.php?&idvendedor=";
const APITarifas =
  "https://app.cotzul.com/Pedidos/pd_getTarifa.php?ttcodigo=1&tarifa=1";
const APIPlazo = "https://app.cotzul.com/Pedidos/pd_getPlazo.php?notidplazo=1";
const APIItem = "https://app.cotzul.com/Pedidos/getItems.php";
const APIDatosPedidos =
  "https://app.cotzul.com/Pedidos/getDatosPedidoxVendedor.php?idvendedor=";

const APITranstarifa = "https://app.cotzul.com/Pedidos/pd_gettranstarifa.php";
const APITransubicacion = "https://app.cotzul.com/Pedidos/pd_gettransubicacion.php";

const database_name = "CotzulBD2.db";
const database_version = "2.0";
const database_displayname = "CotzulBD";
const database_size = 200000;

const STORAGE_KEY = "@save_data";
const STORAGE_DATE = "@save_date";




export default function CargarInformacion() {
  const [loading, setLoading] = useState(false);  
  const [activo, setActivo] = useState(0);


  const [usuario, setUsuario] = useState(false);
  const [dataUser, setdataUser] = useState(defaultValueUser());

  const [fechault, setFechaUlt] = useState("#####");
  const {signUp} = React.useContext(AuthContext);
  const [internet, setInternet] = useState(true);

  const getDataUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      console.log("si entrego carga informacion: " + jsonValue);
      setdataUser(JSON.parse(jsonValue));
      setUsuario(true);
      getDateLast();
      reviewInternet();
      console.log("INGRSA A PRODUCTO: " + dataUser.vn_nombre);
    } catch (e) {
      console.log("Error al coger el usuario");
      console.log(e);
    }
  };

  const fechaActual = {
    parametros: [
      {
        pa_codigo: "ACTFECHA",
        pa_valor: moment().format("DD-MM-yyyy HH:mm:ss").toString(),
      },
    ],
  };

  const setDateLast = async (value) => {
    try {
      await AsyncStorage.setItem(STORAGE_DATE, value);
      setFechaUlt(value);
    } catch (e) {
      console.log(e);
    }
  };

  const getDateLast = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_DATE);
      console.log("****** FECHA/HORA: "+jsonValue);
      setFechaUlt(jsonValue);
      
    } catch (e) {
      // console.log(e)
      setFechaUlt("--------");
    }
  };

  const reviewInternet = () =>{
    NetInfo.fetch().then(state => {
        console.log("Connection type cargaIn", state.type);
        console.log("Is connected?", state.isConnected);
        setInternet(state.isConnected)
    });
} 



  let db = null;

  function defaultValueUser() {
    return {
      vn_codigo: "",
      vn_nombre: "",
      vn_usuario: "",
      vn_clave: "",
      vn_recibo: "",
    };
  }

  const myFunction = () => {
   // console.log('Función ejecutada');
    reviewInternet();
  };


  useEffect(() => {
    
    const interval = setInterval(myFunction, 5000);
    if (dataUser) {
      if (!usuario) {
        console.log("Ingreso 1 vez");
        getDataUser();
      }
    }
  }, []);

  useEffect(() => {
    if(activo == 1){
      setLoading(true);
      actualizarTablas();
    }
    if(activo == 2){
      setLoading(false);
    }
  }, [activo]);




  const sincronizarDatos = async () => {
    try {
      if(internet){
        console.log("Se esta cargando los datos");
        setActivo(1);
        setDateLast(moment(new Date()).format('DD/MM/YYYY HH:mm:ss').toString());
        ActualizarUsuario(moment(new Date()).format('DD/MM/YYYY HH:mm:ss').toString());
      // setFechaUlt(moment(new Date()).format('DD/MM/YYYY hh:mm a').toString());
      } else {
        Alert.alert("Su dispositivo no cuenta con internet");
      }
      
      
    } catch (error) {
      console.log("un error cachado listar pedidos");
      console.log(error);
    }
  };

  const ActualizarUsuario = (fechita) => {

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    console.log("Ingresando a usuario...");

    const dataUsermod = Object.assign({}, dataUser, {
        vn_codigo: dataUser.vn_codigo,
        vn_nombre: dataUser.vn_nombre,
        vn_clave: dataUser.vn_clave,
        vn_recibo: dataUser.vn_recibo,
        vn_borrador: dataUser.vn_borrador,
        vn_loading: dataUser.vn_loading+1,
        vn_fechaloading: dataUser.vn_fechaloading,
        vn_login: dataUser.vn_login,
      }); 

      setdataUser(dataUsermod);
      console.log("Usuario loading: "+dataUser.vn_loading);

    db.transaction((txn) => {
      txn.executeSql("UPDATE usuario SET us_loading = ?, us_fechaloading = ? WHERE us_numunico = 1",[Number(dataUser.vn_loading+1),fechita],(txn, results) => {
        console.log("Usuario Afectados: "+ results.rowsAffected);
        if (results.rowsAffected > 0) {
          
          console.log("Valor afectado us_loading: "+ (dataUser.vn_loading+1) + "fecha loading: "+ (dataUser.vn_fechaloading));
          //Alert.alert("Valor afectado us_loading: "+ (dataUser.vn_loading+1) + "fecha loading: "+ (dataUser.vn_fechaloading));
        }
      });
    });


  }

  /** FIN PARAMETROS**/

  /** TABLAS **/
  async function actualizarTablas() {
    console.log("Ingreso 2 vez");
     obtenerClientes()
     
      /*datospedidos(),*/

  }
  /** FIN TABLAS **/

  /** PEDIDOS VENDEDOR **/
  const obtenerPedidosVendedor = async () => {
    console.log("GET API pedidovendedor");
    const response = await fetch(APIpedidosvendedor+dataUser.vn_codigo);
    console.log(APIpedidosvendedor+dataUser.vn_codigo);
    const jsonResponse = await response.json();
    console.log("PEDIDOS VENDEDORES: "+jsonResponse?.pedidovendedor);

    savePedidosVendedor(jsonResponse);
  };

  savePedidosVendedor = (myResponse) => {
    console.log("GUARDA REGISTROS pedidovendedor");

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    const pedidoList = myResponse?.pedidovendedor;
    console.log(pedidoList);

    var cont = 0;

    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS pedidosvendedor");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "pedidosvendedor " +
          "(pv_codigo INTEGER, pv_codigovendedor INTEGER,  pv_vendedor VARCHAR(100), pv_codcliente INTEGER, pv_cliente VARCHAR(200)," +
          "pv_total VARCHAR(50), pv_estatus INTEGER, pv_gngastos VARCHAR(100), pv_numpedido INTEGER, pv_online INTEGER, pv_estatusimg INTEGER, pv_nombrearchivo VARCHAR(100));"
      );

      let totalPedido = myResponse?.pedidovendedor.length;
      let insertedCount = 0;

      pedidoList.forEach((ped) => {
        txn.executeSql(
          "INSERT INTO pedidosvendedor(pv_codigo,pv_codigovendedor,pv_vendedor,pv_codcliente,pv_cliente,pv_total,pv_estatus,pv_gngastos,pv_numpedido,pv_online, pv_estatusimg, pv_nombrearchivo) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); ",
          [
            Number(ped.pv_codigo),
            Number(ped.pv_codvendedor),
            ped.pv_vendedor,
            Number(ped.pv_codcliente),
            ped.pv_cliente,
            ped.pv_total,
            ped.pv_estatus,
            ped.pv_gngastos,
            Number(ped.pv_numpedido),
            Number(1),
            Number(ped.pv_estatusimg),
            ped.pv_nombrearchivo
          ],
          (txn, results) => {
            insertedCount++;
            cont++;
            if(totalPedido == insertedCount){
              listarPedidosVendedor();
            }
          }
        );
      });
    });

    
  };

  const listarPedidosVendedor = () => {
    console.log("LISTAR pedidovendedor cargarinfomracion");
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );


    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM pedidosvendedor", [], (tx, results) => {
        var len = results.rows.length;
        console.log("total pedidos vendedor: "+ len);
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          console.log(`PEDIDOS VENDEDOR: ` + JSON.stringify(row));
        }
        datospedidos();
      });
    });
   
    
  };
  /** FIN PEDIDOS VENDEDOR **/

  /** TRANSPORTES **/
  const obtenerTransportes = async () => {
    console.log("GET API transportes");
    const response = await fetch(APItransportes);
    const jsonResponse = await response.json();

    saveTransportes(jsonResponse);
  };

  saveTransportes = (myResponse) => {
    console.log("GUARDA REGISTROS transportes");

    const itemTrans = myResponse?.transporte;
    console.log(itemTrans);

    let totalTrans = myResponse?.transporte.length;
    let insertedCount = 0;

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS transportes");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "transportes " +
          "(pl_codigo INTEGER, pl_razon VARCHAR(200)," +
          "pl_nombre VARCHAR(200), pl_visible VARCHAR(10));"
      );


      itemTrans.forEach((trans) => {
        txn.executeSql(
          "INSERT INTO transportes(pl_codigo,pl_razon,pl_nombre,pl_visible) " +
            " VALUES (?, ?, ?, ?); ",
          [
            Number(trans.pl_codigo),
            trans.pl_razon,
            trans.pl_nombre,
            trans.pl_visible,
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              insertedCount++;
              cont++;
              if(insertedCount == totalTrans)
                listarTransportes();
            } 
          }
        );
      });
    });

   
  };

  const listarTransportes = () => {
    console.log("LISTAR transportes");
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM transportes", [], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          console.log(`TRANSPORTE: ` + JSON.stringify(row));
        }
        obtenerVendedores();
      });
    });
    
  };
  /** FIN TRANSPORTES **/

  /** VENDEDORES **/
  const obtenerVendedores = async () => {
    console.log("GET API vendedores");
    const response = await fetch(APIVendedores);
    const jsonResponse = await response.json();

    saveVendedores(jsonResponse);
  };

  saveVendedores = (myResponse) => {
    console.log("GUARDA REGISTROS vendedores");

    const itemVend = myResponse?.vendedores;
    console.log(itemVend);

    let totalVend = myResponse?.vendedores.length;
    let insertedCount = 0;

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS vendedores");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "vendedores " +
          "(vd_codigo INTEGER, vd_vendedor VARCHAR(200));"
      );

      itemVend.forEach((vend) => {
        txn.executeSql(
          "INSERT INTO vendedores(vd_codigo,vd_vendedor) " + " VALUES (?, ?); ",
          [Number(vend.vd_codigo), vend.vd_vendedor],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
              insertedCount++;
              if(insertedCount == totalVend)
                listarVendedores();
            }
          }
        );
      });
    });

    
  };

  const listarVendedores = () => {
    console.log("LISTAR vendedores");
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM vendedores", [], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          console.log(`VENDEDORES: ` + JSON.stringify(row));
        }
        obtenerPlazo();
      });
    });
    
  };
  /** FIN VENDEDORES **/

  /** CLIENTES **/
  const obtenerClientes = async () => {


    console.log("GET API clientes: "+APIClientes+dataUser.vn_codigo);
    const response = await fetch(APIClientes+dataUser.vn_codigo);
    const jsonResponse = await response.json();
    console.log("Response Cliente: "+jsonResponse.clientes);
    saveClientes(jsonResponse);
  };

  saveClientes = (myResponse) => {
    console.log("GUARDA REGISTROS Clientes");

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    let clienteList = myResponse?.clientes;
    console.log(clienteList);

    var cont = 0;
    db.transaction((txn) => {
      console.log("entro a Clientes");
      txn.executeSql("DROP TABLE IF EXISTS clientes");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "clientes " +
          "(ct_codigo INTEGER, ct_cedula VARCHAR(20), ct_tipoid VARCHAR(20)" +
          ", ct_cliente VARCHAR(200) , ct_telefono  VARCHAR(50), ct_direccion VARCHAR(200)  " +
          ", ct_correo VARCHAR(200) , ct_cupoasignado  VARCHAR(50), ct_cupodisponible VARCHAR(50)  " +
          ", ct_idplazo VARCHAR(10) , ct_plazo  VARCHAR(50), ct_tcodigo VARCHAR(50)  " +
          ", ct_idvendedor VARCHAR(10) , ct_usuvendedor  VARCHAR(10), ct_ubicacion VARCHAR(10)  " +
          ", ct_ciudad VARCHAR(50)   );"
      );

      let totalCliente = myResponse?.clientes.length;
      console.log(totalCliente);
      let insertedCount = 0;


      let cli;
      clienteList.forEach((cliente) => {
        cli = cliente;
        txn.executeSql(
          "INSERT INTO clientes(ct_codigo,ct_cedula,ct_tipoid" +
            ", ct_cliente  , ct_telefono , ct_direccion   " +
            ", ct_correo  , ct_cupoasignado , ct_cupodisponible   " +
            ", ct_idplazo  , ct_plazo , ct_tcodigo   " +
            ", ct_idvendedor  , ct_usuvendedor , ct_ubicacion   " +
            ", ct_ciudad) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?); ",
          [
            Number(cli.ct_codigo),
            cli.ct_cedula,
            cli.ct_tipoid,
            cli.ct_cliente,
            cli.ct_telefono,
            cli.ct_direccion,
            cli.ct_correo,
            cli.ct_cupoasignado,
            cli.ct_cupodisponible,
            cli.ct_idplazo,
            cli.ct_plazo,
            cli.ct_tcodigo,
            cli.ct_idvendedor,
            cli.ct_usuvendedor,
            cli.ct_ubicacion,
            cli.ct_ciudad,
          ],
          (txn, results) => {
            console.log("Prueba de descarga Clientes");
            if (results.rowsAffected > 0) {
              insertedCount++;
              cont++;
              if(totalCliente == insertedCount){
                listarClientes();
              }
            }
          },
          (txn, error) => {
              console.log('Error al insertar el cliente:', error.message); // Imprime el mensaje de error
          }
        );
      });
    });

    
  };

  const listarClientes = () => {
    console.log("LISTAR clientes");
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM clientes", [], (tx, results) => {
        var len = results.rows.length;
        console.log("cantidad de Clientes: "+len);
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          console.log(`CLIENTES: ` + JSON.stringify(row));
          
        }
         obtenerItems();
      });
      
    });
    
  };
  /** FIN CLIENTES **/

  /** PLAZO **/
  const obtenerPlazo = async () => {
    console.log("GET API Plazo");
    const response = await fetch(APIPlazo);
    const jsonResponse = await response.json();

    savePlazos(jsonResponse);
  };

  savePlazos = (myResponse) => {
    console.log("GUARDA REGISTROS plazos");

    const itemPlazo = myResponse?.plazo;
    console.log(itemPlazo);

    let totalPlazo = myResponse?.plazo.length;
    let insertedCount = 0;

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS plazos");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "plazos " +
          "(pl_codigo INTEGER, pl_descripcion VARCHAR(20)" +
          ", pl_notaidplazo VARCHAR(10)  );"
      );

      itemPlazo.forEach((pla) => {
        txn.executeSql(
          "INSERT INTO plazos(pl_codigo,pl_descripcion" +
            ", pl_notaidplazo) " +
            " VALUES (?, ?, ?); ",
          [Number(pla.pl_codigo), pla.pl_descripcion, "1"],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
              insertedCount++;
              if(insertedCount == totalPlazo)
                listarPlazos();
            }
          }
        );
      });
    });

    
  };

  const listarPlazos = () => {
    console.log("LISTAR plazos");
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM plazos", [], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          console.log(`PLAZOS: ` + JSON.stringify(row));
        }
        obtenerTarifas();
      });
    });
    
  };
  /** FIN PLAZO **/

  /** TARIFA **/
  const obtenerTarifas = async () => {
    console.log("GET API Tarifa");
    const response = await fetch(APITranstarifa);
    const jsonResponse = await response.json();

    saveTarifas(jsonResponse);
  };

  saveTarifas = (myResponse) => {
    console.log("GUARDA REGISTROS transtarifa");

    const itemTarifa = myResponse?.transtarifas;
    console.log(itemTarifa);

    let totalTarifa = myResponse?.transtarifas.length;
    let insertedCount = 0;

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS transtarifas");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "transtarifas " +
          "(tt_codigo INTEGER, tt_idtransporte INTEGER, tt_idtarifa INTEGER" +
          ", tt_peso FLOAT, tt_tarifa1 FLOAT, tt_tarifa2 FLOAT, tt_estado VARCHAR(2), tt_usuarioing INTEGER);"
      );

      itemTarifa.forEach((tar) => {
        txn.executeSql(
          "INSERT INTO transtarifas(tt_codigo,tt_idtransporte,tt_idtarifa" +
            ", tt_peso,tt_tarifa1,tt_tarifa2, tt_estado, tt_usuarioing) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?); ",
          [
            tar.tt_codigo,
            tar.tt_idtransporte,
            tar.tt_idtarifa,
            tar.tt_peso,
            tar.tt_tarifa1,
            tar.tt_tarifa2,
            tar.tt_estado,
            tar.tt_usuarioing
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              insertedCount++;
              cont++;
              if(insertedCount == totalTarifa)
                listarTarifas();
            }
          }
        );
      });
    });

    
  };

  const listarTarifas = () => {
    console.log("LISTAR transtarifas");
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM transtarifas", [], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          console.log(`TARIFAS: ` + JSON.stringify(row));
        }
        obtenerUbicacion();
      });
    });
    
    
    //datospedidos();
    
  };

  const obtenerUbicacion = async () => {
    console.log("GET API Ubicacion");
    const response = await fetch(APITransubicacion);
    const jsonResponse = await response.json();

    saveUbicacion(jsonResponse);
  };

  saveUbicacion = (myResponse) => {
    console.log("GUARDA REGISTROS transubicacion");

    const itemUbi = myResponse?.transubicacion;
    console.log(itemUbi);

    let totalUbi = myResponse?.transubicacion.length;
    let insertedCount = 0;

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS transubicacion");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "transubicacion " +
          "(tu_codigo INTEGER, tu_descripcion VARCHAR(20));"
      );

      itemUbi.forEach((ubi) => {
        txn.executeSql(
          "INSERT INTO transubicacion(tu_codigo,tu_descripcion) " +
            " VALUES (?, ?); ",
          [
            ubi.tu_codigo,
            ubi.tu_descripcion
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              insertedCount++;
              cont++;

              if(insertedCount == totalUbi)
                listarTransUbicacion();
            }
          }
        );
      });
    });

    
  };

  const listarTransUbicacion = () => {
    console.log("LISTAR transubicacion");
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM transubicacion", [], (tx, results) => {
        var len = results.rows.length;
        let i = 0;
        for (i = 0; i < len; i++) {
          let row = results.rows.item(i);
          console.log(`TARIFAS UBICACION: ` + JSON.stringify(row));
          
        }

        if(i == len){
          if(dataUser.vn_loading > 1){
            console.log("entro a recarga");
            ActualizarPedidosOffline();
            
          }else{
            obtenerPedidosVendedor();
          }
        }
      });
    });

    
    
    

   //obtenerPedidosVendedor();



    
  };
  /** FIN TARIFA **/

  const ActualizarPedidosOffline = async () =>{
    try{

      db = SQLite.openDatabase(
        database_name,
        database_version,
        database_displayname,
        database_size
      );

     
          var pvcodigo = 0;
          var pvcodigovendedor = 0;
          var pvcodcliente = 0;

       
          var dpfecha = "";
          var dpobservacion = "";
          var dptipodoc = "";
          var dptipodesc = "";
          var dpporcdesc = 0;
          var dpvalordesc = 0;
          var dptransporte = 0;
          var dpseguro = 0;
          var dpiva = 0;
          var dptotal = 0;
          var dpitem = "";
          var dpttrans = "";
          var dpsubtotal = "";

          var dpgnorden = 0;
          var dpgnventas = 0;
          var dpgngastos = 0;

          var textofinal = "";
          var envioValor = "";

          

      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM pedidosvendedor WHERE pv_online = 0", [], (tx, results) => {
          var len = results.rows.length;
          console.log("Entra a la cantidad:--- "+len);
          if(len > 0){
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            pvcodigo = Number(row.pv_codigo);
            console.log("valor de pvcodigo: "+ pvcodigo);
            pvcodigovendedor = Number(row.pv_codigovendedor);
            pvcodcliente = Number(row.pv_codcliente);
            pvestatus = Number(row.pv_estatus);

            tx.executeSql("SELECT dp_fecha, dp_observacion, dp_tipopedido, dp_tipodoc, dp_tipodesc, dp_porcdesc, dp_valordesc, dp_transporte, dp_seguro, dp_iva, dp_total, item, dp_ttrans, dp_subtotal, dp_gnorden, dp_gnventas, dp_gngastos, dp_cadenaxml  FROM datospedidos WHERE dp_codigo = ?", [pvcodigo], (tx, resulta) => {
              var lena = resulta.rows.length;
              console.log("Entra a la cantidad2:--- "+lena);
              for (let j = 0; j < lena; j++) {
                let rowa = resulta.rows.item(j);
                console.log("valor de rowa: " + rowa.dp_gngastos);
                dpfecha = rowa.dp_fecha;

                dpobservacion = rowa.dp_observacion;
                dptipodoc = rowa.dp_tipodoc;
                dptipodesc = rowa.dp_tipodesc;
                dpporcdesc = rowa.dp_porcdesc;
                dpvalordesc = rowa.dp_valordesc;
                dptransporte = rowa.dp_transporte;
                dpseguro = rowa.dp_seguro;
                dpiva = rowa.dp_iva;
                dptotal = rowa.dp_total;
                dpitem = rowa.item;
                dpttrans = rowa.dp_ttrans;
                dpsubtotal = rowa.dp_subtotal;
                dptipopedido = rowa.dp_tipopedido;

                dpgnorden = rowa.dp_gnorden;
                dpgnventas = rowa.dp_gnventas;
                dpgngastos = rowa.dp_gngastos;
                dpcadenaxml = rowa.dp_cadenaxml;

               

                console.log("valor de texto final: "+ dpcadenaxml);

                envioValor = "https://app.cotzul.com/Pedidos/grabarBorrador1.php?numpedido=" +
                pvcodigo +
                "&idvendedor=" +
                pvcodigovendedor +
                "&usuvendedor=" +
                dataUser.vn_usuario +
                "&estatus=" +
                pvestatus +
                "&fecha=" +
                dpfecha +
                "&empresa=COTZUL-BODEGA&prioridad=NORMAL&observaciones=" +
                dpobservacion +
                "&idcliente=" +
                pvcodcliente +
                "&tipopedido=" +
                dptipopedido +
                "&tipodoc=" +
                dptipodoc +
                "&tipodesc=" +
                (dptipodesc == "second" ? 1 : 0) +
                "&porcdesc=" +
                dpporcdesc +
                "&valordesc=" +
                dpvalordesc +
                "&ttrans=" +
                dpttrans +
                "&gnorden=" +
                dpgnorden +
                "&gnventas=" +
                dpgnventas +
                "&gngastos=" +
                dpgngastos +
                "&subtotal=" +
                dpsubtotal +
                "&descuento=" +
                dpvalordesc +
                "&transporte=" +
                dptransporte +
                "&seguro=" +
                dpseguro +
                "&iva=" +
                dpiva +
                "&total=" +
                dptotal +
                "&idnewvendedor=" +
                pvcodigovendedor +
                "&cadenaxml=" +
                dpcadenaxml +
                "&cadena=" +
                dpitem;

                CargarOffline(envioValor);

              }
            });

            tx.executeSql("UPDATE pedidosvendedor SET pv_online = 1 WHERE pv_codigo = ?", [pvcodigo]); 

          }
          }else{
            obtenerPedidosVendedor();
          }
          
        });
      });
      setActivo(2);
      signUp();
    }catch(e){
          console.log("ERROS AL CARGAR "+ e.toString())
    }
  }

  const CargarOffline = async (valorenvio)=>{

    var response = await fetch(valorenvio);


    const jsonResponse = await response.json();
      if (jsonResponse.estatusped == "REGISTRADO") {
        console.log("Se registro con éxito");
        obtenerPedidosVendedor();
      }


  };

  /** ITEM **/
  const obtenerItems = async () => {
    console.log("GET API Items");
    const response = await fetch(APIItem);
    const jsonResponse = await response.json();

    saveItems(jsonResponse);
  };

  saveItems = (myResponse) => {
    console.log("GUARDA REGISTROS items");

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    const itemList = myResponse?.items;
    console.log(itemList);

    let totalItem = myResponse?.items.length;
    let insertedCount = 0;

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS items");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "items " +
          "(it_codigo VARCHAR(200), it_codprod VARCHAR(20), it_referencia VARCHAR(50)" +
          ", it_descripcion VARCHAR(200), it_precio VARCHAR(20), it_pvp VARCHAR(20) " +
          ", it_preciosub VARCHAR(20), it_contado VARCHAR(20), it_stock VARCHAR(20) " +
          ", it_marca VARCHAR(50), it_familia VARCHAR(50), it_costoprom VARCHAR(20) " +
          ", it_peso VARCHAR(50), it_sku VARCHAR(10), it_bod INTEGER, it_alm INTEGER, it_chi INTEGER, it_rep INTEGER, it_lote VARCHAR(20), it_activex INTEGER" +
          " );"


      );
      
      itemList.forEach((item) => {
        txn.executeSql(
          "INSERT INTO items(it_codigo , it_codprod , it_referencia " +
            ", it_descripcion , it_precio , it_pvp " +
            ", it_preciosub , it_contado , it_stock  " +
            ", it_marca , it_familia , it_costoprom  " +
            ", it_peso,it_sku, it_bod, it_alm, it_chi, it_rep, it_lote, it_activex) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); ",
          [
            Number(item.it_codigo),
            item.it_codprod,
            item.it_referencia,
            item.it_descripcion,
            item.it_precio,
            item.it_pvp,
            item.it_preciosub,
            item.it_contado,
            item.it_stock,
            item.it_marca,
            item.it_familia,
            item.it_costoprom,
            item.it_peso,
            item.it_sku,
            item.it_bod,
            item.it_alm,
            item.it_chi,
            item.it_rep,
            item.it_lote,
            item.it_activex
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              insertedCount++;
              cont++;
              if(insertedCount == totalItem){
                listarItems();
              }
            }
          }
        );
      });
    });

   
  };

  const listarItems = () => {
    console.log("LISTAR items");
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM items", [], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          console.log(`ITEMS: ` + JSON.stringify(row));
        }
        obtenerTransportes();
      });
    });
   // obtenerPedidosVendedor();
   
  };
  /** FIN ITEM **/

  /** DATOS PEDIDOS **/
  const datospedidos = async () => {
    console.log("GET API datospedidos");
    const response = await fetch(APIDatosPedidos+dataUser.vn_codigo);

    const jsonResponse = await response.json();
    saveDatosPedidos(jsonResponse);
  };

  saveDatosPedidos = (myResponse) => {
    console.log("GUARDA REGISTROS datospedidos");

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    const pedidoList = myResponse?.pedido;
    console.log(pedidoList);

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS datospedidos");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "datospedidos " +
          "(dp_codigo INTEGER, dp_codvendedor INTEGER, dp_codcliente INTEGER" +
          ", dp_subtotal VARCHAR(200), dp_descuento VARCHAR(20), dp_transporte VARCHAR(20) " +
          ", dp_seguro VARCHAR(20), dp_iva VARCHAR(20), dp_total VARCHAR(20) " +
          ", dp_estatus VARCHAR(50), dp_codpedven VARCHAR(50)" +
          ", dp_idvendedor VARCHAR(50), dp_fecha VARCHAR(50), dp_empresa VARCHAR(20) " +
          ", dp_prioridad VARCHAR(50), dp_observacion VARCHAR(50), dp_tipopedido INTEGER " +
          ", dp_tipodoc VARCHAR(50), dp_tipodesc VARCHAR(50), dp_porcdesc VARCHAR(50), dp_valordesc VARCHAR(20) " +
          ", dp_ttrans VARCHAR(50), dp_gnorden VARCHAR(50), dp_gnventas VARCHAR(20) " +
          ", dp_gngastos VARCHAR(50), item TEXT , dp_numpedido INTEGER, dp_cadenaxml TEXT" +
          " );"
      );

      let totalPedido = myResponse?.pedido.length;
      let insertedCount = 0;

      pedidoList.forEach((ped) => {
        txn.executeSql(
          "INSERT INTO datospedidos(dp_codigo , dp_codvendedor , dp_codcliente " +
            ", dp_subtotal , dp_descuento , dp_transporte  " +
            ", dp_seguro , dp_iva , dp_total  " +
            ", dp_estatus , dp_codpedven " +
            ", dp_idvendedor , dp_fecha , dp_empresa  " +
            ", dp_prioridad , dp_observacion, dp_tipopedido " +
            ", dp_tipodoc , dp_tipodesc ,dp_porcdesc, dp_valordesc  " +
            ", dp_ttrans , dp_gnorden , dp_gnventas  " +
            ", dp_gngastos, item , dp_numpedido, dp_cadenaxml) " +
            " VALUES (?, ?, ?, ?, ?" +
            ", ?, ?, ?, ?" +
            ", ?, ?, ?, ?" +
            ", ?, ?, ?, ?, ?, ?" +
            ", ?, ?, ?, ?, ?" +
            ", ?, ?, ?, ?); ",
          [
            ped.dp_codigo,
            ped.dp_codvendedor,
            ped.dp_codcliente,
            ped.dp_subtotal,
            ped.dp_descuento,
            ped.dp_transporte,
            ped.dp_seguro,
            ped.dp_iva,
            ped.dp_total,
            ped.dp_estatus,
            ped.dp_codpedven,
            ped.dp_idvendedor,
            ped.dp_fecha,
            ped.dp_empresa,
            ped.dp_prioridad,
            ped.dp_observacion,
            ped.dp_tipopedido,
            ped.dp_tipodoc,
            ped.dp_tipodesc,
            ped.dp_porcdesc,
            ped.dp_valordesc,
            ped.dp_ttrans,
            ped.dp_gnorden,
            ped.dp_gnventas,
            ped.dp_gngastos,
            JSON.stringify(ped.item),
            ped.dp_numpedido,
            ped.dp_cadenaxml
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              insertedCount++;
              cont++;
              if(totalPedido == insertedCount){
                listarDatosPedidos();
              }
            }
          }
        );
      });
    });

  
  
  };

  const listarDatosPedidos = () => {
    console.log("LISTAR datospedidos");
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM datospedidos", [], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          console.log(`DATOS PEDIDOS: ` + JSON.stringify(row));
        }
        //setTerminaDatosPedido(true);
        setActivo(2);
        signUp();
      },(tx,error)=>{
        console.log("un error al final: "+error.message)
      });
    });
  };
  /** FIN DATOS PEDIDOS **/

  return (
    <>
      <Text style={styles.titlesSubtitle}>Fecha Última Actualización:</Text>
      <Text style={styles.titlesSubtitle}>{fechault}</Text>
      {loading ? (
        <View style={{ marginHorizontal: 20, marginTop: 10, height: 200 }}>
          <Text style={styles.titlesSubtitle}>cargando...</Text>
          <ActivityIndicator size="large" color="purple" />
        </View>
      ) : (
        <Button
          title="Sincronizar"
          containerStyle={styles.btnContainerLogin}
          buttonStyle={styles.btnLogin}
          onPress={sincronizarDatos}
        />
      )}
      
    </>
  );
}

const styles = StyleSheet.create({
  titlesWrapper: {
    marginTop: 5,
    paddingHorizontal: 20,
  },
  tabletitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  tabletext: {
    fontSize: 10,
  },
  tableval: {
    fontSize: 10,
    textAlign: "right",
  },
  titlesSubtitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.textDark,
  },
  titlesTitle: {
    // fontFamily:
    fontSize: 35,
    color: colors.textDark,
  },
  titlesdetalle: {
    // fontFamily:
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textDark,
    paddingTop: 10,
  },
  titlespick: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textDark,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  titlespick2: {
    fontSize: 16,
    color: colors.textDark,
    paddingTop: 5,
  },
  btnContainerLogin: {
    marginTop: 10,
    width: "90%",
  },
  btnLogin: {
    backgroundColor: "#6f4993",
  },
  iconRight: {
    color: "#c1c1c1",
  },
  detallebody: {
    height: 75,
    width: "90%",
    marginHorizontal: 20,
    marginTop: 10,
    borderWidth: 1,
  },
  dividobody: {
    flexDirection: "row",
    paddingTop: 20,
    height: 75,
    width: "90%",
    marginHorizontal: 20,
    borderWidth: 1,
  },
  totalbody: {
    borderWidth: 1,
    height: 75,
    width: "90%",
    marginHorizontal: 20,
    paddingTop: 20,
  },
  labelcorta: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textDark,
    paddingHorizontal: 20,
  },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  search: {
    flex: 1,
    marginLeft: 0,
    borderBottomColor: colors.textLight,
    borderBottomWidth: 1,
  },
  searchText: {
    fontSize: 14,
    marginBottom: 5,
    color: colors.textLight,
  },
  productoWrapper: {
    marginTop: 10,
  },
  Searchbar: {
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  scrollview: {
    marginTop: 10,
    marginBottom: 50,
  },
  categoriaWrapper: {
    paddingHorizontal: 20,
  },
  categoriaWrapper1: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center", //Centered vertically
  },
  categoriaItemWrapper1: {
    marginTop: 10,
    marginRight: 10,
    padding: 15,
    backgroundColor: "#f5ca4b",
    borderRadius: 20,
    width: 120,
    height: 70,
    justifyContent: "center", //Centered horizontally
    alignItems: "center", //Centered vertically
    flex: 1,
  },
  categoriaItemWrapper2: {
    marginTop: 10,
    marginRight: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 120,
    height: 70,
    justifyContent: "center", //Centered horizontally
    alignItems: "center", //Centered vertically
    flex: 1,
  },
  textItem: {
    textAlign: "center",
    fontSize: 10,
  },
});

const pickerStyle = {
  inputIOS: {
    color: "white",
    paddingHorizontal: 20,
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: "#6f4993",
    borderRadius: 5,
    height: 30,
  },
  placeholder: {
    color: "white",
  },
  inputAndroid: {
    width: "85%",
    height: 20,
    color: "white",
    marginHorizontal: 20,
    paddingLeft: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
    marginTop: 10,
  },
  search: {
    flex: 1,
    marginLeft: 0,
    borderBottomColor: colors.textLight,
    borderBottomWidth: 1,
  },
};
