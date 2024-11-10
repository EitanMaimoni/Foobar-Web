import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeContext } from '../themeContext/themeContext';
import SignUp from '../signUp/signUp';
import '@testing-library/jest-dom';

// Tests to verify SignUp component functionality
describe('SignUp Component', () => {

  // Define the mock theme context value
  const mockThemeContextValue = {
    theme: 'light',
    toggleTheme: jest.fn(),
  };

  // render the SignUp component
  beforeEach(() => {
    render(
      <BrowserRouter>
        <ThemeContext.Provider value={mockThemeContextValue}>
          <SignUp />
        </ThemeContext.Provider>
      </BrowserRouter>
    );
  });

  // Test to verify that the SignUp component works as expected
  test('alerts if no photo is selected on submission', () => {

    // Mock the global alert function
    global.alert = jest.fn();

    // Simulate entering user details
    fireEvent.change(screen.getByLabelText(/Enter User Name/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/Enter Nick Name/i), {
      target: { value: 'Alfredo' },
    });
    fireEvent.change(screen.getByLabelText(/Enter Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'password123' },
    });

    // Simulate submitting the form
    fireEvent.click(screen.getByText(/Submit/i));

    // Verify that the alert is displayed
    expect(global.alert).toHaveBeenCalledWith('Please select an image.');

    // Clear the mock
    global.alert.mockClear();

  });

  // Test to verify that the SignUp component works as expected
  test('alerts if passwords do not match', () => {

    // Mock the global alert function
    global.alert = jest.fn();

    // Simulate entering user details
    fireEvent.change(screen.getByLabelText(/Enter User Name/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/Enter NIck Name/i), {
      target: { value: 'Alfredo' },
    });
    fireEvent.change(screen.getByLabelText(/Enter Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'differentpassword' },
    });

    // Simulate submitting the form
    fireEvent.click(screen.getByText(/Submit/i));

    // Verify that the alert is displayed
    expect(global.alert).toHaveBeenCalledWith('Password and Confirm Password must be the same');

    // Clear the mock
    global.alert.mockClear();

  });
});
