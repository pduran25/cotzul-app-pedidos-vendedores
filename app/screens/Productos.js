import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
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
  RefreshControl
} from "react-native";
import { colors } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
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
    vn_codigo: 0,
    vn_nombre: "",
    vn_usuario: "",
    vn_clave: "",
    vn_recibo: "",
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

export default function Productos(props) {
  const { navigation, route } = props;
  const [registro, setRegistro] = useState(defaultValueRegister);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [data, setData] = useState([]);
  const [dataUser, setdataUser] = useState(defaultValueUser());
  const [usuario, setUsuario] = useState(false);
  const [idpedido, setIdPedido] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [idvendedor, setIdvendedor] = useState(0); 


  var cont = 0;

  /* FUNCIONES RECURSIVAS */
  const getDataUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      console.log("si entrego : " + jsonValue);
      setdataUser(JSON.parse(jsonValue));
      setIdvendedor(JSON.parse(jsonValue).vn_codigo);
      console.log("valor de codigo: "+JSON.parse(jsonValue).vn_codigo);
      listarPedidos(JSON.parse(jsonValue).vn_codigo);
    } catch (e) {
      console.log("Error al coger el usuario");
      console.log(e);
    }
  };





  const appState = useRef(AppState.currentState);

useEffect(() => {
    console.log("ENTRO JSA*");
      if (!usuario) {
        getDataUser();
        console.log("ENTRO JSA2");
      }
  }, [usuario]);



useEffect(()=> {
  console.log("Veces que ingresa a datauser ****");
  if(idvendedor != 0){
    setUsuario(true);
    console.log("INGRSA A PRODUCTO:* " + idvendedor);
  }
}, [idvendedor])

  const onRefresh = useCallback(() => {
    getDataUser();
}, []);


  const regresarFunc = () => {
    navigation.navigate("productos");
    getDataUser();
  };

  const listarPedidos = async (numvendedor) => {
    try {
      const database_name = "CotzulBD.db";
      const database_version = "1.0";
      const database_displayname = "CotzulBD";
      const database_size = 200000;

      let db = null;
      console.log("LISTAR pedidovendedor Productos entro una vez");
      db = SQLite.openDatabase(
        database_name,
        database_version,
        database_displayname,
        database_size
      );
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM pedidosvendedor WHERE pv_estatus = -1 AND pv_codigovendedor = "+numvendedor, [], (tx, results) => {
          var len = results.rows.length;
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
          }
          setLoading(true);
          setData(results.rows._array);
        });
      });

      setRefreshing(false);

    } catch (error) {
      setLoading(false);
      console.log("un error cachado listar pedidos");
      console.log(error);
    }
  };


  const item = ({ item }) => {
    var cont = 0;

    if (item.cb_mensaje != "X") {
      const viewDetails = (props) => {

        for (let x = 0; x < data.length; x++) {
          cont++;
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
                height: 30,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletext}>{item.pv_numpedido}</Text>
            </View>

            <View
              style={{
                width: 220,
                height: 30,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletext}>{item.pv_cliente}</Text>
            </View>
            <View
              style={{
                width: 70,
                height: 30,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tableval}>
                {Number(item.pv_gngastos).toFixed(2)} %
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const nuevoPedido = () => {
    navigation.navigate("nuevoped", { dataUser, regresarFunc });
  };

  const editaPedido = () => {
    navigation.navigate("editapedido", { dataUser, idpedido, regresarFunc });
  }; 

  const recargarPedidos = () => {
    listarPedidos();
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

      <View style={{ alignItems: "center" }}>
        <Button
          title="Nuevo Pedido"
          containerStyle={styles.btnContainerLogin}
          buttonStyle={styles.btnLogin}
          onPress={nuevoPedido}
        />
      </View>
      <Text style={styles.titlespick}>Mis Pedidos Borrador:</Text>
      <ScrollView horizontal>
        <View style={{ marginHorizontal: 20, marginTop: 10, height: 200 }}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: 60,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>#Doc.</Text>
            </View>
            
            <View
              style={{
                width: 220,
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
            
          </View>

          {loading && loading2 ? (
            <FlatList
              data={data}
              renderItem={item}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <ActivityIndicator size="large" loading={loading && loading2} />
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
