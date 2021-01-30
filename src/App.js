import React from 'react';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import config from './Config';

const httpLink = new HttpLink({
  uri: config.apolloLinks.http,
});

const wsLink = new WebSocketLink({
  uri: config.apolloLinks.ws,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  resolvers: {},
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <h1>Hello world</h1>
    </ApolloProvider>
  );
};

export default App;
