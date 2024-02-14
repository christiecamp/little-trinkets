const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');
const tiny = require('./config/connection');

const PORT = process.env.PORT || 3001;
const trinket = express();

//apollo is now cache state manager - redux is for other data

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();

  trinket.use(express.urlencoded({ extended: false }));
  trinket.use(express.json());

  // Serve up static assets
  trinket.use('/images', express.static(path.join(__dirname, '../client/images')));

  trinket.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  if (process.env.NODE_ENV === 'production') {
    trinket.use(express.static(path.join(__dirname, '../client/dist')));

    trinket.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  tiny.once('open', () => {
    trinket.listen(PORT, () => {
            console.log(`
============================================================
               LITTLE TRINKETS BACK END SERVER
============================================================
                             _        ,
                            (_l______/________
                               l-|-|/|-|-|-|-|/
                                l==/-|-|-|-|-/
                                 l/|-|-|-|,-'
                                  l--|-'''
                                   l_j________
                            ..... (_)     (_)

              ==============================
                  Shop 'till you drop!

                 x     *     *     *   x

                 http://localhost:${PORT}
              ==============================


              graphql path:
              http://localhost:${PORT}/graphql
      `);    
      
    });
  });
};

// Call the async function to start the server
startApolloServer();
