import React, {useState, useEffect} from 'react'
import { StyleSheet, View , Text, Image, ScrollView, Alert} from 'react-native'
import { Input, Icon, Button} from 'react-native-elements';
import {isEmpty} from "lodash";
import { colors } from "react-native-elements";
import axios from 'axios'
import {NavigationContainer} from "@react-navigation/native";
import Navigation from "../navegations/Navegation";
import CargarDatos from "../navegations/CargarDatos";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from "../components/Context"
import NetInfo from "@react-native-community/netinfo";
import * as SQLite from "expo-sqlite";

const STORAGE_KEY = '@save_data'
const STORAGE_DB = '@login_data'

const database_name = "CotzulBD10.db";
const database_version = "1.0";
const database_displayname = "CotzulBDS";
const database_size = 200000;



export default function LoginForm(props) {
    const {toastRef} = props;
    const [showPassword,setShowPassword] = useState(false);
    const [formData, setformData] = useState(defaultValueForm());
    const [dataUser, setdataUser] = useState(defaultValueUser());
    const [user, setUser] = useState(false);
    const [basedatos, setBasedatos] = useState(false);
    const {signNext, signUp} = React.useContext(AuthContext);
    const [internet, setInternet] = useState(true);
    const [activochk, setActivochk] = useState(false);
    const [activoreg, setActivoreg] = useState(false);


    let db = null;
    
   
    const onChange = (e, type) => {
        setformData({...formData, [type]:e.nativeEvent.text});
    }


    const getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
          setUser(jsonValue != null ? true : false);
        } catch(e) {
           console.log(e)
        }
    }

    const setDB = async (value) => {
        try {
            await AsyncStorage.setItem(STORAGE_DB, value)
          } catch(e) {
             console.log(e)
          }
    }

    const getDB = async () => {
        try {
          const base = await AsyncStorage.getItem(STORAGE_DB);
          setBasedatos(base == "SI" ? true : false);
          console.log("base de datos: " + basedatos)
        } catch(e) {
           console.log(e)
        }
    }
    

      const storeData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem(STORAGE_KEY, jsonValue)
        } catch (e) {
          // saving error
        }
      }

    const reviewInternet = () =>{
        NetInfo.fetch().then(state => {
            console.log("Connection type login", state.type);
            console.log("Is connected?", state.isConnected);
            setInternet(state.isConnected)
        });
    } 

     const continuaAcceso = (usuario) =>{
        setUser(true);
        storeData(usuario);
        setDB("NO") 
        if(usuario.vn_loading > 0)
          signUp()
        else
          signNext()
     }

    const existeUsuario = ()=>{
      db = SQLite.openDatabase(
        database_name,
        database_version,
        database_displayname,
        database_size
      );

        var len = 0;
         db.transaction((txn) => {
            console.log("probando el analisis...");
            txn.executeSql("SELECT * FROM usuario WHERE us_numunico = 1", [], (tx, results) => {
                len = results.rows.length;
                var temp = [];
                if(len > 0){
                  
                  for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    if(row.us_login == 0){
                      setActivoreg(true);
                    }else{
                      temp.push({
                        vn_codigo: row.us_codvendedor,
                        vn_nombre: row.us_nombre,
                        vn_usuario: row.us_usuario,
                        vn_clave: row.us_clave,
                        vn_recibo: row.us_numrecibo,
                        vn_borrador: row.us_numborrador,
                        vn_loading: row.us_loading,
                        vn_fechaloading: row.us_fechaloading,
                        vn_login: row.us_login
                      });
                      console.log(`USUARIO VENDEDOR: ` + JSON.stringify(temp));
                    }
                   
                  }
                  continuaAcceso(temp[0]);

                }
                 
              });
             
          });
    }

    /*const jsonString = JSON.stringify(Object.assign({}, array))*/

    /*vn_codigo: 0,
    vn_nombre: "",
    vn_usuario: "",
    vn_clave: "",
    vn_recibo: "",*/

    /*var temp = [];
    for (let i = 0; i < dataPlazo.length; ++i) {
      temp.push({
        label: dataPlazo[i].pl_descripcion,
        value: dataPlazo[i].pl_codigo,
      });
    }
    console.log("se encontro plazo: " + temp);
    setPlazo(temp);*/


    useEffect(()=>{
      existeUsuario()
    },[])

    function EvaluarUsuario(usuario, clave, db){
      var len = 0;
      var temp = [];
      db.transaction((txn) => {
        txn.executeSql("SELECT * FROM usuario WHERE us_usuario = ? AND us_clave = ? AND us_login = 0", [usuario, clave], (txn, results) => {
          len = results.rows.length;
          
          if(len > 0){
            console.log("total usuarios: "+ len);
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              temp.push({
                vn_codigo: row.us_codvendedor,
                vn_nombre: row.us_nombre,
                vn_usuario: row.us_usuario,
                vn_clave: row.us_clave,
                vn_recibo: row.us_numrecibo,
                vn_borrador: row.us_numborrador,
                vn_loading: row.us_loading,
                vn_fechaloading: row.us_fechaloading,
                vn_login:1 
              });
              console.log(`USUARIO VENDEDOR: ` + JSON.stringify(temp));
              console.log(`USUARIO VENDEDOR: ` + JSON.stringify(row));
            }
            txn.executeSql("UPDATE usuario SET us_login = 1 WHERE us_numunico = 1")
            continuaAcceso(temp[0]);
          }else{
            toastRef.current.show("El usuario no le pertenece este Dispositivo");
          }
          
        },
        
        
        );

        


      });
    }

    function AlmacenaUsuario(usuario, user, pwd, nombre, codvendedor, numrecibo, numborrador, db){
            console.log("SE registrara como nuevo usuario");
          db.transaction((txn) => {
            txn.executeSql("DROP TABLE IF EXISTS usuario");
           txn.executeSql(
              "CREATE TABLE IF NOT EXISTS " +
                "usuario " +
                "(us_numunico INTEGER, us_usuario VARCHAR(20), us_clave VARCHAR(20)" +
                ", us_nombre VARCHAR(200), us_codvendedor  VARCHAR(50), us_numrecibo INTEGER, us_numborrador INTEGER, us_loading INTEGER, us_fechaloading VARCHAR(50), us_login INTEGER);"
            );

            console.log("CREO LA NUEVA TABLA USUARIO");
      
              txn.executeSql(
                "INSERT INTO usuario(us_numunico,us_usuario,us_clave" +
                  ", us_nombre, us_codvendedor , us_numrecibo, us_numborrador, us_loading, us_fechaloading, us_login) " +
                  " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?); ",
                [
                  Number(1),
                  user,
                  pwd,
                  nombre,
                  codvendedor,
                  numrecibo,
                  numborrador,
                  Number(0),
                  "-----",
                  Number(1)
                ],
                (txn, results) => {
                  if (results.rowsAffected > 0) {
                    console.log("Registro usuario con éxito");
                  }
                }
              );
    
              txn.executeSql("SELECT * FROM usuario", [], (tx, results) => {
                var len = results.rows.length;
                var temp = [];
                console.log("total usuarios: "+ len);
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  temp.push({
                    vn_codigo: row.us_codvendedor,
                    vn_nombre: row.us_nombre,
                    vn_usuario: row.us_usuario,
                    vn_clave: row.us_clave,
                    vn_recibo: row.us_numrecibo,
                    vn_borrador: row.us_numborrador,
                    vn_loading: row.us_loading,
                    vn_fechaloading: row.us_fechaloading,
                    vn_login:row.us_login
                  });
                  console.log(`USUARIO VENDEDOR: ` + JSON.stringify(temp));
                  console.log(`USUARIO VENDEDOR: ` + JSON.stringify(row));
                }
                continuaAcceso(temp[0]);
              });
              
          });
    
    }

  

    const onSubmit = async () =>{

      db = SQLite.openDatabase(
        database_name,
        database_version,
        database_displayname,
        database_size
      );

        
          reviewInternet()
           
                if(isEmpty(formData.usuario) || isEmpty(formData.password)){
                    toastRef.current.show("Todos los campos son obligatorios");
                }else{

                  if(!activoreg){
                    if(internet){
                    console.log('https://app.cotzul.com/Pedidos/cr_getUsuarioVendedor.php?usuario='+formData.usuario.toLowerCase()+'&clave='+formData.password);
                    try {
                        const response = await fetch(
                          'https://app.cotzul.com/Pedidos/cr_getUsuarioVendedor.php?usuario='+formData.usuario.toLowerCase()+'&clave='+formData.password
                        );

                        console.log('https://app.cotzul.com/Pedidos/cr_getUsuarioVendedor.php?usuario='+formData.usuario.toLowerCase()+'&clave='+formData.password);
                        
                        const respuesta = await response.json();
                        if(respuesta.usuario[0].vn_codigo != 0){
                            //toastRef.current.show("Bienvenido " + respuesta.usuario[0].vn_nombre);
                            console.log("usuario: "+ respuesta.usuario[0].vn_usuario);
                            AlmacenaUsuario(respuesta.usuario[0],respuesta.usuario[0].vn_usuario,respuesta.usuario[0].vn_clave, respuesta.usuario[0].vn_nombre, respuesta.usuario[0].vn_codigo, respuesta.usuario[0].vn_recibo, respuesta.usuario[0].vn_borrador,db);
                        }else{
                            toastRef.current.show("El usuario o contraseña estan erroneos");
                        }
                        
                    }catch(error){
                        console.log("Ocurrio un error: "+ error);
                    }
                  }else{
                       Alert.alert("Su dispositivo no cuenta con internet");
                  }
                  }else{
                      EvaluarUsuario(formData.usuario.toLowerCase(),formData.password, db);
                  }

                  
                }
              
        
        
        
    }


    return (
       
        <>
             
            <View style={styles.formContainer}><Image 
                source={require("../../assets/img/logo_cotzul.jpeg")}
                resizeMode = "contain"
                style={styles.image}
            />
             <Text style={styles.titlesTitle}>Pedidos Vendedores</Text>
            <Input 
                placeholder = "Usuario"
                containerStyle = {styles.inputForm}
                rightIcon = {
                    <Icon 
                        type="material-community"
                        name="account"
                        iconStyle={styles.iconRight}
                    />
                }
                onChange={(e) =>onChange(e, "usuario")}
            />
            <Input 
                placeholder = "Contraseña"
                containerStyle = {styles.inputForm}
                password = {true}
                secureTextEntry = {!showPassword}
                rightIcon = {
                    <Icon 
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
                onChange={(e) =>onChange(e, "password")}
            />
            <Button
                title="Iniciar sesión"
                containerStyle={styles.btnContainerLogin}
                buttonStyle = {styles.btnLogin}
                onPress= {onSubmit}
            /></View>
            
        </>
    );
}






function defaultValueUser(){
    return{
        vn_codigo: "",
        vn_nombre: "",
        vn_usuario: "",
        vn_clave: "",
    }
}


function defaultValueForm(){
    return{
        usuario: "",
        password: ""
    }
}

const styles = StyleSheet.create({
    formContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10, 
        marginLeft: 30, 
        marginRight: 30
    },
    titlesSubtitle:{
        // fontFamily: 
        fontSize: 16,
        color: colors.textDark,
     },
    inputForm:{
        width: "100%",
        marginTop: 10
    },
    image:{
        height: 50,
        width: "80%",
        marginTop: 20, 
        marginBottom: 10,
    },
    btnContainerLogin:{
        marginTop: 30, 
        width: "95%"
    },
    btnLogin:{
        backgroundColor: "#6f4993",
    }, 
    iconRight:{
        color : "#c1c1c1",

    }
})
