import React, {useEffect, Component } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, TextInput, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";




const dataclientes =[
    {
        cl_codigo: '0001',
        cl_nombre: 'FRANCISCO GOMEZ',
        cl_telefono: '0985997161',
        cl_cupo: '2000',
        cl_disponible: '1500',
        cl_politicapago: 'ninguna'
    },
    {
        cl_codigo: '0002',
        cl_nombre: 'RAFAELA ICAZA',
        cl_telefono: '0904883215',
        cl_cupo: '30',
        cl_disponible: '2970',
        cl_politicapago: 'ninguna'
    },
    {
        cl_codigo: '0003',
        cl_nombre: 'RAUL HUERTA',
        cl_telefono: '0997462112',
        cl_cupo: '700',
        cl_disponible: '2300',
        cl_politicapago: 'ninguna'
    },
    
]

const item =({item}) =>{
        

    return( 
        
       
        <TouchableOpacity >
        <View style={{flexDirection: 'row', backgroundColor: item.background, marginRight:15}}>
            <View style={{width:75, height: 30, borderColor: 'black', borderWidth: 1}}>
                <Text style={styles.tabletext}>{item.cl_codigo}</Text>
            </View>
            
            <View style={{width:85, height: 30,   borderColor: 'black', borderWidth: 1}}>
                <Text style={styles.tabletext}>{item.cl_nombre}</Text>
            </View>
            <View style={{width:85, height: 30,   borderColor: 'black', borderWidth: 1}}>
                <Text style={styles.tabletext}>{item.cl_telefono}</Text>
            </View>
            <View style={{width:85, height: 30,   borderColor: 'black', borderWidth: 1}}>
            <Text style={styles.tabletext}>$ {item.cl_disponible}</Text>
            </View>
        </View>
        </TouchableOpacity>
    )
    }
    


class ModalClientes extends Component {


    

  constructor(props) {
    super();
    this.state = {
        data: [],
        isLoading: true,
        check: false,
        texto: Number(props.valbol).toFixed(2),
        index: props.indexval
      };
 }
  state = {
    modalVisible: false,
   
  };

  buscandoActualizar(valbol){
    this.setTexto(Number(valbol).toFixed(2));
    this.setModalVisible(true)
  }


  componentDidMount() {
    this.setState({ modalVisible: false });
    
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  setTexto = (texto1) =>{
    this.setState({ texto: texto1 });
  }

  GrabarNewPrecio(texto, indexval, actualizaValor){
    console.log("paso por aqui ");
    
    actualizaValor(texto, indexval);
    this.setModalVisible(!this.state.modalVisible);
    
};



  render() {
    const { modalVisible, texto } = this.state;
    const {valbol, actualizaValor, indexval} = this.props;

    console.log("valbol recibido: " + valbol);
    
        return (
      <View style={styles.centeredView}>
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
              <Text style={styles.modalText}>Listado de Clientes</Text>
              <View style={{ marginHorizontal:20, marginTop:10, height: 120}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width:75, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>#Codigo:</Text>
                    </View>
                    <View style={{width:85, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Nombre:</Text>
                    </View>
                    
                    <View style={{width:85, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Teléfono:</Text>
                    </View>
                    <View style={{width:85, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Cupo:</Text>
                    </View>
                </View>
                {<FlatList 
                    data={dataclientes}
                    renderItem = {item}
                    keyExtractor = {(item, index)=> index.toString()}
                />} 
                
            </View>
              
            <View style={styles.styleItems}>
                    <View style={{width:120 , marginHorizontal:5}}>
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
          
          onPress={() => this.buscandoActualizar(valbol)}
        >
           <Text style={styles.textStyle}>Seleccionar Cliente</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    input: {
        margin: 12,
        borderWidth: 1,
        width:100,
        height:30,
        textAlign:'center'
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom:10
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
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
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
        textAlign: "center"
      },
      modalText:{
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 5,
        paddingVertical:10,
        fontSize: 20,
      },
      modelText2:{
        textAlign: 'center',
        paddingHorizontal: 5,
        paddingVertical:5,
        fontSize: 15,
      },
      modelText3:{
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 5,
        paddingBottom:10,
        fontSize: 15,
      },
      styleItems:{
        flexDirection: "row",
        marginHorizontal: 20,
    },
    tabletitle:{
        fontSize: 12,
        fontWeight: 'bold',
    },
    tabletext:{
        fontSize: 12,
    },
});

export default ModalClientes;