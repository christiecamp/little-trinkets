//react redux dependencies
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
//import apollo client dependencies
import { useQuery } from '@apollo/client';
//import utils
import {
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
  UPDATE_PRODUCTS,
} from '../utils/actions';
import { QUERY_PRODUCTS } from '../utils/queries';
import { idbPromise } from '../utils/helpers';
//import cart component
import Cart from '../components/Cart';
// import asset
import spinner from '../assets/spinner.gif';

//detail page
function Detail() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { id } = useParams();
  const [currentProduct, setCurrentProduct] = useState({});
  const { loading, data } = useQuery(QUERY_PRODUCTS);
  const { products, cart } = state;

  //useEffect to retrieve products from server
  useEffect(() => {
    //already in global store
    if (products.length) {
      setCurrentProduct(products.find((product) => product._id === id));
    }
    //retrieved from server
    else if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products,
      });
      //save to idb
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    }
    //get cache from idb
    else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: indexedProducts,
        });
      });
    }
  }, [products, data, loading, dispatch, id]);

  //add to cart function
  const addToCart = () => {
    //find the cart item with the matching id
    const itemInCart = cart.find((cartItem) => cartItem._id === id);
    if (itemInCart) {
      //if item is already in cart, update the quantity
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
      //update idb
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
      //if item is not in cart, add it
    } else {
      //add to cart
      dispatch({
        type: ADD_TO_CART,
        product: { ...currentProduct, purchaseQuantity: 1 },
      });
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
    }
  };

  //remove from cart function
  const removeFromCart = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: currentProduct._id,
    });

    idbPromise('cart', 'delete', { ...currentProduct });
  };

  return (
    <>
      {currentProduct && cart ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCart}>Add to Cart</button>
            <button
              disabled={!cart.find((p) => p._id === currentProduct._id)}
              onClick={removeFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
