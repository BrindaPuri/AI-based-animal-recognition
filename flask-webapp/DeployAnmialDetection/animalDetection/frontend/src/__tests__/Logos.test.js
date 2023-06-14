import '../mockJsdom'
import { render, screen, fireEvent } from '@testing-library/react';
import Logos from '../App';
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('renders logo', () => {
  window.URL.createObjectURL = jest.fn();
  const {container} = render(<Logos />);
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  const boxes = container.getElementsByClassName('big_circle');
  console.log(boxes.length); 
  expect(boxes.length).toBe(4);
});
