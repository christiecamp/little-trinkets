//react dependencies
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import apollo
import { useLazyQuery } from '@apollo/client';
//import stripe
import { loadStripe } from '@stripe/stripe-js';
//import util dependencies
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import Auth from '../../utils/auth';
//import components
import CartItem from '../CartItem';
//import css
import './style.css';

//return stripe promise
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

//create cart component
const Cart = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

  //use effect to redirect to stripe checkout
  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);

  //use effect to get cart from indexedDB
  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise('cart', 'get');
      dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
    }
    //if no items in cart, get cart from indexedDB
    if (!state.cart.length) {
      getCart();
    }
  }, [state.cart.length, dispatch]);

  //toggle cart function
  function toggleCart() {
    dispatch({ type: TOGGLE_CART });
  }

  //calculate total function
  //loop over state.cart and calculate total
  function calculateTotal() {
    let sum = 0;
    state.cart.forEach((item) => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  //submit checkout function
  //loop over state.cart and get productIds
  function submitCheckout() {
    const productIds = [];
    state.cart.forEach((item) => {
      for (let i = 0; i < item.purchaseQuantity; i++) {
        productIds.push(item._id);
      }
    });
    //get checkout session
    getCheckout({
      variables: { products: productIds },
    });
  }
  //if cart is closed, return cart-closed div
  if (!state.cartOpen) {
    return (
      <div className="cart-closed" onClick={toggleCart}>
        <span role="img" aria-label="trash">
          🛒
        </span>
      </div>
    );
  }
  //if cart is open, return cart div
  return (
    <div className="cart">
      <div className="close" onClick={toggleCart}>
        [close]
      </div>
      <h2>Shopping Cart</h2>
      {state.cart.length ? (
        <div>
          {state.cart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}

          <div className="flex-row space-between">
            <strong>Total: ${calculateTotal()}</strong>

            {Auth.loggedIn() ? (
              <button onClick={submitCheckout}>Checkout</button>
            ) : (
              <span>(log in to check out)</span>
            )}
          </div>
        </div>
      ) : (
        <h3>
          <span role="img" aria-label="shocked">
            😱
          </span>
          Nothing in your cart!
        </h3>
      )}
    </div>
  );
};

export default Cart;
