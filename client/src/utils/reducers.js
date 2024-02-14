import {
  UPDATE_PRODUCTS,
  ADD_TO_CART,
  UPDATE_CART_QUANTITY,
  REMOVE_FROM_CART,
  ADD_MULTIPLE_TO_CART,
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
  CLEAR_CART,
  TOGGLE_CART,
} from './actions';

//define initial state
export const initialState = {
  products: [],
  cart: [],
  cartOpen: false,
  categories: [],
  currentCategory: '',
};

//set initial state of the reducer
//reducer - function that accepts the current state and an action. It returns a new state based on that action
export const reducer = (state = initialState, action) => {
  switch (action.type) {

    //returns copy of state with an update products array
    //action.products property and spread it's contents into the new array
    //update product
    case UPDATE_PRODUCTS:
      return {
        ...state,
        products: [...action.products],
      };

    //add to cart
    case ADD_TO_CART:
      return {
        ...state,
        cartOpen: true,
        cart: [...state.cart, action.product],
      };

    //add multiple to cart
    case ADD_MULTIPLE_TO_CART:
      return {
        ...state,
        cart: [...state.cart, ...action.products],
      };

    //return copy of state - sets the cartOpen to true and map through the items in the cart
    //update the purchase quantity if item `id` matches the `id` that was provided in action.payload
    case UPDATE_CART_QUANTITY:
      return {
        ...state,
        cartOpen: true,
        cart: state.cart.map((product) => {
          if (action._id === product._id) {
            product.purchaseQuantity = action.purchaseQuantity;
          }
          return product;
        }),
      };

    //iterate through each item in the cart and check to see if the `product._id` matches the `action._id`
    //remove from cart and set the updated state to a variable called `newState`
    case REMOVE_FROM_CART:
      const newState = state.cart.filter((product) => {
        return product._id !== action._id;
      });
      //return a copy of state and check to see if the cart is empty
      //set cartOpen status to `true` - return an updated cart array set to the value of `newState`
      return {
        ...state,
        cartOpen: newState.length > 0,
        cart: newState,
      };

    //clear cart
    case CLEAR_CART:
      return {
        ...state,
        cartOpen: false,
        cart: [],
      };

    //toggle cart
    case TOGGLE_CART:
      return {
        ...state,
        cartOpen: !state.cartOpen,
      };

    //update categories
    case UPDATE_CATEGORIES:
      return {
        ...state,
        categories: [...action.categories],
      };
    
    //update current category
    case UPDATE_CURRENT_CATEGORY:
      return {
        ...state,
        currentCategory: action.currentCategory,
      };

    //return state as is if action type is not in the switch statement
    default:
      return state;
  }
};
