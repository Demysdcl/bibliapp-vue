// check if current path is /auth/*
export const isAuthPage = () => true
//  ({ route }) => route.path.indexOf('/auth') !== -1

// check if navigation should be displayed
// if route.path does not exist yet returns false
export const shouldShowNavigation = () => true
//  ({ route }, getters) => (route.path ? !getters.isAuthPage : false);
