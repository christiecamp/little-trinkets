//react redux dependencies
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import apollo client dependencies
import { useQuery } from '@apollo/client';
//import utils
import { UPDATE_PRODUCTS } from '../../utils/actions';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
//import state management
import ProductItem from '../ProductItem';
//import asset
import spinner from '../../assets/spinner.gif';

function ProductList() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { currentCategory } = state;
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  //if data exists or has changed from the response of useQuery, then run dispatch()
  useEffect(() => {
    //retrieved from server
    if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products,
      });
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
      //get cache from idb
    } else if (!loading) {
      idbPromise('products', 'get').then((products) => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products,
        });
      });
    }
  }, [data, loading, dispatch]);

  //filter products by category
  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    //return products that match the current category
    return state.products.filter(
      (product) => product.category._id === currentCategory
    );
  }
  
  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {state.products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>No products added yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
