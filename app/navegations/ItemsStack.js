import React from 'react'
import {createStackNavigator} from "@react-navigation/stack";
import Productos from "../screens/PedidosEnviados";
import PedidosEnviados from '../screens/PedidosEnviados';
import ItemBusqueda from '../screens/ItemBusqueda';

const Stack = createStackNavigator();

export default function ItemsStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen 
            name="productos"
            component={ItemBusqueda}
            options={{title:"Lista de Precios y Stock"}} />
        </Stack.Navigator>
        
    );
}