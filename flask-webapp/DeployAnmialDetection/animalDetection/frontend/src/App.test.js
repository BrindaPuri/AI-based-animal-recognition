import './mockJsdom'
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import ReactDOM from "react-dom"
import { unmountComponentAtNode } from "react-dom";

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

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

test('renders app', () => {
  render(<App />);
  expect(screen.getByText("Animal Recognition AI Pipeline")).toBeInTheDocument();
  expect(screen.getByText("Identify animal species by uploading your own dataset.")).toBeInTheDocument();
  expect(screen.getByText("created by Shuban Ranganath, Zhantong Qiu, Brinda Puri, and Sanskriti Jain")).toBeInTheDocument();
  expect(screen.getByText("ECS 193, Winter and Spring 2023")).toBeInTheDocument();
});

test("check for top container", async () => {
  const { container } = render(<App/>);
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  const boxes = container.getElementsByClassName('topcontainer');
  console.log(boxes.length); 
  expect(boxes.length).toBe(1);
})

test("check for bottom container", async () => {
  const { container } = render(<App/>);
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  const boxes = container.getElementsByClassName('container');
  console.log(boxes.length); 
  expect(boxes.length).toBe(1);
})

test('renders logo', () => {
  const {container} = render(<App />);
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  const boxes = container.getElementsByClassName('big_circle');
  console.log(boxes.length); 
  expect(boxes.length).toBe(4);
});

test('button must have src = "document_logo.jpg" and alt = "logo-logo"', () => {
  render(<App />);
  const logo = screen.getByRole('presentation', { name: "settingbutton"});
  expect(logo).toHaveAttribute('src', 'document_logo.jpg');
  expect(logo).toHaveAttribute('alt', 'logo-logo');
});

test('click settings button', () => {
  render(<App />);
  const logo = screen.getByRole('presentation', { name: "settingbutton"});
  fireEvent.click(logo);
  expect(screen.getByText("Yolov8 Confident Value (default: 0.25) :")).toBeInTheDocument();
  expect(screen.getByText("ResNet Confident Value (default: 0.25) :")).toBeInTheDocument();
  expect(screen.getByText("VIT Confident Value (default: 0.25) :")).toBeInTheDocument();
});
