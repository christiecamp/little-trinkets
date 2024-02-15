// import createStore 
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
// import the reducer file
import reducer from './reducers';

//create redux store
const store = configureStore({reducer});

//create a provider component that makes the store accessible to all other components
const StoreProvider = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
};

// create a Redux store that accepts the reducers
export default StoreProvider;