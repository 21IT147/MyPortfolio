import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ContactSection from '../components/ContactSection';

describe('ContactSection Component Tests', () => {
  it('renders contact form fields correctly', () => {
    render(<ContactSection />);
    expect(screen.getByPlaceholderText(/John Doe/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/john@example.com/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Write your message here.../i)).toBeDefined();
  });

  it('updates form inputs on user typing', () => {
    render(<ContactSection />);
    const nameInput = screen.getByPlaceholderText(/John Doe/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Alice Smith' } });
    expect(nameInput.value).toBe('Alice Smith');
  });
});
