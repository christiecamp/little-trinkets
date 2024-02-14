import { createContext, useContext, useReducer } from "react";
//import the reducer function
import { reducer } from './reducers'


//create a new context object
const StoreContext = createContext();
//destructure the Provider from the StoreContext
const { Provider } = StoreContext;

//create a new component that will instantiate the global state and provide it to the app
const StoreProvider = ({ value = [], ...props }) => {
  //dispatch - method used to update state
  //state - current state of the application
  const [state, dispatch] = useReducer(reducer, {
    products: [],
    cart: [],
    cartOpen: false,
    categories: [],
    currentCategory: '',
  });
  console.log(state);
  return <Provider value={[state, dispatch]} {...props} />;
};

//custom hook that will allow torecontext access in any component
const useStoreContext = () => {
  return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };
