import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Productos from "../screens/Productos";
import NuevoPed from "../screens/NuevoPed";
import Perfil from "../screens/Perfil";

const Stack = createStackNavigator();
export default function ProductosStack(){
    
    return(
        <Stack.Navigator>
            <Stack.Screen 
            name="productos"
            component={Productos}
            options={{title:"Pedidos Vendedor"}} />
            <Stack.Screen 
            name="nuevoped"
            component={NuevoPed}
            options={{title:"Nuevo Pedido"}} />
            
        </Stack.Navigator>
        
    );
}