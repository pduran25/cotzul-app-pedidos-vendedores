import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, ActivityIndicator} from 'react-native'
import { colors } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";
import {SearchBar, ListItem, Icon} from "react-native-elements"
import ModalClientes from './ModalClientes';
import ModalItems from './ModalItems';
import { RadioButton } from 'react-native-paper';
import { Button} from 'react-native-elements';
import { FlatList } from "react-native-gesture-handler";


/**
* @author Pedro Durán A.
* @function  Creación de nuevo pedido
**/

function defaultCliente(){
    return{
      ct_cedula: "",
      ct_cliente: "NO TIENE BUSQUEDA",
      ct_codigo: 0,
      ct_correo: "",
      ct_cupoasignado: 0,
      ct_cupodisponible: 0,
      ct_direccion: "",
      ct_plazo: "-----",
      ct_telefono: "-----",
      ct_tipoid: 0
    }
  }

  function defaultItem(){
    return{
      it_codigo: 0,
      it_codprod: "",
      it_referencia: "",
      it_descripcion: "",
      it_precio: 0,
      it_stock: 0,
      it_marca: "----",
      it_familia: "----"
    }
  }

  Item =({item}) =>{
  

    return( 
        <View>
        <View style={{flexDirection: 'row'}}>
            <View style={{width:'25%', height: 30, borderColor: 'black', borderWidth: 1}}>
                <Text style={styles.tabletext}>{item.it_referencia}</Text>
            </View>
            
            <View style={{width:'25%', height: 30,   borderColor: 'black', borderWidth: 1}}>
                <Text style={styles.tabletext}>{item.it_marca}</Text>
            </View>
            <View style={{width:'25%', height: 30,   borderColor: 'black', borderWidth: 1}}>
                <Text style={styles.tabletext}>{item.it_stock}</Text>
            </View>
            <View style={{width:'25%', height: 30,   borderColor: 'black', borderWidth: 1}}>
            <Text style={styles.tabletext}><Icon onPress={()=>this.eliminaItem(item.it_codigo)}
                        type="material-community"
                        name="delete"
                        iconStyle={styles.iconRight}
                    /></Text>
            </View>
        </View>
        </View>
    )
    }

  

 

    const handleClick = event => {
        console.log(event.currentTarget.id);
      };

export default function NuevoPed(props) {
    const {navigation, route} = props;
    const { dataUser, recargarPedidos } = route.params;
    const [bodega, setBodega] =  useState(0);
    const [prioridad, setPrioridad] =  useState(0);
    const [cliente, setCliente] = useState(defaultCliente);
    const [dataitem, setDataItem] = useState([]);
    const [checked, setChecked] = React.useState('first');
    const [loading, setLoading] = useState(false);
    
    const [gnventas, setGnVentas] = useState(0);
    const [gngastos, setGnGastos] = useState(0);
    const [descuento, setDescuento] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [seguro, setSeguro] = useState(0);
    const [transporte, setTransporte] = useState(0);
    const [iva, setIva] = useState(0);
    const [total, setTotal] = useState(0);
    const [gnorden, setGnOrden] = useState(0);

    let nextId = 0;

   

    console.log(dataUser);

    const getCurrentDate=()=>{
 
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
    
        return date + '-' + month + '-' + year;//format: d-m-y;
  }

  const actualizaCliente =(item) =>{
    setCliente(item)
  }

  const actualizaItem =(newitem) =>{
    console.log(newitem)
    setDataItem(dataitem.concat(newitem))
    /*dataitem.push({
        id: nextId++,
        item: newitem,
      });*/
    console.log("dataitem. "+dataitem)
    setLoading(true)
  }

  eliminaItem = (nameItem)=>{
    setDataItem(dataitem.filter(item => item.it_codigo !== nameItem));
    console.log("ingreso: "+nameItem)
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
                <View style={styles.row}>
                <View style={styles.btnrow}>  
                    <Text style={styles.tittext}>Observación:</Text>  
                </View>
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
              
              <ModalClientes actualizaCliente={actualizaCliente}></ModalClientes>
              
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Cliente:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Teléfono:</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text>{cliente.ct_cliente}</Text></View>
                    <View style={styles.itemrow}><Text>{cliente.ct_telefono}</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Cupo Utilizado:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Cupo Disponible:</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text>{cliente.ct_cupoasignado}</Text></View>
                    <View style={styles.itemrow}><Text>{cliente.ct_cupoasignado}</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Política de Pago:</Text></View>
                    <View style={styles.itemrow}><Text>{cliente.ct_plazo}</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Tipo de Doc:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Contrato:</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><RNPickerSelect
                useNativeAndroidPickerStyle={false}
                style={pickerStyle}
                onValueChange={(bodega) => setBodega(bodega)}
                placeholder={{ label: "SELECCIONAR", value: 0 }}
                items={[
                    { label: "CHEQUE A FECHA", value: 1},
                    { label: "FACT. A CRÉDITO", value: 2},
                ]}
            /></View>
                    <View style={styles.itemrow}><RNPickerSelect
                useNativeAndroidPickerStyle={false}
                style={pickerStyle}
                onValueChange={(bodega) => setBodega(bodega)}
                placeholder={{ label: "SELECCIONAR", value: 0 }}
                items={[
                    { label: "CONTRATO 1", value: 1},
                    { label: "CONTRATO 2", value: 2},
                ]}
            /></View>
             
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Tipo de Descuento:</Text></View>
                    <View style={styles.itemrow}><Text>Item:</Text><RadioButton
        value="first"
        status={ checked === 'first' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('first')}
      />
      <Text>Porcentaje:</Text>
      <RadioButton
        value="second"
        status={ checked === 'second' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('second')}
      /></View>
                </View>
                
              </View>
              <View style={styles.titlesWrapper}>
                     <Text style={{fontWeight:'bold'}}>Listado de Items:</Text>
                </View>
                <View style={styles.detallebody}> 
                <View style={styles.row}>
                <View style={styles.itemrow2}>
                        <ModalItems actualizaItem={actualizaItem}></ModalItems>
                </View>

               

                </View>
                <Text style={{fontWeight:'bold', marginHorizontal: 10}}>Items registrados:</Text>
            
            <View style={{ marginTop:10, height: 120, marginHorizontal: 10}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width:'25%', backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Referencia</Text>
                    </View>
                    <View style={{width:'25%', backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Marca</Text>
                    </View>
                    
                    <View style={{width:'25%', backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Stock</Text>
                    </View>
                    <View style={{width:'25%', backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Elimina</Text>
                    </View>
                </View>
                {(loading) ? (<FlatList 
                    data={dataitem}
                    renderItem = {Item}
                    keyExtractor = {(item, index)=> index.toString()}
                />) : <ActivityIndicator
                      size="large" 
                      loading={loading}/>} 
                
            </View>
                </View>



                <View style={styles.row}>
                <View style={styles.titlesWrapper}>
                     <Text style={{fontWeight:'bold'}}>Rentabilidad estimada:</Text>
                </View>
                <View style={styles.titlesWrapper}>
                     <Text style={{fontWeight:'bold'}}>Total Pedido:</Text>
                </View>
                </View>
                <View style={styles.row}>
                <View style={styles.detallebody1}> 
                <View style={styles.itemrow2}><Text style={styles.tittext}>% Gn. Ventas:</Text></View>                                                                                                                                                                                                                                                                                                                             
                    <View style={styles.itemrow2}><Text style={styles.itemtext}>${gnorden}</Text></View>
                    <View style={styles.itemrow2}><Text style={styles.tittext}>% Gn. Ventas:</Text></View>
                    <View style={styles.itemrow2}><Text style={styles.itemtext}>${gnventas}</Text></View>
                    <View style={styles.itemrow2}><Text style={styles.tittext}>% Gn. Gastos:</Text></View>
                    <View style={styles.itemrow2}><Text style={styles.itemtext}>${gngastos}</Text></View>
                </View>

                <View style={styles.detallebody1}> 

                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Subtotal:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.itemtext}>${subtotal}</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Desc. %:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.itemtext}>${descuento}</Text></View>
                </View>  
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Seguro:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.itemtext}>${seguro}</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Trans.:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.itemtext}>${transporte}</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>IVA:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.itemtext}>${iva}</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Total:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.itemtext}>${total}</Text></View>
                </View>
                </View>
                </View>

                <View style={{alignItems:'center', marginVertical:20}}>
                <Button
                    title="Enviar Pedido"
                    containerStyle={styles.btnContainerLogin}
                    buttonStyle = {styles.btnLogin}
                    onPress= {null}
                />
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
}, tabletitle:{
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 12,
}, tabletext:{
    textAlign: 'center', 
    fontSize: 12,
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
    alignItems: 'center'
},
row:{
    flexDirection: 'row'
},
itemrow:{
    width: '50%',
    alignItems: 'center',
    borderWidth: 0.5,
    padding:3
},itemrow2:{
    width: '100%',
    alignItems: 'center',
    borderWidth: 0.5,
    padding:3
},
itemobserv:{
    width: '100%',
    paddingHorizontal:20
},
tittext:{
    fontWeight: 'bold',
    fontSize: 14,
    marginTop:5,
    textAlign: 'left'
},
itemtext:{
    fontSize: 14,
    marginTop:5,
    textAlign: 'left'
},
titlesTitle:{
    // fontFamily: 
   fontSize: 35,
   color: colors.textDark,
},detallebody:{

    width: '90%',
    marginHorizontal: 20,
    marginTop: 10,
    borderWidth: 1,
},
detallebody1:{

    width: '40%',
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