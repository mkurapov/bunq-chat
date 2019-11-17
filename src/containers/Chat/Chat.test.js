import React from 'react';
import ReactDOM from 'react-dom';
import App from './Chat';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Chat />, div);
  ReactDOM.unmountComponentAtNode(div);
});
