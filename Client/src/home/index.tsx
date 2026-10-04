import React from 'react';

// Routes
import { Route } from 'design/router';

// Components
import { Heading, Layout, Text } from 'design/components';

const Contents: React.FunctionComponent = () => {
  return (
    <Layout
      alignContent='center'
      autoFlow='row'
      fullScreen
      justifyItems='center'
    >
      <Heading is='h1'>Moonshot</Heading>
      <Text is='p'>More to come.</Text>
    </Layout>
  );
};

const Home = <Route index element={<Contents />} />;

export { Home };
