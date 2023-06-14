import '../mockJsdom'
import { render, screen, fireEvent } from '@testing-library/react';
import InfoText from '../App';
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

test('renders info text', () => {
  window.URL.createObjectURL = jest.fn();
  const {container} = render(<InfoText />);
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  const boxes = container.getElementsByClassName('introtext');
  console.log(boxes.length); 
  expect(boxes.length).toBe(1);
});

test('renders subtext', () => {
  window.URL.createObjectURL = jest.fn();
  const {container} = render(<InfoText />);
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  const boxes = container.getElementsByClassName('subtext');
  console.log(boxes.length); 
  expect(boxes.length).toBe(1);
});

test('renders hidden info text', () => {  
    window.URL.createObjectURL = jest.fn();
    const {container} = render(<InfoText />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const boxes = container.getElementsByClassName('hidden');
    console.log(boxes.length); 
    expect(boxes.length).toBe(1);
  });

test('is there hidden', () => {
  window.URL.createObjectURL = jest.fn();
  render(<InfoText />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const hidden = screen.getByText("ECS 193, Winter and Spring 2023");
    expect(hidden).toBeInTheDocument();
    // fireEvent.click(button);
    // expect(hidden).toBe(<div class="hidden" data-testid="info"><p>created by Shuban Ranganath, Zhantong Qiu, Brinda Puri, and Sanskriti Jain</p><p>ECS 193, Winter and Spring 2023</p></div>);
    // expect(hidden.innerHTML).toBe("<p>created by Shuban Ranganath, Zhantong Qiu, Brinda Puri, and Sanskriti Jain</p><p>ECS 193, Winter and Spring 2023</p>");
});
