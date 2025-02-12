import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from '../navigation/components/root-navigator';

export const App = () => {
	return (
		<SafeAreaProvider>
			<RootNavigator />
		</SafeAreaProvider>
	);
};
