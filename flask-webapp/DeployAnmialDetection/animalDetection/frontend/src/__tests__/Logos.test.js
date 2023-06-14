import '../mockJsdom'
import { render, screen, fireEvent, getByLabelText } from '@testing-library/react';
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

test('button must have src = "image.png" and alt = "logo-logo"', () => {
  render(<Logos />);
  const logo = screen.getByRole('presentation', { name: "image"});
  expect(logo).toHaveAttribute('src', 'image.png');
  expect(logo).toHaveAttribute('alt', 'logo-logo');
});

test('click select images button', () => {
  render(<Logos />);
  const imageLogo = screen.getByRole('presentation', { name: "image"});
  fireEvent.click(imageLogo);
  expect(screen.getByText("0 images have been selected.")).toBeInTheDocument();
});

test('click select images button and error on upload', () => {
  render(<Logos />);
  const imageLogo = screen.getByRole('presentation', { name: "image"});
  fireEvent.click(imageLogo);
  const uploadLogo = screen.getByRole('presentation', { name: "out"});
  fireEvent.click(uploadLogo);
  expect(screen.getByText("You have not completed the select images step. Please make sure to complete that first.")).toBeInTheDocument();
});

test('click select images button and error on classify', () => {
  render(<Logos />);
  const imageLogo = screen.getByRole('presentation', { name: "image"});
  fireEvent.click(imageLogo);
  const classifyLogo = screen.getByRole('presentation', { name: "scan"});
  fireEvent.click(classifyLogo);
  expect(screen.getByText("You have not completed the select images step. Please make sure to complete that first.")).toBeInTheDocument();
});

test('click select images button and error on download', () => {
  render(<Logos />);
  const imageLogo = screen.getByRole('presentation', { name: "image"});
  fireEvent.click(imageLogo);
  const downloadLogo = screen.getByRole('presentation', { name: "download"});
  fireEvent.click(downloadLogo);
  expect(screen.getByText("You have not completed the select images step. Please make sure to complete that first.")).toBeInTheDocument();
});

test('do not click select images button and error on upload', () => {
  render(<Logos />);
  const uploadLogo = screen.getByRole('presentation', { name: "out"});
  fireEvent.click(uploadLogo);
  expect(screen.getByText("You have not completed the select images step. Please make sure to complete that first.")).toBeInTheDocument();
});

test('do not click select images button and error on classify', () => {
  render(<Logos />);
  const classifyLogo = screen.getByRole('presentation', { name: "scan"});
  fireEvent.click(classifyLogo);
  expect(screen.getByText("You have not completed the select images step. Please make sure to complete that first.")).toBeInTheDocument();
});

test('do not click select images button and error on download', () => {
  render(<Logos />);
  const downloadLogo = screen.getByRole('presentation', { name: "download"});
  fireEvent.click(downloadLogo);
  expect(screen.getByText("You have not completed the select images step. Please make sure to complete that first.")).toBeInTheDocument();
});
