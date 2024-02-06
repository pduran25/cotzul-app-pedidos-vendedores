import React, { useState, useEffect, useRef, useContext, useCallback  } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  AppState,
  Linking,
  RefreshControl
} from "react-native";
import { colors, Icon } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DetPedidos from "./DetPedidos";
import { AuthContext } from "../components/Context";
import * as SQLite from "expo-sqlite";

function defaultValueRegister() {
  return {
    cb_codigo: "",
    cb_coddocumento: "",
    cb_cliente: "",
    cb_vendedor: "",
    cb_accion: "",
    cb_valortotal: 0,
  };
}

function defaultValueUser() {
  return {
    us_codigo: "",
    us_nombre: "",
    us_usuario: "",
    us_clave: "",
    us_estatus: "",
    us_codusuario: "",
  };
}

const STORAGE_KEY = "@save_data";
const STORAGE_DB = "@login_data";

const STORAGE_CAD = "@save_cadena";

const dataped = [
  {
    cb_codigo: "0001",
    cb_coddocumento: "0002",
    cb_cliente: "PEDRO DURAN A.",
    cb_vendedor: "HENRY CRUZ",
    cb_accion: "D",
    cb_valortotal: 345,
  },
  {
    cb_codigo: "0002",
    cb_coddocumento: "0003",
    cb_cliente: "CARLOS CHOEZ",
    cb_vendedor: "HENRY CRUZ",
    cb_accion: "B",
    cb_valortotal: 2893,
  },
  {
    cb_codigo: "0003",
    cb_coddocumento: "0004",
    cb_cliente: "RICARDO VALLEJO",
    cb_vendedor: "HENRY CRUZ",
    cb_accion: "B",
    cb_valortotal: 2245,
  },
];

const database_name = "CotzulBD2.db";
const database_version = "2.0";
const database_displayname = "CotzulBD";
const database_size = 200000;

export default function PedidosEnviados(props) {
  const [tpedido, setTpedido] = useState(-1);
  const { navigation, route } = props;
  const [registro, setRegistro] = useState(defaultValueRegister);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [data, setData] = useState([]);
  const [dataUser, setdataUser] = useState(defaultValueUser());
  const { signOut, signUp } = React.useContext(AuthContext);
  const [usuario, setUsuario] = useState(false);
  const [consta, setConsta] = useState("");
  const [cadena, setCadena] = useState("");
  const [idpedido, setIdPedido] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [totencontrados, setTotEncontrados] = useState(0);
  const APIpedidosvendedor =
  "https://app.cotzul.com/Pedidos/getPedidosVendedor.php?idvendedor=";
  const APIDatosPedidos =
  "https://app.cotzul.com/Pedidos/getDatosPedidoxVendedor.php?idvendedor=";

  const [responsePV, setResponsePV] = useState(null);

  var cont = 0;

  /* FUNCIONES RECURSIVAS */
  const getDataUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      console.log("si entrego : " + jsonValue);
      setdataUser(JSON.parse(jsonValue));
      setUsuario(true);
      console.log("INGRSA A PRODUCTO: " + dataUser.vn_nombre);
    } catch (e) {
      console.log("Error al coger el usuario");
      console.log(e);
    }
  };

  const getCadenaDB = async () => {
    try {
      const valu = await AsyncStorage.getItem(STORAGE_CAD);
      setConsta(valu);
      console.log("constant : " + valu);
      const response = await fetch(
        "https://app.cotzul.com/Pedidos/getAllPedidosN.php?idestatus=-1&usuario=" +
          dataUser.us_usuario +
          "&cadena=" +
          valu
      );
      console.log(
        "https://app.cotzul.com/Pedidos/getAllPedidosN.php?idestatus=-1&usuario=" +
          dataUser.us_usuario +
          "&cadena=" +
          valu
      );
      const jsonResponse = await response.json();
    } catch (e) {
      console.log("Error cadena");
      console.log(e);
    }
  };

  const setCad = async (value) => {
    try {
      await AsyncStorage.setItem(STORAGE_CAD, value);
    } catch (e) {
      console.log(e);
    }
  };

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    console.log("ENTRO JSA");
    if (dataUser) {
      if (!usuario) {
        getDataUser();
        recargarPedidos();
        console.log("ENTRO JSA2");
      }
    }
  }, []);

  useEffect(() => {
    listarPedidos();
  }, [dataUser]);

  const regresarFunc = () => {
    navigation.navigate("productos");
    listarPedidos();
  };

  const obtenerPedidosVendedor = async () => {
    console.log(": "+APIpedidosvendedor+dataUser.vn_codigo);
    const response = await fetch(APIpedidosvendedor+dataUser.vn_codigo);
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

    var cont = 0;
    db.transaction((txn) => {
      txn.executeSql("DROP TABLE IF EXISTS pedidosvendedor");
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "pedidosvendedor " +
          "(pv_codigo INTEGER, pv_codigovendedor INTEGER,  pv_vendedor VARCHAR(100), pv_codcliente INTEGER, pv_cliente VARCHAR(200)," +
          "pv_total VARCHAR(50), pv_estatus INTEGER, pv_gngastos VARCHAR(100), pv_numpedido INTEGER, pv_online INTEGER, pv_estatusimg INTEGER, pv_nombrearchivo VARCHAR(100));"
      );

      myResponse?.pedidovendedor.map((value, index) => {
        txn.executeSql(
          "INSERT INTO pedidosvendedor(pv_codigo,pv_codigovendedor,pv_vendedor,pv_codcliente,pv_cliente,pv_total,pv_estatus,pv_gngastos,pv_numpedido,pv_online, pv_estatusimg, pv_nombrearchivo) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); ",
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
            Number(value.pv_estatusimg),
            value.pv_nombrearchivo
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
          ", dp_prioridad VARCHAR(50), dp_observacion VARCHAR(50), dp_tipopedido INTEGER " +
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
            value.dp_tipopedido,
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
              console.log("numero de filas registradas datos pedidos: "+ results.rowsAffected);
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
        if(len > 0)
          listarPedidos();
      });
    });
  };



  const listarPedidos = async () => {
    try {

      let db = null;
      setLoading(false);
      console.log("LISTAR pedidovendedor pedidos enviados");
      db = SQLite.openDatabase(
        database_name,
        database_version,
        database_displayname,
        database_size
      );
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM pedidosvendedor a, datospedidos b WHERE a.pv_estatus != -1 AND a.pv_codigo = b.dp_codigo AND a.pv_codcliente= b.dp_codcliente ORDER BY a.pv_codigo DESC", [], (tx, results) => {
          var len = results.rows.length;
          setTotEncontrados(len);
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(`PEDIDOS VENDEDOR: ` + JSON.stringify(row));
          }
          
          setData(results.rows._array);
          setLoading(true);
          setRefreshing(true);
        });
      });
     
    } catch (error) {
      setLoading(false);
      console.log("un error cachado listar pedidos");
      console.log(error);
    }
  };

  const cargarDetalles = (pedidos) => {
    console.log(" data: " + pedidos);
    var cont = 0;
    var texto = "vacio";

    if (pedidos != undefined) {
      console.log("valor de mensjar: " + pedidos[0].cb_mensaje);

      if (pedidos[0].cb_mensaje != "X") {
        texto = '<?xml version="1.0" encoding="iso-8859-1"?><c c0="2" c1="1" >';
        for (let x = 0; x < pedidos.length; x++) {
          cont++;
          console.log(pedidos[x].cb_coddocumento);
          texto =
            texto +
            '<detalle d0="' +
            pedidos[x].cb_coddocumento +
            '" d1="' +
            cont +
            '"></detalle>';
        }
        texto = texto + "</c>";
      } else {
        if (pedidos[0].cb_observacion != "X")
          Alert.alert(pedidos[0].cb_observacion);
      }
    }
    console.log(texto);
    setCadena(texto);
    setCad(texto);
  };

  const item = ({ item }) => {
    var cont = 0;

    if (item.cb_mensaje != "X") {
      const viewDetails = (props) => {
        console.log("Detalle pedido");

        for (let x = 0; x < data.length; x++) {
          cont++;
          console.log(item.pv_codigo);
          if (data[x].pv_codigo == item.pv_codigo) {
            data[x].background = "gray";
          } else {
            data[x].background = "white";
          }
        }

        if (data.length == 0) {
          setRegistro(defaultValueRegister);
        } else {
          setRegistro(item);
          setIdPedido(item.pv_codigo);
          console.log("valor idpedido: " + item.pv_codigo);
        }
      };

      return (
        <TouchableOpacity onPress={viewDetails}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: item.background,
              marginRight: 15,
            }}
          >
            <View
              style={{
                width: 60,
                height: 50,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletext}>{item.pv_codigo}</Text>
            </View>
            <View
              style={{
                width: 60,
                height: 50,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletext}>{item.pv_numpedido}</Text>
            </View>

            <View
              style={{
                width: 150,
                height: 50,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletext}>{item.pv_cliente}</Text>
            </View>
            <View
              style={{
                width: 70,
                height: 50,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tableval}>
                {Number(item.pv_gngastos).toFixed(2)}
              </Text>
            </View>
            <View
              style={{
                width: 80,
                height: 50,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tableval}>
                {item.dp_fecha} 
              </Text>
            </View>
            <View
              style={{
                width: 70,
                height: 50,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Icon
                onPress={ ()=>openUrl("https://app.cotzul.com/Pedidos/Presentacion/webpedido.php?idpedido="+item.pv_codigo+"&idcliente="+item.pv_codcliente+"&idvendedor="+item.pv_codigovendedor+"&tipopedido=2", item.pv_online)}
                type="material-community"
                name="share"
                size={30}
                iconStyle={styles.iconRight}
              />
            </View>
            <View
              style={{
                width: 70,
                height: 50,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Icon
                onPress={()=>openUrl("https://app.cotzul.com/Pedidos/cargarimagenrecibo.php?idcliente="+item.pv_codcliente+"&idpedido="+item.pv_numpedido,1)}
                type="material-community"
                name="camera"
                size={30}
                iconStyle={styles.iconRight}
              />
            </View>
            <View
              style={{
                width: 70,
                height: 50,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              {(item.pv_estatusimg == 1)?<Icon
                onPress={()=>openUrl("https://app.cotzul.com/Pedidos/recibos/"+item.pv_nombrearchivo,1)}
                type="material-community"
                name="eye"
                size={30}
                iconStyle={styles.iconRight}
              />:<Text style={styles.tabletitle}>NO</Text>}
              
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  async function openUrl(url, online){
    if(online == 1){
      const isSupported = await Linking.canOpenURL(url);
      if(isSupported){
          await Linking.openURL(url)
      }else{
          Alert.alert('No se encontro el Link');
      }
    }else
          Alert.alert('Pedido No está en la NUBE. Editalo y guardalo como pedido borrador: '+url);
   
}

  const nuevoPedido = () => {
    navigation.navigate("nuevoped", { dataUser, regresarFunc });
  };

  const editaPedido = () => {
    navigation.navigate("editapedido", { dataUser, idpedido, regresarFunc });
  }; 

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    obtenerPedidosVendedor();
    
}, []);

  const recargarPedidos = () => {
    listarPedidos();
    setRegistro(defaultValueRegister);
  };

  const actualizaPedido = (tpedido) => {
    setLoading(false);
    setTpedido(tpedido);
    //listarPedidos(tpedido);
    setRegistro(defaultValueRegister);
  };

  return (
    <ScrollView style={styles.container} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <View style={styles.titlesWrapper}>
        <Text style={styles.titlesSubtitle}>Cotzul S.A.</Text>
        <Text style={styles.titlespick2}>Usuario: {dataUser.vn_nombre}</Text>
      </View>
      {/*Search*/}

      
      <Text style={styles.titlespick}>Mis Pedidos Enviados ({totencontrados}):</Text>
      <ScrollView horizontal>
        <View style={{ marginHorizontal: 20, marginTop: 10, height: 250 }}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: 60,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>#Borr.</Text>
            </View>
            <View
              style={{
                width: 60,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>#Ped.</Text>
            </View>
            <View
              style={{
                width: 150,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>Cliente</Text>
            </View>

            <View
              style={{
                width: 70,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>Lote</Text>
            </View>

            <View
              style={{
                width: 80,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>Fecha</Text>
            </View>
            <View
              style={{
                width: 70,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>Compartir</Text>
            </View>
            <View
              style={{
                width: 70,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>Recibo</Text>
            </View>
            <View
              style={{
                width: 70,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>Respaldo</Text>
            </View>
            
          </View>

          {loading ? (
            <FlatList
              data={data}
              renderItem={item}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <ActivityIndicator size="large" loading={loading} />
          )}
        </View>
      </ScrollView>
      <View style={styles.titlesWrapper}>
        <Text style={styles.titlesdetalle}>Cabecera de Pedidos</Text>
      </View>
      <DetPedidos registro={registro} />
      <View style={{ alignItems: "center" }}>
        {registro.pv_estatus == -1 ? (
          <Button
            title="Continuar Editando"
            containerStyle={styles.btnContainerLogin}
            buttonStyle={styles.btnLogin}
            onPress={editaPedido}
          />
        ) : (
          ""
        )}
      </View>
    </ScrollView>
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
    textAlign: "center"
  },
  tabletext: {
    fontSize: 12,
    paddingLeft:5
  },
  tableval: {
    fontSize: 12,
    paddingRight: 5,
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
