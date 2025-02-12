import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NavContainer } from '../nav-container/nav-container.component';
import {
	NAVIGATION_KEYS,
	RootStackParamList,
} from '../../types/navigation.type';
import { SCREEN_OPTIONS } from '../../constants';
import { LoginScreen } from '../../../auth/screens/login/login.screen';
const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
	const screens = React.useMemo(() => {
		return (
			<>
				<Stack.Screen
					name={NAVIGATION_KEYS.LOGIN}
					component={LoginScreen}
					options={SCREEN_OPTIONS}
				/>
			</>
		);
	}, []);

	return (
		<NavContainer>
			<Stack.Navigator initialRouteName={NAVIGATION_KEYS.LOGIN}>
				{screens}
			</Stack.Navigator>
		</NavContainer>
	);
};
