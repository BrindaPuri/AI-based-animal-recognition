import { render, screen, fireEvent } from '@testing-library/react';
import Logos from '../App';

test('renders logo', () => {
  const {container} = render(<Logos />);
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  const boxes = container.getElementsByClassName('big_circle');
  console.log(boxes.length); 
  expect(boxes.length).toBe(4);
});
