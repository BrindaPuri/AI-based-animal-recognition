import { render, screen, fireEvent } from '@testing-library/react';
import InfoText from '../App';

test('renders info text', () => {
  const {container} = render(<InfoText />);
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  const boxes = container.getElementsByClassName('introtext');
  console.log(boxes.length); 
  expect(boxes.length).toBe(1);
});

test('renders hidden info text', () => {
    const {container} = render(<InfoText />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const boxes = container.getElementsByClassName('hidden');
    console.log(boxes.length); 
    expect(boxes.length).toBe(1);
  });

test('is there hidden text', () => {
    render(<InfoText />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const hidden = screen.getByTestId('info');
    expect(hidden).toBeInTheDocument()
  });
