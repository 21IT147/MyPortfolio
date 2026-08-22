import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import HeroSection from '../components/HeroSection';
import { ProfileInfo } from '../types';

const mockProfile: ProfileInfo = {
  fullName: "Keval Sheth",
  eyebrow: "ASSOCIATE JAVA DEVELOPER",
  title: "Building High-Performance Enterprise Backend Services",
  summary: "Software Engineer passionate about Java and Spring Boot.",
  aboutText: "Biography info",
  avatarUrl: "https://example.com/avatar.jpg",
  resumeUrl: "/resume.pdf",
  yearsExperience: 2,
  projectsCompleted: 12,
  technologiesMastered: 15,
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  email: "keval@example.com",
  location: "India"
};

describe('HeroSection Component Tests', () => {
  it('renders developer full name and title correctly', () => {
    render(<HeroSection profile={mockProfile} />);
    const nameElements = screen.getAllByText(/Keval Sheth/i);
    expect(nameElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/Building High-Performance Enterprise Backend Services/i)).toBeDefined();
  });

  it('renders experience counter badges', () => {
    render(<HeroSection profile={mockProfile} />);
    expect(screen.getByText(/2\+ Years/i)).toBeDefined();
    expect(screen.getByText(/12\+ Delivered/i)).toBeDefined();
  });
});
