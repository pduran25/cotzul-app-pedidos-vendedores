import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, ActivityIndicator} from 'react-native'
import RNPickerSelect from "react-native-picker-select";
import {SearchBar, ListItem, Icon,  Input, colors} from "react-native-elements"
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
      it_familia: "----",
      it_costoprom: 0
    }
  }

  function defaultPeso(){
    return{
      pl_peso: 0,
      pl_tarifa1: 0,
      pl_tarifa2: 0
    }
  }

  function defaultVendedor(){
    return{
        vd_codigo: 0,
        vd_vendedor: ""
    }
  }

  function defaultPlazo(){
    return{
        label: "8 días",
        value: 25
    }
  }

 


  

 

  
    
 

    const handleClick = event => {
        console.log(event.currentTarget.id);
      };

export default function NuevoPed(props) {
    const {navigation, route} = props;
    const { dataUser, regresarFunc } = route.params;
    const [bodega, setBodega] =  useState(0);
    const [doc, setDoc] =  useState(0);
    const [prioridad, setPrioridad] =  useState(0);
    const [tprecio, setTprecio] =  useState(1);
    const [cliente, setCliente] = useState(defaultCliente);
    const [dataitem, setDataItem] = useState([]);
    const [checked, setChecked] = React.useState('first');
    const [loading, setLoading] = useState(false);
    const [tcodigo, setTcodigo] = useState(0);
    const [gnventas, setGnVentas] = useState(0);
    const [gngastos, setGnGastos] = useState(0);
    const [descuento, setDescuento] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [seguro, setSeguro] = useState(0);
    const [transporte, setTransporte] = useState(0);
    const [vtrans, setVTrans] = useState(0);
    const [iva, setIva] = useState(0);
    const [total, setTotal] = useState(0);
    const [gnorden, setGnOrden] = useState(0);
    const [porcent, setPorcent] = useState(0);
    const [plazo, setPlazo] = useState([]);
    const [transp, setTransp] = useState([]);
    const [vpeso, setVpeso] = useState(defaultPeso);
    const[vplazo, setVplazo] =  useState({ label: "8 días", value: 25 });
    const [tplazo, setTPlazo] = useState(25);
    const [tvendedor, setTvendedor] = useState(0);
    const [ttrans, setTtrans] = useState(0);
    const [desc, setDesc] = useState(0);
    const [cant, setCant] = useState(0);
    const [subtemp, setSubtemp] = useState(0);
    const [tottemp, setTottemp] = useState(0);
   const [itemtotal, setItemTotal] = useState([]);
   const [valindex, setValIndex] = useState(0);
   const [cadenaint, setCadenaint] = useState("");
   const [cadenita, setCadenita] = useState("");
   const [idnewvendedor, setIdnewvendedor] = useState(dataUser.vn_codigo);
   const [ubicacion, setUbicacion] = useState(0);
   const [vseguro, setVseguro] = useState(0);
   const [cobertura, setCobertura] = useState("---");
   const [tarifa, setTarifa] = useState(0);
   const [vvendedor, setVvendedor] = useState([]);
   const [kilos, setKilos] = useState(0);
   const [notidplazo, setNotIdplazo] = useState(0);
   const [notnomplazo, setNotnomplazo] = useState("plazo");
   var resindex = 0;
   var itemtext = "";


    
    const [valrecibo,setRecibo] = useState("000"+(Number(dataUser.vn_recibo)+1))
    const [numdoc, setNumDoc] = useState(Number(dataUser.vn_recibo)+1);



    const [obs, setObs] = useState("");

    let nextId = 0;


    const Item =({item, index}) =>{
  

        return( 
            <View>
            <View style={{flexDirection: 'row'}}>
            
                
                <View style={{width:120, height: 30, borderColor: 'black', borderWidth: 1}}>
                    <Text style={styles.tabletext}>{item.it_referencia+"-"+item.it_descripcion}</Text>
                </View>
                <View style={{width:70, height: 30,   borderColor: 'black', borderWidth: 1}}>
                    <Text style={styles.tabletext}>{item.it_stock}</Text>
                </View>
                <View style={{width:70, height: 30,   borderColor: 'black', borderWidth: 1}}>
                    <Text style={styles.tabletext}>{item.it_sku}</Text>
                </View>
                
                <View style={{width:100, height: 30,   borderColor: 'black', borderWidth: 1}}>
                    <Text style={styles.tabletext}>{item.it_marca}</Text>
                </View>
                <View style={{width:70, height: 30,   borderColor: 'black', borderWidth: 1}}>
                    <TextInput
                            keyboardType='numeric'
                            placeholder='0,0'
                            style={styles.tabletext}
                            onChangeText={(val)=> setCanti(val, index)}
                            onEndEditing={()=>EditarResultados(item.it_codprod, itemtotal[index].cantidad, itemtotal[index].descuento, item.it_precio, item.it_pvp, item.it_preciosub, item.it_contado, itemtotal[index].preciosel, itemtotal[index].editable,  item.it_costoprom, item.it_peso, item.it_referencia+"-"+item.it_descripcion) }
                            />
                </View>
                <View style={{width:150, height: 30,   borderColor: 'black', borderWidth: 1}}>
                <RNPickerSelect
                        useNativeAndroidPickerStyle={false}
                        style={pickerStyle2}
                        onValueChange={(tprecio) => setNumprecio(tprecio, index)}
                        placeholder={{ label: "P. CREDITO", value: 1 }}
                        items={[
                            { label: "P.V.P.", value: 2},
                            { label: "P. SUBDIST.", value: 3},
                            { label: "P. CONTADO", value: 4},
                            { label: "EDITABLE", value: 5},
                        ]}
                    />
                </View>
                <View style={{width:70, height: 30,   borderColor: 'black', borderWidth: 1}}>
                    {(itemtotal[index].editable == 1)?(<TextInput
                            keyboardType='numeric'
                            placeholder='0,0'
                            style={styles.tabletext}
                            onChangeText={(val)=> setPrecioVal(val, index)}
                            onEndEditing={()=>ActualizaResultados(item.it_codprod)}
                            />):( <Text style={styles.tabletext}>$ {Number(itemtotal[index].preciosel).toFixed(2)}</Text>)}
                   
                </View>
                <View style={{width:70, height: 30,   borderColor: 'black', borderWidth: 1}}>
                    <Text style={styles.tabletext}>$ {Number(itemtotal[index].subtotal).toFixed(2)}</Text>
                </View>
                <View style={{width:70, height: 30,   borderColor: 'black', borderWidth: 1}}>
                        {(checked == 'second')?(<Text style={styles.tabletext}> --- </Text>):(
                         <TextInput
                            keyboardType='numeric'
                            placeholder='0,0'
                            style={styles.tabletext}
                            onChangeText={(val)=> setDescu(val, index)}
                            onEndEditing={()=>EditarResultados(item.it_codprod, itemtotal[index].cantidad, itemtotal[index].descuento, item.it_precio, item.it_pvp, item.it_preciosub, item.it_contado, itemtotal[index].preciosel, itemtotal[index].editable,  item.it_costoprom, item.it_peso, item.it_referencia+"-"+item.it_descripcion)}
                            />)}
                </View>
                <View style={{width:70, height: 30,   borderColor: 'black', borderWidth: 1}}>
                    <Text style={styles.tabletext}>$ {Number(itemtotal[index].total).toFixed(2)}</Text>
                </View>
                <View style={{width:70, height: 30,   borderColor: 'black', borderWidth: 1}}>
                    <Text style={styles.tabletext}>{Number(itemtotal[index].gngastos).toFixed(2)}</Text>
                </View>
                <View style={{width:70, height: 30,   borderColor: 'black', borderWidth: 1}}>
                <Text style={styles.tabletext}><Icon onPress={()=>eliminaItem(item.it_codprod)}
                            type="material-community"
                            name="delete"
                            iconStyle={styles.iconRight}
                        /></Text>
                </View>
            </View>
            </View>
        )
        }
    
    const setCanti = (valor, index) =>{
        if(valor == ""){
            setCant(0);
            itemtotal[index].cantidad = 0;
        }
        else{
            setCant(valor);
            itemtotal[index].cantidad = valor;
        }
            
    }

    const setDescu = (valor, index) =>{
        if(valor == ""){
            setDesc(0);
            itemtotal[index].descuento = 0;
        }
        else{
            setDesc(valor);
            itemtotal[index].descuento = valor;
        }
            
    }

    const setNumprecio = (valor, index) =>{
        setTprecio(valor);
        if(valor == 1){
            itemtotal[index].preciosel = itemtotal[index].precio;
        }
        if(valor == 2){
            itemtotal[index].preciosel = itemtotal[index].pvp;
        }
        if(valor == 3){
            itemtotal[index].preciosel = itemtotal[index].subdist;
        }
        if(valor == 4){
            itemtotal[index].preciosel = itemtotal[index].contado;
        }
        if(valor == 5){
            itemtotal[index].preciosel = 0;
            itemtotal[index].editable = 1;
        }

        ActualizaResultados(itemtotal[index].codprod);
    }

    const setPrecioVal = (valor, index) =>{
        if(itemtotal[index].editable == 1){
            itemtotal[index].preciosel = valor;
        }
    }

    

    console.log(dataUser);

    const getCurrentDate=()=>{
 
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
    
        return date + '-' + month + '-' + year;//format: d-m-y;
  }

  const [fechaped, setFechaPed] = useState(getCurrentDate());

  const actualizaCliente =(item) =>{
    setCliente(item)
    setTcodigo(item.ct_tcodigo);
    setNotIdplazo(item.ct_idplazo);
    setNotnomplazo(item.ct_plazo);
    cargarTarifas(item.ct_tcodigo, ttrans);
    setUbicacion(item.ct_ubicacion);
    cargarPlazo();
  }

  const inicializaCliente = () =>{
    console.log("entro a inicializar");
    setNotIdplazo(0);
    setNotnomplazo("SELECCIONAR");
  }

  const actualizaVendedor = (item) =>{
    console.log("codigo inicial: "+ item);
    setTvendedor(item);
    setIdnewvendedor(item);
    console.log("codigo del nuevo vendedor: "+item);
  }





  const actualizaItem =(newitem) =>{
    if(noElementoSimilar(newitem.it_codprod)){
        resindex = 0;
        console.log(newitem)
        setDataItem(dataitem.concat(newitem))
        console.log("dataitem. "+dataitem);
        
        agregaResultados(newitem.it_codprod, 0,0, newitem.it_precio,newitem.it_pvp, newitem.it_preciosub, newitem.it_contado,0, 0, 0,  "-");
        resindex = valindex + 1;
        setValIndex(resindex);
        setLoading(true)
    }else{
        Alert.alert("El Item ya ha sido ingresado");
    }
   
  }

  const noElementoSimilar = (codigo) =>{
    var variable = true;
    for (let i = 0; i < itemtotal.length; i++) {
        if(itemtotal[i].codprod == codigo) 
            variable = false;
    }
    return variable;
  }

 

  const eliminaItem = (nameItem)=>{
    setDataItem(dataitem.filter(item => item.it_codprod !== nameItem));
    console.log("ingreso: "+nameItem)
    eliminardeArray(nameItem);
  }

  const eliminardeArray = (codigo)=>{
    var vindex = 0;
    for (let i = 0; i < itemtotal.length; i++) {
        if(itemtotal[i].codprod == codigo) 
            vindex = i;
    }

    //delete itemtotal[vindex];
    itemtotal.splice(vindex, 1);
    CargarResultados();
  }

  const registrarPlazo = (dataPlazo) =>{
    var temp = [];
    for (let i = 0; i < dataPlazo.length; ++i) {
        temp.push({ label: dataPlazo[i].pl_descripcion, value:dataPlazo[i].pl_codigo })
    }
    console.log("se encontro plazo: "+ temp);
    setPlazo(temp);
}

const registrarVendedores = (dataVend) =>{
    var temp = [];
    for (let i = 0; i < dataVend.length; ++i) {
        temp.push({ label: dataVend[i].vd_vendedor, value:dataVend[i].vd_codigo })
    }
    console.log("se encontro vendedor: "+ temp);
    setVvendedor(temp);
}

const registrarTransporte = (dataTransporte) =>{
    var temp = [];
    for (let i = 0; i < dataTransporte.length; ++i) {
        temp.push({ label: dataTransporte[i].pl_nombre, value:dataTransporte[i].pl_codigo })
    }
    console.log("se encontro plazo: "+ temp);
    setTransp(temp);
}

const agregaResultados = ( codprod, cant, desc, precio, pvp, subdist, contado, editable,  costo, peso, descripcion) =>{
   var temp = [];
   var gngastosv = 0;
   for (let i = 0; i < itemtotal.length; ++i) {
        gngastosv = Number(itemtotal[i].costo) / Number(itemtotal[i].subtotal);
        temp.push({codprod: itemtotal[i].codprod,  descripcion: itemtotal[i].descripcion , cantidad: itemtotal[i].cantidad, precio: itemtotal[i].precio,  pvp: itemtotal[i].pvp, subdist: itemtotal[i].subdist, contado: itemtotal[i].contado, preciosel: itemtotal[i].preciosel, editable: itemtotal[i].editable,   costo: itemtotal[i].costo, descuento: itemtotal[i].descuento,subtotal: itemtotal[i].subtotal, total: itemtotal[i].total, peso: itemtotal[i].peso, gngastos: gngastosv});
    }

    var ressub = 0, restot = 0;
    ressub = Number(cant) * Number(precio);
    restot = (ressub - ((ressub * desc)/100));


    temp.push({codprod: codprod,  descripcion: descripcion,cantidad:cant, precio: precio, pvp: pvp, subdist: subdist, contado:contado,  preciosel: precio, editable: editable,  costo: costo, descuento:desc, subtotal: ressub, total: restot, peso: peso, gngastos:0});
    setItemTotal(temp);

}

const CargarResultados = () =>{
    
    var temp = [];
    var varsubtotal = 0;
    var varseguro = 0;
    var vartransp = 0;
    var variva = 0;
    var vartotal = 0;
    var vardesc = 0;
    var varorden = 0, varventas = 0, vargastos = 0;
    var resdes = 0;
    var totpeso = 0;
    var numcod = 0;
    var porcpor = 0;
    var valpeso = 0;
    itemtext = "";
    var cadenita1 = "";
    var gngastosv = 0;
    

    for (let i = 0; i < itemtotal.length; i++) {
            numcod ++;
            
            varsubtotal = varsubtotal + itemtotal[i].subtotal;

            gngastosv = Number(itemtotal[i].costo) / Number(itemtotal[i].subtotal);
            temp.push({codprod: itemtotal[i].codprod, descripcion: itemtotal[i].descripcion ,cantidad: itemtotal[i].cantidad, precio: itemtotal[i].precio, pvp: itemtotal[i].pvp, subdist: itemtotal[i].subdist, contado: itemtotal[i].contado, preciosel: itemtotal[i].preciosel, editable:itemtotal[i].editable,  costo: itemtotal[i].costo, descuento: itemtotal[i].descuento, subtotal: itemtotal[i].subtotal, total: itemtotal[i].total, peso: itemtotal[i].peso, gngastos: gngastosv });
            valpeso = Number(itemtotal[i].cantidad) *  Number(itemtotal[i].peso);
            totpeso = totpeso + valpeso;
            porcpor = Number(porcpor) + Number(itemtotal[i].descuento);
            resdes = resdes +  Number(itemtotal[i].subtotal * itemtotal[i].descuento)/100;
            itemtext = itemtext + "<detalle d0=\""+numcod+"\" d1=\""+itemtotal[i].codprod+"\" d2=\""+itemtotal[i].cantidad+"\" d3=\""+itemtotal[i].preciosel+"\" d4=\""+itemtotal[i].descripcion+"\" d5=\""+itemtotal[i].peso+"\" d6=\""+itemtotal[i].descuento+"\" d7=\""+0+"\"></detalle>";
            cadenita1 = cadenita1 + "*"+numcod+";"+itemtotal[i].codprod+";"+itemtotal[i].descripcion+";"+itemtotal[i].cantidad+";"+itemtotal[i].preciosel+";"+itemtotal[i].descuento+";"+itemtotal[i].total;

     }

     setCadenaint(itemtext);
     setCadenita(cadenita1);

     cargarTarifas(tcodigo, ttrans);
     

     setItemTotal(temp);
     setSubtotal(varsubtotal);
     console.log("entro con el valor de transporte: "+ ttrans);
     setKilos(totpeso);

     if(ttrans != 12 && ttrans != 90 && ttrans != 215){
        setTransporte(Number(vtrans));
        vartransp = Number(vtrans);
     }else{
        console.log("entro con el valor TARIFAS2:"+vpeso.pl_peso+" EL TOTAL PESO: "+totpeso);
        if(vpeso.pl_peso != null || totpeso != null){
        if(vpeso.pl_peso != 0){
            if(totpeso < vpeso.pl_peso){
                vartransp = Number(vpeso.pl_tarifa1);
                setTarifa(vpeso.pl_tarifa1);
                setTransporte(vartransp);
            }else{
                vartransp = (totpeso * vpeso.pl_tarifa2);
                setTarifa(vpeso.pl_tarifa2);
                setTransporte(vartransp);
            }
        }
    }  
     }
      
     
    

     if(checked == 'second'){
        vardesc = (varsubtotal * porcent)/100;
     }else{
        vardesc = resdes;
        porcpor = (vardesc/varsubtotal)*100;
        setPorcent(porcpor);
     }
     setDescuento(vardesc);

      /*validación de seguro*/


      varseguro = ((varsubtotal-vardesc) * vseguro)/100;
      setSeguro(varseguro);

     variva = (varsubtotal-vardesc+varseguro) * 0.12;
     setIva(variva);
     
     
     vartotal = (varsubtotal - vardesc) + varseguro + vartransp + variva;
     setTotal(vartotal);

     console.log("valor del total: "+vartotal);
     setTotal(vartotal);

     console.log("res. subtotal: "+Number(varsubtotal));
     console.log("resultado var orden: "+(Number(vartotal) - Number(vardesc) - Number(varsubtotal)).toFixed(2));
     varorden = (Number(vartotal) - Number(vardesc) - Number(varsubtotal));
     varventas = ((gnorden/(Number(vartotal)-Number(vardesc)))*100);
     vargastos = ((Number(vartotal)-Number(vardesc))/Number(varsubtotal));

     setGnOrden(varorden);
     setGnVentas(varventas);
     setGnGastos(vargastos);
}

const ActualizaResultados = (codprod) =>{
    var temp = [];
    var varsubtotal = 0;
    var varseguro = 0;
    var vartransp = 0;
    var variva = 0;
    var vartotal = 0;
    var vardesc = 0;
    var varorden = 0, varventas = 0, vargastos = 0;
    var resdes = 0;
    var valpeso = 0;
    var totpeso = 0;
    var valtarifa = 0;
    var numcod = 0;
    var porcpor = 0;
    var cadenita1 = "";
    var rescosto = 0;
    var varsubtotalcosto = 0;
    itemtext = "";
    var gngastosv = 0;


    for (let i = 0; i < itemtotal.length; i++) {
        numcod++;
        if(itemtotal[i].codprod == codprod){
            var ressub = 0, restot = 0;
            ressub = Number(itemtotal[i].cantidad) * Number(itemtotal[i].preciosel);
            rescosto = Number(itemtotal[i].cantidad) * Number(itemtotal[i].costo);
            valpeso = Number(itemtotal[i].cantidad) * Number(itemtotal[i].peso);
            gngastosv = rescosto/ressub;
            restot = (ressub - ((ressub * itemtotal[i].descuento)/100));
            temp.push({codprod: itemtotal[i].codprod, descripcion: itemtotal[i].descripcion, cantidad: itemtotal[i].cantidad, precio: itemtotal[i].precio, pvp: itemtotal[i].pvp, subdist: itemtotal[i].subdist, contado: itemtotal[i].contado, preciosel: itemtotal[i].preciosel, editable: itemtotal[i].editable, costo: itemtotal[i].costo, descuento: itemtotal[i].descuento, subtotal: ressub, total: restot, peso: itemtotal[i].peso, gngastos:gngastosv});

            varsubtotal = varsubtotal + ressub;
            varsubtotalcosto = varsubtotalcosto + rescosto;
            resdes = resdes + Number(ressub * itemtotal[i].descuento)/100;
            totpeso= totpeso + valpeso;
            porcpor = porcpor + Number(itemtotal[i].descuento);

            itemtext = itemtext + "<detalle d0=\""+numcod+"\" d1=\""+itemtotal[i].codprod+"\" d2=\""+itemtotal[i].cantidad+"\" d3=\""+itemtotal[i].preciosel+"\" d4=\""+itemtotal[i].descripcion+"\" d5=\""+itemtotal[i].peso+"\" d6=\""+itemtotal[i].descuento+"\" d7=\""+0+"\"></detalle>"; 
            cadenita1 = cadenita1 + "*"+numcod+";"+itemtotal[i].codprod+";"+itemtotal[i].descripcion+";"+itemtotal[i].cantidad+";"+itemtotal[i].preciosel+";"+itemtotal[i].descuento+";"+itemtotal[i].total;

        }else{
            temp.push({codprod: itemtotal[i].codprod, descripcion: itemtotal[i].descripcion, cantidad: itemtotal[i].cantidad, precio: itemtotal[i].precio, pvp: itemtotal[i].pvp, subdist: itemtotal[i].subdist, contado: itemtotal[i].contado, preciosel: itemtotal[i].preciosel, editable: itemtotal[i].editable, costo: itemtotal[i].costo, descuento: itemtotal[i].descuento, subtotal: itemtotal[i].subtotal, total: itemtotal[i].total, peso: itemtotal[i].peso, gngastos: itemtotal[i].gngastos});
            valpeso = Number(itemtotal[i].cantidad) *  Number(itemtotal[i].peso);
            rescosto = Number(itemtotal[i].cantidad) *  Number(itemtotal[i].costo);
            varsubtotal = varsubtotal + itemtotal[i].subtotal;
            varsubtotalcosto = varsubtotalcosto + rescosto;
            resdes = resdes +  Number(itemtotal[i].subtotal * itemtotal[i].descuento)/100;
            porcpor = porcpor + Number(itemtotal[i].descuento);
            totpeso = totpeso + valpeso;



            itemtext = itemtext + "<detalle d0=\""+numcod+"\" d1=\""+itemtotal[i].codprod+"\" d2=\""+itemtotal[i].cantidad+"\" d3=\""+itemtotal[i].preciosel+"\" d4=\""+itemtotal[i].descripcion+"\" d5=\""+itemtotal[i].peso+"\" d6=\""+itemtotal[i].descuento+"\" d7=\""+0+"\"></detalle>"; 
            cadenita1 = cadenita1 + "*"+numcod+";"+itemtotal[i].codprod+";"+itemtotal[i].descripcion+";"+itemtotal[i].cantidad+";"+itemtotal[i].preciosel+";"+itemtotal[i].descuento+";"+itemtotal[i].total;
        }
    }

    setItemTotal(temp);
    setCadenaint(itemtext);
     setCadenita(cadenita1);

     setSubtotal(varsubtotal);
    
     setKilos(totpeso);
     

     cargarTarifas(tcodigo, ttrans);



     if(checked == 'second'){
        vardesc = (varsubtotal * porcent)/100;
     }else{
        vardesc = resdes;
        porcpor = (vardesc/varsubtotal)*100;
        setPorcent(porcpor);
     }
     setDescuento(vardesc);

     console.log("valor del peso: "+totpeso);
     console.log("vpeso: "+ vpeso.pl_peso);

     if(ttrans != 12 && ttrans != 90 && ttrans != 215){
        setTransporte(Number(vtrans));
        vartransp = Number(vtrans);
     }else{
        if(vpeso.pl_peso != 0){
            if(totpeso < vpeso.pl_peso){
                vartransp =  Number(vpeso.pl_tarifa1);
                setTarifa(vpeso.pl_tarifa1);
                console.log("valor de tarifa 1: "+ vpeso.pl_tarifa1);
                setTransporte(vartransp);
                
            }else{
                vartransp = (totpeso * vpeso.pl_tarifa2);
                console.log("valor de tarifa 2: "+ vpeso.pl_tarifa2);
                setTarifa(vpeso.pl_tarifa2);
                setTransporte(vartransp);
            }
    } 
    }

    /*validación de seguro*/


    varseguro = ((varsubtotal-vardesc) * vseguro)/100;
    setSeguro(varseguro);


    variva = (varsubtotal-vardesc+varseguro) * 0.12;
     setIva(variva);
     
     
     vartotal = (varsubtotal - vardesc) + varseguro + vartransp + variva;
     setTotal(vartotal);

     console.log("valor del total: "+vartotal);

     console.log("res. subtotal: "+Number(varsubtotal));
     console.log("resultado var orden: "+(Number(vartotal) - Number(vardesc) - Number(varsubtotalcosto)).toFixed(2));
     varorden = (Number(varsubtotal) - Number(vardesc) - Number(varsubtotalcosto));
     varventas = ((gnorden/(Number(varsubtotal)-Number(vardesc)))*100);
     vargastos = ((Number(varsubtotal)-Number(vardesc))/Number(varsubtotalcosto));

     setGnOrden(varorden);
     setGnVentas(varventas);
     setGnGastos(vargastos);
}

const EditarResultados = ( codprod, cant, desc, precio, pvp, subdist, contado, preciosel, editable, costo, peso, descripcion) =>{
    var temp = [];
    var varsubtotal = 0;
    var varseguro = 0;
    var vartransp = 0;
    var variva = 0;
    var vartotal = 0;
    var vardesc = 0;
    var varorden = 0, varventas = 0, vargastos = 0;
    var resdes = 0;
    var valpeso = 0;
    var totpeso = 0;
    var valtarifa = 0;
    var numcod = 0;
    var porcpor = 0;
    var cadenita1 = "";
    var rescosto = 0;
    var varsubtotalcosto = 0;
    itemtext = "";
    var gngastosv = 0;

    for (let i = 0; i < itemtotal.length; i++) {
        numcod++;
        if(itemtotal[i].codprod == codprod){
            var ressub = 0, restot = 0;
            ressub = Number(cant) * Number(preciosel);
            rescosto = Number(cant) * Number(costo);
            valpeso = Number(cant) * Number(peso);
            gngastosv = rescosto/ressub;
            restot = (ressub - ((ressub * desc)/100));
            
            temp.push({codprod: codprod, descripcion: descripcion, cantidad: cant, precio: precio, pvp: pvp, subdist: subdist, contado:contado, preciosel: preciosel, editable: editable, costo:costo, descuento: desc, subtotal: ressub, total: restot, peso: peso, gngastos: gngastosv});
            
            varsubtotal = varsubtotal + ressub;
            varsubtotalcosto = varsubtotalcosto + rescosto;
            resdes = resdes + Number(ressub * desc)/100;
            totpeso= totpeso + valpeso;
            porcpor = porcpor + Number(desc);

            itemtext = itemtext + "<detalle d0=\""+numcod+"\" d1=\""+codprod+"\" d2=\""+cant+"\" d3=\""+precio+"\" d4=\""+descripcion+"\" d5=\""+peso+"\" d6=\""+desc+"\" d7=\""+0+"\"></detalle>"; 
            cadenita1 = cadenita1 + "*"+numcod+";"+codprod+";"+descripcion+";"+cant+";"+precio+";"+desc+";"+restot;
        }else{
           
            temp.push({codprod: itemtotal[i].codprod, descripcion: itemtotal[i].descripcion, cantidad: itemtotal[i].cantidad, precio: itemtotal[i].precio, pvp: itemtotal[i].pvp, subdist: itemtotal[i].subdist, contado: itemtotal[i].contado, preciosel: itemtotal[i].preciosel, editable: itemtotal[i].editable, costo: itemtotal[i].costo, descuento: itemtotal[i].descuento, subtotal: itemtotal[i].subtotal, total: itemtotal[i].total, peso: itemtotal[i].peso, gngastos: itemtotal[i].gngastos});

            valpeso = Number(itemtotal[i].cantidad) *  Number(itemtotal[i].peso);
            rescosto = Number(itemtotal[i].cantidad) *  Number(itemtotal[i].costo);
            varsubtotal = varsubtotal + itemtotal[i].subtotal;
            varsubtotalcosto = varsubtotalcosto + rescosto;
            resdes = resdes +  Number(itemtotal[i].subtotal * itemtotal[i].descuento)/100;
            porcpor = porcpor + Number(itemtotal[i].descuento);
            totpeso = totpeso + valpeso;



            itemtext = itemtext + "<detalle d0=\""+numcod+"\" d1=\""+itemtotal[i].codprod+"\" d2=\""+itemtotal[i].cantidad+"\" d3=\""+itemtotal[i].preciosel+"\" d4=\""+itemtotal[i].descripcion+"\" d5=\""+itemtotal[i].peso+"\" d6=\""+itemtotal[i].descuento+"\" d7=\""+0+"\"></detalle>"; 
            cadenita1 = cadenita1 + "*"+numcod+";"+itemtotal[i].codprod+";"+itemtotal[i].descripcion+";"+itemtotal[i].cantidad+";"+itemtotal[i].preciosel+";"+itemtotal[i].descuento+";"+itemtotal[i].total;
        }

        console.log("Val del peso: "+ valpeso);
        
     }

     setCadenaint(itemtext);
     setCadenita(cadenita1);

     
     setItemTotal(temp);
     setSubtotal(varsubtotal);
    
     setKilos(totpeso);

     cargarTarifas(tcodigo, ttrans);



     if(checked == 'second'){
        vardesc = (varsubtotal * porcent)/100;
     }else{
        vardesc = resdes;
        porcpor = (vardesc/varsubtotal)*100;
        setPorcent(porcpor);
     }
     setDescuento(vardesc);

     console.log("valor del peso: "+totpeso);
     console.log("vpeso: "+ vpeso.pl_peso);


     if(ttrans != 12 && ttrans != 90 && ttrans != 215){
        if(vtrans != ""){
            setTransporte(Number(vtrans));
            vartransp = Number(vtrans);
        }else{
            setTransporte(0);
            vartransp = 0;
        }
        

    } else{
        
        if(vpeso.pl_peso != null || totpeso != null){
            console.log("entro con el valor TARIFAS1:"+vpeso.pl_peso+" EL TOTAL PESO: "+totpeso);
            if(vpeso.pl_peso != 0){
                if(totpeso < vpeso.pl_peso){
                    vartransp =  Number(vpeso.pl_tarifa1);
                    console.log("valor de tarifa 1: "+ vpeso.pl_tarifa1);
                    setTarifa(vpeso.pl_tarifa1);
                    setTransporte(vartransp);
                    
                }else{
                    vartransp = (totpeso * vpeso.pl_tarifa2);
                    console.log("valor de tarifa 2: "+ vpeso.pl_tarifa2);
                    setTarifa(vpeso.pl_tarifa2);
                    setTransporte(vartransp);
                }
        }
        }
        
    }

    /*validación de seguro*/


    varseguro = ((varsubtotal-vardesc) * vseguro)/100;
    setSeguro(varseguro);


    variva = (varsubtotal-vardesc+varseguro) * 0.12;
     setIva(variva);
     
     
     vartotal = (varsubtotal - vardesc) + varseguro + vartransp + variva;
     setTotal(vartotal);

     console.log("valor del total: "+vartotal);

     console.log("res. subtotal: "+Number(varsubtotal));
     console.log("resultado var orden: "+(Number(vartotal) - Number(vardesc) - Number(varsubtotalcosto)).toFixed(2));
     varorden = (Number(varsubtotal) - Number(vardesc) - Number(varsubtotalcosto));
     varventas = ((gnorden/(Number(varsubtotal)-Number(vardesc)))*100);
     vargastos = ((Number(varsubtotal)-Number(vardesc))/Number(varsubtotalcosto));

     setGnOrden(varorden);
     setGnVentas(varventas);
     setGnGastos(vargastos);
 
 }

  const cargarPlazo = async () => {
    try {
     
      const response = await fetch(
        "https://app.cotzul.com/Pedidos/pd_getPlazo.php?notidplazo="+notidplazo
      );
      const jsonResponse = await response.json();
      console.log("REGISTRANDO PLAZO");
      console.log(jsonResponse?.plazo);
      registrarPlazo(jsonResponse?.plazo);
    } catch (error) {
      console.log("un error cachado listar pedidos");
      console.log(error);
    }
};


const cargarTransporte = async () => {
    try {
     
      const response = await fetch(
        "https://app.cotzul.com/Pedidos/pd_getTransporte.php"
      );
      const jsonResponse = await response.json();
      console.log("REGISTRANDO TRANSPORTE");
      console.log(jsonResponse?.transporte);
      registrarTransporte(jsonResponse?.transporte);
    } catch (error) {
      console.log("un error cachado listar transporte");
      console.log(error);
    }
};

const cargarVendedores = async () => {
    try {
     
      const response = await fetch(
        "https://app.cotzul.com/Pedidos/getVendedoresList.php"
      );
      const jsonResponse = await response.json();
      console.log(jsonResponse?.vendedores);
      registrarVendedores(jsonResponse?.vendedores);
    } catch (error) {
      console.log("un error cachado listar vendedores");
      console.log(error);
    }
};


const cargarTarifas = async (ttcodigo, idtransporte) =>{
    try{

        console.log("Entro en tarifas: "+ ttcodigo+ "- "+ttrans);
        if((ubicacion == 1 || ubicacion == 4 || ubicacion == 24) && idtransporte == 6){
            setVseguro(0);
        }else if(ubicacion == 1 && idtransporte == 12){
            setVseguro(0);
        }else if(idtransporte == 0 || idtransporte == 62 || idtransporte == 215){
            setVseguro(0);
        }else{
            setVseguro(1.20);
        }


        if(ttcodigo != 0 && ttrans != 0){
            const response = await fetch(
                "https://app.cotzul.com/Pedidos/pd_getTarifa.php?ttcodigo="+ttcodigo+"&tarifa="+idtransporte
              );

            console.log( "https://app.cotzul.com/Pedidos/pd_getTarifa.php?ttcodigo="+ttcodigo+"&tarifa="+idtransporte);
            const jsonResponse = await response.json();
            console.log("REGISTRANDO TARIFAS TRANSPORTE");
            console.log("Valor del peso: "+jsonResponse?.tarifa[0].pl_peso);
            setVpeso(jsonResponse?.tarifa[0]);
            setCobertura(jsonResponse?.tarifa[0].pl_descrip);
            console.log("valor de ubicacion: "+jsonResponse?.tarifa[0].pl_descrip);
            

        }


       
    }catch(error){
        console.log("un error cachado listar transporte");
        console.log(error);
    }

}



useEffect(()=>{
    cargarTransporte()
    cargarVendedores()
},[]);

useEffect(()=>{
    cargarTarifas(tcodigo, ttrans);
    CargarResultados();
},[ttrans]);



useEffect(()=>{
    setDescuento(0);
},[checked]);


const GrabarBorrador = async () =>{
    try {
    
      var textofinal = "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?><c c0=\"2\" c1=\"1\" c2=\""+numdoc+"\" c3=\""+dataUser.vn_codigo+"\" c4=\""+ttrans+"\" c5=\""+cliente.ct_codigo+"\" c6=\""+doc+"\" c7=\""+tplazo+"\" c8=\""+obs+"\" c9=\""+subtotal.toFixed(2)+"\" c10=\""+Number(porcent).toFixed(2)+"\" c11=\""+descuento.toFixed(2)+"\" c12=\""+seguro.toFixed(2)+"\" c13=\""+transporte.toFixed(2)+"\" c14=\""+iva.toFixed(2)+"\" c15=\""+total.toFixed(2)+"\" c16=\""+0+"\" c17=\""+0+"\" c18=\"pduran\" >"+cadenaint+"</c>";
      console.log("https://app.cotzul.com/Pedidos/grabarBorrador.php?numpedido="+numdoc+"&idvendedor="+dataUser.vn_codigo+"&usuvendedor="+dataUser.vn_usuario+"&fecha="+fechaped+"&empresa=COTZUL-BODEGA&prioridad=NORMAL&observaciones="+obs+"&idcliente="+cliente.ct_codigo+"&tipodoc="+doc+"&tipodesc="+((checked=='second')?1:0)+"&porcdesc="+porcent+"&valordesc="+descuento+"&ttrans="+ttrans+"&gnorden="+gnorden+"&gnventas="+gnventas+"&gngastos="+gngastos+"&subtotal="+subtotal+"&descuento="+descuento+"&transporte="+transporte+"&seguro="+seguro+"&iva="+iva+"&total="+total+"&idnewvendedor="+idnewvendedor+"&cadenaxml="+textofinal+"&cadena="+cadenita);
      const response = await fetch("https://app.cotzul.com/Pedidos/grabarBorrador.php?numpedido="+numdoc+"&idvendedor="+dataUser.vn_codigo+"&usuvendedor="+dataUser.vn_usuario+"&fecha="+fechaped+"&empresa=COTZUL-BODEGA&prioridad=NORMAL&observaciones="+obs+"&idcliente="+cliente.ct_codigo+"&tipodoc="+doc+"&tipodesc="+((checked=='second')?1:0)+"&porcdesc="+porcent+"&valordesc="+descuento+"&ttrans="+ttrans+"&gnorden="+gnorden+"&gnventas="+gnventas+"&gngastos="+gngastos+"&subtotal="+subtotal+"&descuento="+descuento+"&transporte="+transporte+"&seguro="+seguro+"&iva="+iva+"&total="+total+"&idnewvendedor="+idnewvendedor+"&cadenaxml="+textofinal+"&cadena="+cadenita);

      const jsonResponse = await response.json();
      console.log(jsonResponse.estatusped);
      if(jsonResponse.estatusped == 'REGISTRADO'){
        console.log("Se registro con éxito");
        navigation.navigate("productos");
        regresarFunc();
      }
    
      
    } catch (error) {
      console.log(error);
    } 
};


const GrabarPedido = async () =>{
    try {
      if(cadenaint != "" && numdoc != 0 && ttrans != 0 && cliente.ct_codigo != 0 && doc != 0 && tplazo != 0 && itemtotal.length > 0){
      //var textofinal = "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?><c c0=\"2\" c1=\"1\" c2=\""+numdoc+"\" c3=\""+dataUser.vn_codigo+"\" c4=\""+ttrans+"\" c5=\""+cliente.ct_codigo+"\" c6=\""+doc+"\" c7=\""+tplazo+"\" c8=\""+obs+"\" c9=\""+subtotal+"\" c10=\""+porcent+"\" c11=\""+descuento+"\" c12=\""+seguro+"\" c13=\""+transporte+"\" c14=\""+iva+"\" c15=\""+total+"\" c16=\""+0+"\" c17=\""+0+"\" c18=\""+dataUser.vn_usuario+"\" >"+cadenaint+"</c>";
      var textofinal = "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?><c c0=\"2\" c1=\"1\" c2=\""+numdoc+"\" c3=\""+dataUser.vn_codigo+"\" c4=\""+ttrans+"\" c5=\""+cliente.ct_codigo+"\" c6=\""+doc+"\" c7=\""+tplazo+"\" c8=\""+obs+"\" c9=\""+subtotal.toFixed(2)+"\" c10=\""+Number(porcent).toFixed(2)+"\" c11=\""+descuento.toFixed(2)+"\" c12=\""+seguro.toFixed(2)+"\" c13=\""+transporte.toFixed(2)+"\" c14=\""+iva.toFixed(2)+"\" c15=\""+total.toFixed(2)+"\" c16=\""+0+"\" c17=\""+0+"\" c18=\"pduran\" >"+cadenaint+"</c>";
      console.log("https://app.cotzul.com/Pedidos/setPedidoVendedor.php?numpedido="+numdoc+"&idvendedor="+dataUser.vn_codigo+"&usuvendedor="+dataUser.vn_usuario+"&fecha="+fechaped+"&empresa=COTZUL-BODEGA&prioridad=NORMAL&observaciones="+obs+"&idcliente="+cliente.ct_codigo+"&tipodoc="+doc+"&tipodesc="+((checked=='second')?1:0)+"&porcdesc="+porcent+"&valordesc="+descuento+"&ttrans="+ttrans+"&gnorden="+gnorden+"&gnventas="+gnventas+"&gngastos="+gngastos+"&subtotal="+subtotal+"&descuento="+descuento+"&transporte="+transporte+"&seguro="+seguro+"&iva="+iva+"&total="+total+"&idnewvendedor="+idnewvendedor+"&cadenaxml="+textofinal+"&cadena="+cadenita);
      const response = await fetch("https://app.cotzul.com/Pedidos/setPedidoVendedor.php?numpedido="+numdoc+"&idvendedor="+dataUser.vn_codigo+"&usuvendedor="+dataUser.vn_usuario+"&fecha="+fechaped+"&empresa=COTZUL-BODEGA&prioridad=NORMAL&observaciones="+obs+"&idcliente="+cliente.ct_codigo+"&tipodoc="+doc+"&tipodesc="+((checked=='second')?1:0)+"&porcdesc="+porcent+"&valordesc="+descuento+"&ttrans="+ttrans+"&gnorden="+gnorden+"&gnventas="+gnventas+"&gngastos="+gngastos+"&subtotal="+subtotal+"&descuento="+descuento+"&transporte="+transporte+"&seguro="+seguro+"&iva="+iva+"&total="+total+"&idnewvendedor="+idnewvendedor+"&cadenaxml="+textofinal+"&cadena="+cadenita);

      const jsonResponse = await response.json();
      console.log(jsonResponse.estatusped);
      if(jsonResponse.estatusped == 'REGISTRADO'){
        console.log("Se registro con éxito");
        navigation.navigate("productos");
        regresarFunc();
      }
    }else{
        Alert.alert("Registre todos los campos para Enviar Pedido");
    }
      
    } catch (error) {
      console.log(error);
    } 
};






  

 return(
    <ScrollView style={styles.container}>
        <View style={styles.titlesWrapper}>
            <Text style={styles.titlesSubtitle}>Cotzul S.A.</Text>
            <Text style={styles.titlespick2}>Usuario: {dataUser.vn_nombre}</Text>
            <Text style={{fontWeight:'bold'}}></Text>
            
            {(dataUser.vn_codigo== -1)?(<><View style={styles.itemrow2}><Text style={styles.tittext}>Selecciona Vendedor distinto:</Text>
                    <View style={styles.itemrow2}><RNPickerSelect
                        useNativeAndroidPickerStyle={false}
                        style={pickerStyle}
                        onValueChange={(tvendedor) => actualizaVendedor(tvendedor)}
                        placeholder={{ label: "SELECCIONAR", value: 0 }}
                        items={vvendedor}

                    /></View></View></>):(<></>)}
                    
            <Text style={{fontWeight:'bold'}}>Datos del Pedido:</Text>
        </View>
       
            <View style={styles.detallebody}> 
                
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>N# Pedido:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Fecha:</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text>{valrecibo}</Text></View>
                    <View style={styles.itemrow}><Text>{fechaped}</Text></View>
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
                placeholder={{ label: "COTZUL-BODEGA", value: 1}}
                items={[
                    
                ]}
            /></View>
                    <View style={styles.itemrow}><RNPickerSelect
                useNativeAndroidPickerStyle={false}
                style={pickerStyle}
                onValueChange={(prioridad) => setPrioridad(prioridad)}
                placeholder={{ label: "NORMAL", value: 1}}
                items={[
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
                        style={styles.input1}
                        onChangeText={(value) => setObs(value)}
                    />
                </View>
              </View>

              <View style={styles.titlesWrapper}>
              <Text style={{fontWeight:'bold'}}>Datos del Cliente:</Text>
                </View>
              <View style={styles.detallebody}> 
              
              <ModalClientes inicializaCliente={inicializaCliente} actualizaCliente={actualizaCliente} idvendedor={dataUser.vn_codigo}></ModalClientes>
              
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Cliente:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Ciudad:</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text>{cliente.ct_cliente}</Text></View>
                    <View style={styles.itemrow}><Text>{cliente.ct_ciudad}</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Cupo Asignado:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Cupo Disponible:</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text>{Number(cliente.ct_cupoasignado).toFixed(2)}</Text></View>
                    <View style={styles.itemrow}><Text>{Number(cliente.ct_cupodisponible).toFixed(2)}</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Política de Pago:</Text></View>
                    <View style={styles.itemrow}><Text>{cliente.ct_plazo}</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Forma de Pago:</Text></View>
                    <View style={styles.itemrow}><RNPickerSelect
                useNativeAndroidPickerStyle={false}
                style={pickerStyle}
                onValueChange={(doc) => setDoc(doc)}
                placeholder={{ label: "SELECCIONAR", value: 0 }}
                items={[
                    { label: "CHEQUE A FECHA", value: 1},
                    { label: "FACT. A CRÉDITO", value: 2},
                ]}
            /></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Selecciona Plazo:</Text></View>
                    <View style={styles.itemrow}>{(notidplazo==0)?(<Text style={styles.tittext}>---</Text>):(<RNPickerSelect
                        useNativeAndroidPickerStyle={false}
                        style={pickerStyle}
                        items={plazo}
                        onValueChange={(tplazo) => setTPlazo(tplazo)}
                        placeholder={{ label: notnomplazo, value: notidplazo }}
                    />)}</View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Selecciona Transporte:</Text></View>
                    <View style={styles.itemrow}><RNPickerSelect
                        useNativeAndroidPickerStyle={false}
                        style={pickerStyle}
                        onValueChange={(ttrans) => setTtrans(ttrans)}
                        placeholder={{ label: "SELECCIONAR", value: 0 }}
                        items={transp}

                    /></View>
                </View>
                <View style={styles.row}>
                    
            <View style={styles.itemrow}><Text style={styles.tittext}>Tipo de Descuento:</Text><Text>Item:</Text><RadioButton
        value="first"
        status={ checked === 'first' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('first')}
      />
      <Text>Porcentaje:</Text>
      <RadioButton
        value="second"
        status={ checked === 'second' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('second')}
      /></View><View style={styles.itemrow}><Text style={styles.tittext}>Valor del Descuento:</Text>{(checked == 'second')?(<TextInput
        placeholder="%"
        onChangeText={setPorcent}
        value={porcent}
        style={styles.input}
        onEndEditing={()=>CargarResultados()}
    />):(<Text>Registrar por Item</Text>)}
      </View>
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
            
            <ScrollView horizontal>
            <View style={{ marginTop:10, height: 120, marginHorizontal: 10}}>
                <View style={{flexDirection: 'row'}}>
                
                    
                    <View style={{width: 120, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Referencia</Text>
                    </View>
                    <View style={{width:70, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Stock</Text>
                    </View>
                    <View style={{width:70, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>SKU</Text>
                    </View>
                    <View style={{width:100, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Marca</Text>
                    </View>
                    <View style={{width:70, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Cantidad</Text>
                    </View>
                    <View style={{width:150, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>T. Precio</Text>
                    </View>
                    <View style={{width:70, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Precio</Text>
                    </View>
                    <View style={{width:70, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Subtotal</Text>
                    </View>
                    <View style={{width:70, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>% Desc.</Text>
                    </View>
                    <View style={{width:70, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Total</Text>
                    </View>
                    <View style={{width:70, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Lote</Text>
                    </View>
                   
                    <View style={{width:70, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
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
            </ScrollView>
                </View>

                <View style={styles.row}>
                <View style={styles.titlesWrapper}>
                     <Text style={{fontWeight:'bold'}}>Pesos:                                </Text>
                </View>
                <View style={styles.titlesWrapper}>
                     <Text style={{fontWeight:'bold'}}>Total Pedido:</Text>
                </View>
                </View>
                <View style={styles.row}>
                <View style={styles.detallebody1}> 
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Kilo:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.itemtext}>{kilos.toFixed(2)} kg.</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Tarifa.:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.itemtext}>{tarifa}</Text></View>
                </View>  
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Cobert.:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.itemtext}>{cobertura}</Text></View>
                </View>
                <View style={styles.row}>

                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow4}><Text style={styles.tittext}>Lote:</Text></View>
                </View>
                <View style={styles.row}>
                <View style={styles.itemrow4}><Text style={styles.itemtext}>{(Number(gngastos).toFixed(2)!='  ')?(Number(gngastos).toFixed(2)):0}</Text></View>
                </View>
                
                </View>

                <View style={styles.detallebody1}> 

                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Subtotal:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.itemtext}>${subtotal.toFixed(2)}</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Desc.(-):</Text></View>
                    <View style={styles.itemrow}><Text style={styles.itemtext}>${descuento.toFixed(2)}</Text></View>
                </View>  
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Seguro(+):</Text></View>
                    <View style={styles.itemrow}><Text style={styles.itemtext}>${seguro.toFixed(2)}</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>IVA(+):</Text></View>
                    <View style={styles.itemrow}><Text style={styles.itemtext}>${iva.toFixed(2)}</Text></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Flete(+):</Text></View>
                    <View style={styles.itemrow}>{(ttrans != 12 && ttrans != 90 && ttrans != 215)?(<><TextInput
                            keyboardType='numeric'
                            placeholder='0,0'
                            onFocus={""}
                            style={styles.itemtext}
                            onChangeText={(val)=> setVTrans(val)}
                            onEndEditing={()=>CargarResultados()}
                            /></>):(<Text style={styles.itemtext}>${transporte.toFixed(2)}</Text>)}
                            </View>
                    
                </View>
                <View style={styles.row}>
                    <View style={styles.itemrow}><Text style={styles.tittext}>Total:</Text></View>
                    <View style={styles.itemrow}><Text style={styles.itemtext}>${total.toFixed(2)}</Text></View>
                </View>
                </View>
                </View>

                <View style={{alignItems:'center', marginVertical:20}}>
                <Button
                    title="Grabar Borrador"
                    containerStyle={styles.btnContainerLogin}
                    buttonStyle = {styles.btnLogin}
                    onPress= {() => GrabarBorrador()}
                />
                <Button
                    title="Enviar Pedido"
                    containerStyle={styles.btnContainerLogin}
                    buttonStyle = {styles.btnLogin}
                    onPress= {() => GrabarPedido()}
                />
            </View>
                
               
    </ScrollView>
  )
}


const pickerStyle2 = {
    inputIOS: {
        color: 'white',
        paddingHorizontal: 10,
        marginHorizontal: 10,
        marginTop: 5,
        backgroundColor: "#6f4993",
        borderRadius: 5,
        height: 20, 
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

const pickerStyle = {
    inputIOS: {
        color: 'white',
        paddingHorizontal: 20,
        marginTop: 5,
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
},input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    paddingHorizontal: 50
  }, tabletitle:{
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 12,
}, tabletext:{
    textAlign: 'center', 
    fontSize: 12,
    paddingLeft:5
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
    padding:3, 
},itemrow3:{
    width: '100%',
    alignItems: 'center',
    borderWidth: 0.5,
    paddingVertical:75
},
itemrow4:{
    width: '100%',
    alignItems: 'center',
    borderWidth: 0.5,
    padding:3, 
    height: 43
},
itemobserv:{
    width: '100%',
    paddingHorizontal:20
},
tittext:{
    fontWeight: 'bold',
    fontSize: 14,
    marginTop:5,
    alignItems: 'center'
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

    width: '45%',
    marginHorizontal: 10,
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