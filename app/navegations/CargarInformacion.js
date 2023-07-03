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

const APIpedidosvendedor =
  "https://app.cotzul.com/Pedidos/getPedidosVendedor.php?idvendedor=";
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

const database_name = "CotzulBD1.db";
const database_version = "1.0";
const database_displayname = "CotzulBDS";
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
        console.log("Connection type", state.type);
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
    console.log('Función ejecutada');
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
    const jsonResponse = await response.json();
    console.log("PEDIDOS VENDEDORES: "+jsonResponse?.pedidovendedor);

    savePedidosVendedor(jsonResponse);
  };

  savePedidosVendedor = (myResponse) => {
    //if (pedidosVendedorAPI) {
    //console.log(myResponse);
    console.log("GUARDA REGISTROS pedidovendedor");

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS pedidosvendedor");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "pedidosvendedor " +
          "(pv_codigo INTEGER, pv_codigovendedor INTEGER,  pv_vendedor VARCHAR(100), pv_codcliente INTEGER, pv_cliente VARCHAR(200)," +
          "pv_total VARCHAR(50), pv_estatus INTEGER, pv_gngastos VARCHAR(100), pv_numpedido INTEGER, pv_online INTEGER);"
      );

      myResponse?.pedidovendedor.map((value, index) => {
        txn.executeSql(
          "INSERT INTO pedidosvendedor(pv_codigo,pv_codigovendedor,pv_vendedor,pv_codcliente,pv_cliente,pv_total,pv_estatus,pv_gngastos,pv_numpedido,pv_online) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?); ",
          [
            Number(value.pv_codigo),
            Number(value.pv_codvendedor),
            value.pv_vendedor,
            Number(value.pv_codcliente),
            value.pv_cliente,
            value.pv_total,
            value.pv_estatus,
            value.pv_gngastos,
            Number(value.pv_numpedido),
            Number(1),
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      });
    });

    listarPedidosVendedor();
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
      });
    });
    datospedidos();
    
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

      myResponse?.transporte.map((value, index) => {
        txn.executeSql(
          "INSERT INTO transportes(pl_codigo,pl_razon,pl_nombre,pl_visible) " +
            " VALUES (?, ?, ?, ?); ",
          [
            Number(value.pl_codigo),
            value.pl_razon,
            value.pl_nombre,
            value.pl_visible,
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      });
    });

    listarTransportes();
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
          //console.log(`TRANSPORTE: ` + JSON.stringify(row));
        }
      });
    });
    obtenerVendedores();
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

      myResponse?.vendedores.map((value, index) => {
        txn.executeSql(
          "INSERT INTO vendedores(vd_codigo,vd_vendedor) " + " VALUES (?, ?); ",
          [Number(value.vd_codigo), value.vd_vendedor],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      });
    });

    listarVendedores();
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
          //console.log(`VENDEDORES: ` + JSON.stringify(row));
        }
      });
    });
    obtenerPlazo();
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

    var cont = 0;
    db.transaction((txn) => {
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

      myResponse?.clientes.map((value, index) => {
        txn.executeSql(
          "INSERT INTO clientes(ct_codigo,ct_cedula,ct_tipoid" +
            ", ct_cliente  , ct_telefono , ct_direccion   " +
            ", ct_correo  , ct_cupoasignado , ct_cupodisponible   " +
            ", ct_idplazo  , ct_plazo , ct_tcodigo   " +
            ", ct_idvendedor  , ct_usuvendedor , ct_ubicacion   " +
            ", ct_ciudad) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?); ",
          [
            Number(value.ct_codigo),
            value.ct_cedula,
            value.ct_tipoid,
            value.ct_cliente,
            value.ct_telefono,
            value.ct_direccion,
            value.ct_correo,
            value.ct_cupoasignado,
            value.ct_cupodisponible,
            value.ct_idplazo,
            value.ct_plazo,
            value.ct_tcodigo,
            value.ct_idvendedor,
            value.ct_usuvendedor,
            value.ct_ubicacion,
            value.ct_ciudad,
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      });
    });

    listarClientes();
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
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          //console.log(`CLIENTES: ` + JSON.stringify(row));
        }
        
      });
      obtenerItems();
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

      myResponse?.plazo.map((value, index) => {
        txn.executeSql(
          "INSERT INTO plazos(pl_codigo,pl_descripcion" +
            ", pl_notaidplazo) " +
            " VALUES (?, ?, ?); ",
          [Number(value.pl_codigo), value.pl_descripcion, "1"],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      });
    });

    listarPlazos();
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
          //console.log(`PLAZOS: ` + JSON.stringify(row));
        }
      });
    });
    obtenerTarifas();
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

      myResponse?.transtarifas.map((value, index) => {
        txn.executeSql(
          "INSERT INTO transtarifas(tt_codigo,tt_idtransporte,tt_idtarifa" +
            ", tt_peso,tt_tarifa1,tt_tarifa2, tt_estado, tt_usuarioing) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?); ",
          [
            value.tt_codigo,
            value.tt_idtransporte,
            value.tt_idtarifa,
            value.tt_peso,
            value.tt_tarifa1,
            value.tt_tarifa2,
            value.tt_estado,
            value.tt_usuarioing
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      });
    });

    listarTarifas();
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
      });
    });
    
    obtenerUbicacion();
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

      myResponse?.transubicacion.map((value, index) => {
        txn.executeSql(
          "INSERT INTO transubicacion(tu_codigo,tu_descripcion) " +
            " VALUES (?, ?); ",
          [
            value.tu_codigo,
            value.tu_descripcion
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      });
    });

    listarTransUbicacion();
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
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          console.log(`TARIFAS UBICACION: ` + JSON.stringify(row));
        }
      });
    });
    
   /* if(dataUser.vn_loading > 1){
      
      ActualizarPedidosOffline();
      
    }else{
      obtenerPedidosVendedor();
    }*/

    obtenerPedidosVendedor();



    
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

            tx.executeSql("SELECT dp_fecha, dp_observacion, dp_tipodoc, dp_tipodesc, dp_porcdesc, dp_valordesc, dp_transporte, dp_seguro, dp_iva, dp_total, item, dp_ttrans, dp_subtotal, dp_gnorden, dp_gnventas, dp_gngastos, dp_cadenaxml  FROM datospedidos WHERE dp_codigo = ?", [pvcodigo], (tx, resulta) => {
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

                dpgnorden = rowa.dp_gnorden;
                dpgnventas = rowa.dp_gnventas;
                dpgngastos = rowa.dp_gngastos;
                dpcadenaxml = rowa.dp_cadenaxml;

               

                console.log("valor de texto final: "+ dpcadenaxml);

                envioValor = "https://app.cotzul.com/Pedidos/grabarBorrador.php?numpedido=" +
                pvcodigo +
                "&idvendedor=" +
                pvcodigovendedor +
                "&usuvendedor=" +
                dataUser.vn_usuario +
                "&fecha=" +
                dpfecha +
                "&empresa=COTZUL-BODEGA&prioridad=NORMAL&observaciones=" +
                dpobservacion +
                "&idcliente=" +
                pvcodcliente +
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
      //console.log(jsonResponse.estatusped);
      if (jsonResponse.estatusped == "REGISTRADO") {
        console.log("Se registro con éxito");
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
          ", it_peso VARCHAR(50), it_sku VARCHAR(10), it_bod INTEGER, it_alm INTEGER, it_chi INTEGER, it_rep INTEGER, it_lote VARCHAR(20)" +
          " );"


      );

      myResponse?.items.map((value, index) => {
        txn.executeSql(
          "INSERT INTO items(it_codigo , it_codprod , it_referencia " +
            ", it_descripcion , it_precio , it_pvp " +
            ", it_preciosub , it_contado , it_stock  " +
            ", it_marca , it_familia , it_costoprom  " +
            ", it_peso,it_sku, it_bod, it_alm, it_chi, it_rep, it_lote) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); ",
          [
            Number(value.it_codigo),
            value.it_codprod,
            value.it_referencia,
            value.it_descripcion,
            value.it_precio,
            value.it_pvp,
            value.it_preciosub,
            value.it_contado,
            value.it_stock,
            value.it_marca,
            value.it_familia,
            value.it_costoprom,
            value.it_peso,
            value.it_sku,
            value.it_bod,
            value.it_alm,
            value.it_chi,
            value.it_rep,
            value.it_lote
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              cont++;
            }
          }
        );
      });
    });

    listarItems();
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
      });
    });
   // obtenerPedidosVendedor();
   obtenerTransportes();
  };
  /** FIN ITEM **/

  /** DATOS PEDIDOS **/
  const datospedidos = async () => {
    console.log("GET API datospedidos");
    const response = await fetch(APIDatosPedidos+dataUser.vn_codigo);
    const jsonResponse = await response.json();
 
    
    saveDatosPedidos(jsonResponse);
   //console.log(JSON.stringify(jsonResponse));
  };

  saveDatosPedidos = (myResponse) => {
    console.log("GUARDA REGISTROS datospedidos");

    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

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
          ", dp_prioridad VARCHAR(50), dp_observacion VARCHAR(50)" +
          ", dp_tipodoc VARCHAR(50), dp_tipodesc VARCHAR(50), dp_porcdesc VARCHAR(50), dp_valordesc VARCHAR(20) " +
          ", dp_ttrans VARCHAR(50), dp_gnorden VARCHAR(50), dp_gnventas VARCHAR(20) " +
          ", dp_gngastos VARCHAR(50), item TEXT , dp_numpedido INTEGER, dp_cadenaxml TEXT" +
          " );"
      );

      myResponse?.pedido.map((value, index) => {
        txn.executeSql(
          "INSERT INTO datospedidos(dp_codigo , dp_codvendedor , dp_codcliente " +
            ", dp_subtotal , dp_descuento , dp_transporte  " +
            ", dp_seguro , dp_iva , dp_total  " +
            ", dp_estatus , dp_codpedven " +
            ", dp_idvendedor , dp_fecha , dp_empresa  " +
            ", dp_prioridad , dp_observacion " +
            ", dp_tipodoc , dp_tipodesc ,dp_porcdesc, dp_valordesc  " +
            ", dp_ttrans , dp_gnorden , dp_gnventas  " +
            ", dp_gngastos, item , dp_numpedido, dp_cadenaxml) " +
            " VALUES (?, ?, ?, ?, ?" +
            ", ?, ?, ?, ?" +
            ", ?, ?, ?, ?" +
            ", ?, ?, ?, ?, ?" +
            ", ?, ?, ?, ?, ?" +
            ", ?, ?, ?, ?); ",
          [
            value.dp_codigo,
            value.dp_codvendedor,
            value.dp_codcliente,
            value.dp_subtotal,
            value.dp_descuento,
            value.dp_transporte,
            value.dp_seguro,
            value.dp_iva,
            value.dp_total,
            value.dp_estatus,
            value.dp_codpedven,
            value.dp_idvendedor,
            value.dp_fecha,
            value.dp_empresa,
            value.dp_prioridad,
            value.dp_observacion,
            value.dp_tipodoc,
            value.dp_tipodesc,
            value.dp_porcdesc,
            value.dp_valordesc,
            value.dp_ttrans,
            value.dp_gnorden,
            value.dp_gnventas,
            value.dp_gngastos,
            JSON.stringify(value.item),
            value.dp_numpedido,
            value.dp_cadenaxml
          ],
          (txn, results) => {
            if (results.rowsAffected > 0) {
              console.log("numero de filas registradas: "+ results.rowsAffected);
            }
          }
        );
      });
    });

  
   listarDatosPedidos();
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
