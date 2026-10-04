import React from 'react';

// Components
import { CardDescription, CardHeader, CardTitle } from 'design/components';

const COPY = {
  description: 'Sign in with the credentials you were given.',
  title: 'Moonshot',
};

const Header: React.FunctionComponent = () => (
  <CardHeader>
    {/* The page's only heading, kept at the card title's size. */}
    <CardTitle className='kicl-font-size' is='h1'>
      {COPY.title}
    </CardTitle>
    <CardDescription>{COPY.description}</CardDescription>
  </CardHeader>
);

export { Header };
