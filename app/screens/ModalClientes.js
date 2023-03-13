import React, { useEffect, useState, Component } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SearchBar, ListItem, Icon, colors } from "react-native-elements";
import { DebugInstructions } from "react-native/Libraries/NewAppScreen";
import * as SQLite from "expo-sqlite";

class ModalClientes extends Component {
  constructor(props) {
    super();
    this.state = {
      data: [],
      isLoading: true,
      search: "",
      dataCliente: this.defaultValueRegister,
    };
  }
  state = {
    modalVisible: false,
  };

  setTextoSearch(texto) {
    this.setState({ search: texto });
    this.getClientes();
  }

  componentDidMount() {
    this.setState({ modalVisible: false });
    this.getClientes();
  }

  setModalVisible = (visible) => {
    if (visible == true) this.props.inicializaCliente();
    this.setState({ modalVisible: visible });
  };


  setClientes(alignItems) {
    console.log("paso por aqui " + alignItems.ct_cliente);

    this.props.actualizaCliente(alignItems);
    this.setModalVisible(!this.state.modalVisible);
  }

  getClientes = async () => {
    try {
      this.setState({ isLoading: true });

      let db = null;

      /*const response = await fetch(
      "https://app.cotzul.com/Pedidos/getClientes.php?nombre="+this.state.search+"&idvendedor="+this.props.idvendedor
    );*/

      const database_name = "CotzulBD.db";
      const database_version = "1.0";
      const database_displayname = "CotzulBD";
      const database_size = 200000;

      db = SQLite.openDatabase(
        database_name,
        database_version,
        database_displayname,
        database_size
      );
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM clientes WHERE ct_idvendedor=? AND upper(ct_cliente) LIKE ? ",
          [this.props.idvendedor, "%"+this.state.search.toUpperCase()+"%"],
          (tx, results) => {
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
            }
            //console.log(JSON.stringify(results.rows._array));

            const responseCL = results.rows._array;
            //console.log(responseCL);

            //setResponseCL({ clientes: JSON.stringify(results.rows._array) });
            this.setState({ data: responseCL });
            this.setState({ isLoading: false });
          }
        );
      });
      //this.setState({ data: responseCL?.clientes });
      //this.setState({ isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false });
      console.log("Error cadena");
      console.log(e);
    }
  };

  registerItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => this.setClientes(item)}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: item.background,
            marginRight: 15,
          }}
        >
          <View
            style={{
              width: 75,
              height: 30,
              borderColor: "black",
              borderWidth: 1,
            }}
          >
            <Text style={styles.tabletext}>{item.ct_cedula}</Text>
          </View>

          <View
            style={{
              width: 85,
              height: 30,
              borderColor: "black",
              borderWidth: 1,
            }}
          >
            <Text style={styles.tabletext}>{item.ct_cliente}</Text>
          </View>
          <View
            style={{
              width: 85,
              height: 30,
              borderColor: "black",
              borderWidth: 1,
            }}
          >
            <Text style={styles.tabletext}>{item.ct_telefono}</Text>
          </View>
          <View
            style={{
              width: 85,
              height: 30,
              borderColor: "black",
              borderWidth: 1,
            }}
          >
            <Text style={styles.tabletext}>$ {item.ct_cupodisponible}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { modalVisible, texto, data, isLoading, search } = this.state;
    const { actualizaCliente, inicializaCliente } = this.props;

    return (
      <View style={styles.centeredView1}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.searchWrapper}>
                <View style={styles.search}>
                  <Text style={styles.modalText}>Listado de Clientes</Text>
                  <SearchBar
                    placeholder="Buscar..."
                    onChangeText={(e) => this.setTextoSearch(e)}
                    containerStyle={StyleSheet.Searchbar}
                    value={search}
                  />
                </View>
              </View>

              <View
                style={{ marginHorizontal: 20, marginTop: 10, height: 120 }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: 75,
                      backgroundColor: "#9c9c9c",
                      borderColor: "black",
                      borderWidth: 1,
                    }}
                  >
                    <Text style={styles.tabletitle}>#Cedula:</Text>
                  </View>
                  <View
                    style={{
                      width: 85,
                      backgroundColor: "#9c9c9c",
                      borderColor: "black",
                      borderWidth: 1,
                    }}
                  >
                    <Text style={styles.tabletitle}>Nombre:</Text>
                  </View>

                  <View
                    style={{
                      width: 85,
                      backgroundColor: "#9c9c9c",
                      borderColor: "black",
                      borderWidth: 1,
                    }}
                  >
                    <Text style={styles.tabletitle}>Teléfono:</Text>
                  </View>
                  <View
                    style={{
                      width: 85,
                      backgroundColor: "#9c9c9c",
                      borderColor: "black",
                      borderWidth: 1,
                    }}
                  >
                    <Text style={styles.tabletitle}>Cupo:</Text>
                  </View>
                </View>
                {isLoading ? (
                  <ActivityIndicator size="large" loading={isLoading} />
                ) : (
                  <FlatList
                    data={data}
                    renderItem={(item) => this.registerItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                  />
                )}
              </View>

              <View style={styles.styleItems}>
                <View style={{ width: 120, marginHorizontal: 5 }}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => this.setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>Cerrar</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => this.setModalVisible(true)}
        >
          <Text style={styles.textStyle}>Seleccionar Cliente</Text>
        </Pressable>
      </View>
    );
  }
}

const pickerStyle = {
  inputIOS: {
    color: "white",
    paddingHorizontal: 10,
    backgroundColor: "red",
    borderRadius: 5,
    height: 20,
  },
  placeholder: {
    color: "white",
  },
  inputAndroid: {
    width: 100,
    height: 20,
    color: "white",
    paddingHorizontal: 10,
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

function defaultValueRegister() {
  return {
    ct_cedula: "",
    ct_cliente: "NO TIENE BUSQUEDA",
    ct_codigo: 0,
    ct_correo: "",
    ct_cupoasignado: 0,
    ct_cupodisponible: 0,
    ct_direccion: "",
    ct_plazo: 0,
    ct_telefono: "",
    ct_tipoid: 0,
    ct_tcodigo: 0,
  };
}

const styles = StyleSheet.create({
  input: {
    margin: 12,
    borderWidth: 1,
    width: 100,
    height: 30,
    textAlign: "center",
  },
  centeredView1: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#6f4993",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 5,
    paddingVertical: 10,
    fontSize: 20,
  },
  modelText2: {
    textAlign: "center",
    paddingHorizontal: 5,
    paddingVertical: 5,
    fontSize: 15,
  },
  modelText3: {
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 5,
    paddingBottom: 10,
    fontSize: 15,
  },
  styleItems: {
    flexDirection: "row",
    marginHorizontal: 20,
  },
  tabletitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  tabletext: {
    fontSize: 12,
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
});

export default ModalClientes;
