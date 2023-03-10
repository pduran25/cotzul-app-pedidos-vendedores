import React from 'react'
import {createStackNavigator} from "@react-navigation/stack";
import Productos from "../screens/PedidosEnviados";
import PedidosEnviados from '../screens/PedidosEnviados';

const Stack = createStackNavigator();

export default function PedidosStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen 
            name="productos"
            component={PedidosEnviados}
            options={{title:"Pedidos Registrados"}} />
        </Stack.Navigator>
        
    );
}
