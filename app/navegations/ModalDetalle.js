import React, { useEffect, Component } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View,
  ActivityIndicator,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SearchBar, ListItem, Icon, colors } from "react-native-elements";
import { DebugInstructions } from "react-native/Libraries/NewAppScreen";
import * as SQLite from "expo-sqlite";

class ModalDetalle extends Component {
    constructor(props) {
      super();
      this.state = {
        data: [],
        isLoading: true
      };
    }
    state = {
      modalVisible: false,
    };
  
    componentDidMount() {
      this.setState({ modalVisible: false });
    }
  
    setModalVisible = (visible) => {
      this.setState({ modalVisible: visible });
      console.log("probando set modal:"+this.props.codigo);
      if(visible)
        this.getItems();
    };
  
  
  
    getItems = async () => {
      try {
        this.setState({ isLoading: true });
        const database_name = "CotzulBD2.db";
        const database_version = "2.0";
        const database_displayname = "CotzulBD";
        const database_size = 200000;
        let db = null;

        
  
        db = SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size
        );
  

        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM items WHERE it_codigo = ?",
            [this.props.codigo],
            (tx, results) => {
              var len = results.rows.length;
              console.log("cantidad de item: "+len)
              this.setState({ data: results.rows.item(0) });
              this.setState({ isLoading: false });
            }
          );
        });

      } catch (e) {
        this.setState({ isLoading: false });
        console.log("Error cadena");
        console.log(e);
      }
    };
  

  
    render() {
      const { modalVisible, data, isLoading } = this.state;
  
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
                  <Text style={styles.modalText}>Detalle de Producto</Text>
                  <Text style={styles.modalTexta}>{data.it_referencia}</Text>
                  <Text style={styles.modalTextb}>{data.it_descripcion}</Text>
                </View>
              </View>
             
      <View style={styles.row}>
            <View style={styles.itemrow}>
              <Text style={{ fontWeight: "bold" }}>Stock Distribuido</Text>
            </View>
            <View style={styles.itemrow}>
              <Text style={{ fontWeight: "bold" }}>Precios</Text>
            </View>
          </View>
      <View style={styles.row}>
        <View style={styles.detallebody1}>
        <View style={styles.row}>
            <View style={styles.itemrow}>
              <Text style={styles.tittext}>Bod.:</Text>
            </View>
            <View style={styles.itemrow}>
              <Text style={styles.itemtext}>{data.it_bod}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.itemrow}>
              <Text style={styles.tittext}>Tel.:</Text>
            </View>
            <View style={styles.itemrow}>
              <Text style={styles.itemtext}>{data.it_alm}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.itemrow}>
              <Text style={styles.tittext}>Pro:</Text>
            </View>
            <View style={styles.itemrow}>
              <Text style={styles.itemtext}>{data.it_chi}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.itemrow}>
              <Text style={styles.tittext}>Rep.:</Text>
            </View>
            <View style={styles.itemrow}>
              <Text style={styles.itemtext}>{data.it_rep}</Text>
            </View>
          </View>
          <View style={styles.row}>
          </View>
          <View style={styles.row}>
            <View style={styles.itemrow}>
              <Text style={styles.tittext}>Stock:</Text>
            </View>
            <View style={styles.itemrow}>
              <Text style={styles.itemtext}>{data.it_stock}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detallebody1}>
          <View style={styles.row}>
            <View style={styles.itemrow}>
              <Text style={styles.tittext}>Subd:</Text>
            </View>
            <View style={styles.itemrow}>
              <Text style={styles.itemtext}>${Number(data.it_preciosub).toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.itemrow}>
              <Text style={styles.tittext}>Contado:</Text>
            </View>
            <View style={styles.itemrow}>
              <Text style={styles.itemtext}>${Number(data.it_contado).toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.itemrow}>
              <Text style={styles.tittext}>Crédito:</Text>
            </View>
            <View style={styles.itemrow}>
              <Text style={styles.itemtext}>${Number(data.it_precio).toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.itemrow}>
              <Text style={styles.tittext}>Público:</Text>
            </View>
            <View style={styles.itemrow}>
              <Text style={styles.itemtext}>${Number(data.it_pvp).toFixed(2)}</Text>
            </View>
          </View>
          
         
          
        </View>
      </View>
             
            
                <View style={styles.styleItems}>
                  <View style={{ width: 120, marginHorizontal: 5, marginTop: 20 }}>
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
            onPress={() => this.setModalVisible(true)}
          >
            <Icon
                onPress={null}
                type="material-community"
                name="card-search-outline"
                size={30}
                iconStyle={styles.iconRight}
              />
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
      margin: 10,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      height: 400,
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
      color: "#6f4993",
      fontSize: 20,
    },
    modalTexta: {
      fontWeight: "bold",
      textAlign: "center",
      paddingHorizontal: 5,
      fontSize: 18,
    },
    modalTextb: {
      textAlign: "center",
      paddingHorizontal: 5,
      paddingVertical: 10,
      fontSize: 12,
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
      textAlign: "center"
    },
    tabletext: {
      fontSize: 12,
      textAlign: "center"
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
    itemrow: {
        width: "50%",
        alignItems: "center",
        borderWidth: 0.5,
        padding: 3,
      },
      itemrow2: {
        width: "100%",
        alignItems: "center",
        borderWidth: 0.5,
        padding: 3,
      },
      itemrow3: {
        width: "100%",
        alignItems: "center",
        borderWidth: 0.5,
        paddingVertical: 75,
      },
      itemrow4: {
        width: "100%",
        alignItems: "center",
        borderWidth: 0.5,
        padding: 3,
        height: 43,
      },
      row: {
        flexDirection: "row",
      },
      titlesWrapper: {
        marginTop: 5,
        paddingHorizontal: 0,
      },
      detallebody1: {
        width: "45%",
        marginHorizontal: 10,
        marginTop: 10,
      },
  });
  
  export default ModalDetalle;