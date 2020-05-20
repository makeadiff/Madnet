import React from 'react';
import { render } from '@testing-library/react';
import Login from '../Login';

test("Login page renders correctly", async () => {
    const { findByText } = render(<Login />);
    await findByText('Login to MADNet');
});
