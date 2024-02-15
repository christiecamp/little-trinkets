import { Outlet } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
// import { Provider } from 'react-redux';
import { setContext } from '@apollo/client/link/context';
//import components
import Nav from './components/Nav';
import StoreProvider from './utils/store';

//create http link
const httpLink = createHttpLink({
  uri: '/graphql',
});

//create auth link
const authLink = setContext((_, { headers }) => {
  //get the token from local storage
  const token = localStorage.getItem('id_token');
  //return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

//apollo client setup
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <StoreProvider>
        <Nav />
        <Outlet />
      </StoreProvider>
    </ApolloProvider>
  );
}

export default App;
