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

test('is there hidden', () => {
    render(<InfoText />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const hidden = screen.getByText(/ECS 193, Winter and Spring 2023/i);
    expect(hidden).toBeInTheDocument();
    // fireEvent.click(button);
    // expect(hidden).toBe(<div class="hidden" data-testid="info"><p>created by Shuban Ranganath, Zhantong Qiu, Brinda Puri, and Sanskriti Jain</p><p>ECS 193, Winter and Spring 2023</p></div>);
    // expect(hidden.innerHTML).toBe("<p>created by Shuban Ranganath, Zhantong Qiu, Brinda Puri, and Sanskriti Jain</p><p>ECS 193, Winter and Spring 2023</p>");
});
