import React,{useState, useEffect, useContext} from "react";
import {View, Text, Image,StyleSheet, Alert} from "react-native";
import { Input, Icon, Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useNavigation} from "@react-navigation/native"
import LoginForm from "../navegations/LoginForm";
import * as SQLite from 'expo-sqlite';
import { AuthContext } from "../components/Context"
import NetInfo from "@react-native-community/netinfo";
import CargarInformacion from "../navegations/CargarInformacion";

const STORAGE_KEY = '@save_data'

const database_name = 'CotzulBD2.db';
const database_version = '2.0';
const database_displayname = 'CotzulBD';
const database_size = 200000;

export default function Perfil(){
    
    const [dataUser, setdataUser] = useState(defaultValueUser());
    const navigation = useNavigation();
    const [user, setUser] = useState(true);
    const {signOut, signUp} = React.useContext(AuthContext);
    const [internet, setInternet] = useState(true);
    const [activo, setActivo] = useState(false);
    
   
    

    const getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
          setdataUser(JSON.parse(jsonValue));
          setActivo(true);
        } catch(e) {
           console.log(e)
        }
    }

   useEffect(()=>{
        if(!activo)
            getData();
   });
    

   const reviewInternet = () =>{
    NetInfo.fetch().then(state => {
            console.log("Connection type perfil", state.type);
            console.log("Is connected?", state.isConnected);
            setInternet(state.isConnected)
    });
   }

   const onSubmit = async() =>{
        try {

            let db = null;
            db = SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size
              );

                console.log(db)
              db.transaction((tx) => {
                tx.executeSql("UPDATE usuario SET us_login = 0 WHERE us_numunico = 1",(tx,results)=>{
                    console.log('Done.')
                     getout();
                },
                (txn, error) => {
                    console.log('Error al actualizar:', error.message); // Imprime el mensaje de error
                });
              });
                

           
            
          } catch(e) {
            console.log(e.message)
          }
        
          
   }

   const getout = async() =>{
    await AsyncStorage.removeItem(STORAGE_KEY)
                    setUser(false)
                    signOut()
   }

   const onLoad = () =>{
        reviewInternet();
        if(internet){
            signUp();
        }else{
            Alert.alert("Su dispositivo no cuenta con internet");
        }
   }


    return(<>
    
        <View style={styles.formContainer}>
        <Image 
            source={require("../../assets/img/imagen_perfil.jpeg")}
            resizeMode = "contain"
            style={styles.image}
        />
        
        <Text style={styles.txtusuario}>{dataUser.vn_nombre}</Text>
      
            <CargarInformacion />
        
        <Button
            title="Cerrar sesión"
            containerStyle={styles.btnContainerLogin}
            buttonStyle = {styles.btnLogin}
            onPress= {onSubmit}
        />
        <Text style={styles.txtusuario}>Version App: 1.0.24</Text>
    </View>
        
        </>
    );
}

const styles = StyleSheet.create({
    formContainer:{
        flex: 1,
        alignItems: 'center',
        marginTop: 10, 
        marginLeft: 30, 
        marginRight: 30
    },
    inputForm:{
        width: "100%",
        marginTop: 10
    },
    image:{
        height: 200,
        width: "150%",
        marginTop: 50, 
        marginBottom: 10,
    },
    btnContainerLogin:{
        marginTop: 10, 
        width: "95%"
    },
    btnLogin:{
        backgroundColor: "#00a680",
    }, 
    iconRight:{
        color : "#c1c1c1",

    },
    txtusuario:{
        fontSize: 15,
        marginTop: 10,
        fontWeight: "400",
    },
    txttipo:{
        fontSize: 13,
        marginTop: 10,
        fontWeight: "bold",
    }
})

function defaultValueUser(){
    return{
        us_codigo: "",
        us_idtipoadm: "",
        us_nombre: "",
        us_nomtipoadm: ""
    }
}