import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './LogIn.jsx';


test('Render LogIn Watermark', () => {
  // Wrap the App component with MemoryRouter to mock the router
  render(<Login/>);
  const linkElement = screen.getByText('Developed by Edward Lee');
  expect(linkElement).toBeInTheDocument();
});
