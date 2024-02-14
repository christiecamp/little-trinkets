//import react and apollo dependencies
import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
//import components and utils
import Jumbotron from '../components/Jumbotron';
import { ADD_ORDER } from '../utils/mutations';
import { idbPromise } from '../utils/helpers';

//create success component
function Success() {
  const [addOrder] = useMutation(ADD_ORDER);
  //use effect to run when component mounts
  useEffect(() => {
    async function saveOrder() {
      const cart = await idbPromise('cart', 'get');
      const products = cart.map((item) => item._id);
      //if there are products in the cart, add the order to the database
      if (products.length) {
        const { data } = await addOrder({ variables: { products } });
        const productData = data.addOrder.products;
        //loop over the products and remove them from the indexedDB using the helper function
        productData.forEach((item) => {
          idbPromise('cart', 'delete', item);
        });
      }
      //redirect to the home page after 3 seconds
      setTimeout(() => {
        window.location.assign('/');
      }, 3000);
    }
    //call the saveOrder function
    saveOrder();
  }, [addOrder]);

  return (
    <div>
      <Jumbotron>
        <h1>Success!</h1>
        <h2>Thank you for your purchase!</h2>
        <h2>You will now be redirected to the home page</h2>
      </Jumbotron>
    </div>
  );
}

export default Success;
