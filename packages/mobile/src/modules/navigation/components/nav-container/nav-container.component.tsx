import React, { FunctionComponent } from 'react';
import { NavigationContainer } from '@react-navigation/native';

type NavContainerProps = {
	children: React.ReactNode;
};

export const NavContainer: FunctionComponent<NavContainerProps> = ({
	children,
}) => {
	return <NavigationContainer>{children}</NavigationContainer>;
};
