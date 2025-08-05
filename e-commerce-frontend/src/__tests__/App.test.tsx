import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    const linkElement = screen.getByText(/e-commerce/i);
    expect(linkElement).toBeInTheDocument();
  });
});
