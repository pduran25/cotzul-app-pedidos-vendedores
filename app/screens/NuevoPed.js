import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, ScrollView, Alert, TextInput } from 'react-native'
import { colors } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";
import { Button} from 'react-native-elements';
import ModalClientes from './ModalClientes';


/**
* @author Pedro Durán A.
* @function  Creación de nuevo pedido
**/

function defaultCliente(){
    return{
        cl_codigo: '-----',
        cl_nombre: '-----',
        cl_telefono: '-----',
        cl_cupo: '-----',
        cl_disponible: '-----',
        cl_politicapago: '-----'
    }
}

export default function NuevoPed(props) {
    const {navigation, route} = props;
    const { dataUser, recargarPedidos } = route.params;
    const [bodega, setBodega] =  useState(0);
    const [prioridad, setPrioridad] =  useState(0);
    const [cliente, setCliente] = useState(defaultCliente);

    console.log(dataUser);

    const getCurrentDate=()=>{
 
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
    
        return date + '-' + month + '-' + year;//format: d-m-y;
  }

  const actualizaCliente =() =>{

  }

 return(
    <ScrollView style={styles.container}>
        <View style={styles.titlesWrapper}>
            <Text style={styles.titlesSubtitle}>Cotzul S.A.</Text>
            <Text style={styles.titlespick2}>Usuario: {dataUser.vn_nombre}</Text>
            <Text style={{fontWeight:'bold'}}></Text>
            <Text style={{fontWeight:'bold'}}>Datos del Pedido:</Text>
        </View>
       
            <View style={styles.detallebody}> 
                
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>N# Pedido:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Fecha:</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text>0001</Text></View>
                    <View style={styles.itemrow}><Text>{getCurrentDate()}</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Empresa/Bodega:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Prioridad:</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><RNPickerSelect
                useNativeAndroidPickerStyle={false}
                style={pickerStyle}
                onValueChange={(bodega) => setBodega(bodega)}
                placeholder={{ label: "SELECCIONAR", value: 0 }}
                items={[
                    { label: "COTZUL-BODEGA", value: 1},
                ]}
            /></View>
                    <View style={styles.itemrow}><RNPickerSelect
                useNativeAndroidPickerStyle={false}
                style={pickerStyle}
                onValueChange={(prioridad) => setPrioridad(prioridad)}
                placeholder={{ label: "SELECCIONAR", value: 0 }}
                items={[
                    { label: "NORMAL", value: 1},
                    { label: "URGENTE", value: 2},
                ]}
            /></View>
                </View>
                <View>
                        <View style={styles.itemrow}><Text style={styles.tittext}>Observaciones:</Text></View>
                </View>
                <View style={styles.itemobserv} >
                        <TextInput
                        multiline
                        numberOfLines={5}
                        placeholder="Registre una observación"
                        style={styles.input}
                    />
                </View>
              </View>

              <View style={styles.titlesWrapper}>
              <Text style={{fontWeight:'bold'}}>Datos del Cliente:</Text>
                </View>
              <View style={styles.detallebody}> 
              <View style={styles.btnrow}>
                <ModalClientes></ModalClientes>
              </View>
              
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Cliente:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Teléfono:</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text>{cliente.cl_nombre}</Text></View>
                    <View style={styles.itemrow}><Text>-----------------</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Cupo Utilizado:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Cupo Disponible:</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text>-----------------</Text></View>
                    <View style={styles.itemrow}><Text>-----------------</Text></View>
                </View>
                <View style={styles.btnrow}>  
                    <Text style={styles.tittext}>Política de pago:</Text>  
                </View>
                <View style={styles.btnrow}>  
                    <Text>-------------------------------------------</Text>  
                </View>
                
              </View>
    </ScrollView>
  )
}

const pickerStyle = {
    inputIOS: {
        color: 'white',
        paddingHorizontal: 20,
        marginTop: 10,
        marginHorizontal: 20,
        backgroundColor: "#6f4993",
        borderRadius: 5,
        height: 30,
    },
    placeholder: {
        color: 'white',
      },
    inputAndroid: {
        width: '85%',
        height: 20,
        color: 'white',
        marginHorizontal: 20,
        paddingLeft:10,
        backgroundColor: '#6f4993',
        borderRadius: 5,
    },
    searchWrapper:{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 0,
        marginTop: 10,
    },
    search:{
        flex: 1,
        marginLeft: 0,
        borderBottomColor: colors.textLight,
        borderBottomWidth: 1,
    }
};


const styles = StyleSheet.create({
  scrollview:{
    marginTop:10,
    marginBottom: 50,
},titlesWrapper:{
    marginTop: 5,
    paddingHorizontal: 20,
},titlesSubtitle:{
    fontWeight: 'bold',
   fontSize: 16,
   color: colors.textDark,
},titlespick2:{
    fontSize: 16,
    color: colors.textDark, 
    paddingTop: 5,
},
btnrow:{
    width: '100%',
    alignItems: 'center',
    paddingBottom:40
},
row:{
    flexDirection: 'row',
},
itemrow:{
    width: '50%',
    alignItems: 'center'
},
itemobserv:{
    width: '100%',
    paddingHorizontal:20
},
tittext:{
    fontWeight: 'bold',
    fontSize: 14,
    marginTop:5
},
titlesTitle:{
    // fontFamily: 
   fontSize: 35,
   color: colors.textDark,
},detallebody:{

    height: 200,
    width: '90%',
    marginHorizontal: 20,
    marginTop: 10,
    borderWidth: 1,
},
btnContainerLogin:{
    marginTop: 10, 
    width: "90%"
},
btnLogin:{
    backgroundColor: "#6f4993",
}, 
})