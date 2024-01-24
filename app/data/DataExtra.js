import React, {useState, useEffect, useCallback, useMemo} from 'react'
import { Image, FlatList, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView, Linking} from 'react-native';
import axios from 'axios'
import { colors, Icon } from "react-native-elements";
import * as SQLite from 'expo-sqlite';
import {useNavigation} from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from "@react-native-community/netinfo";
import ModalDetalle from '../screens/ModalDetalle';


const STORAGE_KEY = '@save_productos'
const database_name = "CotzulBD10.db";
const database_version = "1.0";
const database_displayname = "CotzulBDS";
const database_size = 200000;


export default function  DataExtra(props) {
   
    const [imageFirebase, setImage] = useState("")
    const [isLoading, setLoading] = useState(false)
    const navigation = useNavigation();
    const {texto, familia, tproducto} = props;

    const [actdata, setACTData] = useState(1);
    const [posts, setPosts] = useState([])
    const [internet, setInternet] = useState(true);
    const [cont, setCont] = useState(0);

    const [sqla, setSql] = useState("SELECT * FROM items WHERE it_referencia LIKE ?");

   

    const abrirtablaProducto = async() => {
        getDataProd();
        console.log(sqla)
    }


    getDataProd = async () => {
        console.log("esta ingresando")
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
   
        db.transaction((tx) => {
            tx.executeSql(
            sqla,
            [`${texto}%`],
            (tx, results) => {
                    var temp = [];
                    console.log(results)
                    if( results.rows.length > 0){
                      for (let i = 0; i < results.rows.length; ++i)
                      temp.push(results.rows.item(i));
                      setPosts(temp);
                      console.log("entro ")
                    }else{
                      const sqlb = 'SELECT * FROM items WHERE it_marca LIKE ?';
            
                      tx.executeSql(
                        sqlb,
                        [`${texto}%`],
                        (tx, results) => {
                          for (let i = 0; i < results.rows.length; ++i)
                          temp.push(results.rows.item(i));
                          setPosts(temp);
                          console.log("entro ")
                        });
                    }
                    
            }
            );
    
        });
    };


useEffect(() => {
    var temp = [];
    setPosts(temp);
    console.log("se modifico el sql")
    abrirtablaProducto();
    setACTData(2);     
}, [cont]);





useEffect(() => {

    setSql("SELECT * FROM items WHERE it_referencia LIKE ?")
    setCont(cont+1)
}, [texto]);

      
   useCallback(() => {
        NetInfo.fetch().then(state => {
            console.log("Connection type DataExtra", state.type);
            console.log("Is connected?", state.isConnected);
            setInternet(state.isConnected)
        });
    },[]);


   


    return (
           
        <View>
            {((posts.length <= 0) || (texto.length == 0)) ? (
                <NoFoundProducts />
            ) : (<ScrollView horizontal>
        <View style={{ marginHorizontal: 20, marginTop: 10, height: 500 }}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: 100,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>Ref.</Text>
            </View>

            <View
              style={{
                width: 60,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>Detalle</Text>
            </View>
            
            <View
              style={{
                width: 80,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>Marca</Text>
            </View>

            <View
              style={{
                width: 80,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>Precio</Text>
            </View>
            <View
              style={{
                width: 50,
                backgroundColor: "#9c9c9c",
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={styles.tabletitle}>Stock</Text>
            </View>

            
            
          </View>
          <FlatList
                data = {posts}
                keyExtractor={( id , index) => index.toString()}
                renderItem={({ item }) => (<ListProducto producto={item} navigation={navigation} internet={internet} 
                /> )} 
                ListFooterComponent={() => <View style={{flex:1,justifyContent: "center",alignItems: "center"}}><Text style={styles.finalproducto}>--- Fin de busqueda ---</Text></View>}
                />
        </View>
      </ScrollView>)}
        </View>
        
    
)
   
};


function NoFoundProducts(){
    return(<View style={{flex: 1, alignItems: 'center', }}>
    <Image
        source={require("../../assets/img/no-result-found.png")}
        resizeMode = "cover"
        style={{width: 200, height: 200}}
    />
</View>); 
}




function ListProducto(props){
    const {producto, navigation, internet} = props;
    const {it_codigo,it_codprod, it_referencia, it_descripcion, it_pvp, it_rutaimg, it_stock, it_arrayimg, it_marca} = producto;
    const [actual, setActual] = useState(0); 
    const [presiono, setPresiono] = useState(0); 

    async function openUrl(url){
        const isSupported = await Linking.canOpenURL(url);
            if(isSupported){
                await Linking.openURL(url)
            }else{
                Alert.alert('No se encontro el Link');
            }
    }

    const goProducto = () =>{
        if(presiono == 0){
            setPresiono(1)
            setActual(pr_codigo)
        }else if(presiono == 1 && actual == pr_codigo && internet){
            setPresiono(2)
            navigation.navigate("producto",{pr_codigo, pr_codprod, pr_referencia,}); 
        }else{
            setPresiono(1)
            setActual(pr_codigo)
        }
        
     }
     

    return (<View>
        <View
          style={{
            flexDirection: "row",
            marginRight: 15,
          }}
        >
          <View
            style={{
              width: 100,
              height: 50,
              borderColor: "black",
              borderWidth: 1,
            }}
          >
            <Text style={styles.tabletext1} onPress={() =>openUrl("https://app.cotzul.com/Catalogo/Presentacion/prod/producto.php?id="+it_codigo)}>{it_referencia}</Text>
          </View>
          <View
            style={{
              width: 60,
              height: 50,
              borderColor: "black",
              borderWidth: 1,
            }}
          >
              <ModalDetalle codigo={it_codigo}></ModalDetalle>
            
          </View>

          <View
            style={{
              width: 80,
              height: 50,
              borderColor: "black",
              borderWidth: 1,
            }}
          >
            <Text style={styles.tabletext}>{it_marca}</Text>
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
             $ {it_pvp} 
            </Text>
          </View>
          <View
            style={{
              width: 50,
              height: 50,
              borderColor: "black",
              borderWidth: 1,
            }}
          >
            <Text style={styles.tableval}>
              {it_stock} 
            </Text>
          </View>
          
        </View>
      </View>);
}




const styles = StyleSheet.create({
    productoCardWrapper:{
        backgroundColor: '#CDCDCD',
        borderRadius:25,
        paddingTop: 10,
        paddingLeft: 10,
        paddingBottom: 0,
        marginLeft:10,
        marginRight:10,
        marginTop:10,
        height: 120,
        flexDirection: 'row',
    },  
    productoTexto:{
        flexDirection: 'column',
        width: 170,
    },
    productoPrecio:{
        flexDirection: 'column',
        width: 70,
        height:100,
        paddingRight:10,
    },
    textoPrecio:{
        textAlign:'left',
        paddingTop:80,
        color:'#9462c1',
        fontSize: 12,
    },
    productoReferencia:{
        color:'#9462c1',
        paddingLeft: 10,
        fontSize: 15,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    productoCodigo:{
        color:'#000',
        paddingTop:2,
        paddingLeft: 10,
        fontSize: 12,
    },
    productoImage:{
        paddingTop: 0,
        paddingBottom: 10,
    },
    productoConf:{
        paddingTop:2,
        paddingLeft: 10,
        fontSize: 10,
        color: 'grey'
    },
    finalproducto:{
        color:'#9462c1',
        fontSize: 15,
        height: 250,
        marginTop: 10,
    },
    iconRight:{
        marginTop: 10,
        marginLeft: 20,
      },
    tabletitle: {
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center"
      },tabletext: {
        fontSize: 12,
        paddingLeft:5
      },
      tableval: {
        fontSize: 12,
        paddingRight: 5,
        textAlign: "right",
      },
      tabletext1: {
        textAlign: "center",
        fontSize: 13,
        paddingLeft: 5,
        color: 'blue'
      },
      
});


