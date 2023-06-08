import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  render(<App />);
  expect(screen.getByText(/ECS 193, Winter and Spring 2023/i)).toBeInTheDocument();
  expect(screen.getByText(/Welcome to the Animal Recognition AI Pipeline./i)).toBeInTheDocument();

});

test("check for two containers", async () => {
  const { container } = render(<App/>);
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  const boxes = container.getElementsByClassName('container');
  console.log(boxes.length); 
  expect(boxes.length).toBe(2);
})
