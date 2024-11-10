import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../login/login';
import User from '../signUp/user';
import { ThemeContext } from '../themeContext/themeContext';
import { AuthContext } from '../authContext/authContext';
import '@testing-library/jest-dom';

// Tests to verify Login component functionality
describe('Login Component', () => {

  // Define the mock theme context value
  const mockThemeContextValue = {
    theme: 'light',
    toggleTheme: jest.fn(),
  };

  const mockAuthContextValue = {
    isAuthenticated: false,
    login: jest.fn(),
    logout: jest.fn(),
  };

  // add admin user to allUsers array before any test
  beforeAll(() => {
    User.allUsers = [
      new User('admin', 'alfredo', 'admin', 'admin_image.jpg') // Ensure admin user is also included
    ];
  });

  // Test to verify that the login component works as expected
  test('Login functionality with both invalid and valid credentials', () => {

    // Test with Invalid Credentials
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContextValue}>
          <ThemeContext.Provider value={mockThemeContextValue}>
            <Login />
          </ThemeContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    // Test with Invalid username and password
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByText(/Login/i));

    // Verify that the error message is displayed
    expect(screen.getByText(/Invalid email or password. Please try again./i)).toBeInTheDocument();

    // Test with Valid username and password
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'admin' },
    });
    fireEvent.click(screen.getByText(/Login/i));

    // Verify that the user is logged in
    expect(screen.getByText(/Welcome, admin! You have successfully logged in./i)).toBeInTheDocument();
  });
});
