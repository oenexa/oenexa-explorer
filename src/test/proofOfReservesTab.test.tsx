import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProofOfReservesTab } from '../components/ProofOfReservesTab.js';

describe('ProofOfReservesTab Component Suite', () => {
  it('renders solvency ratio and key reserve metrics correctly', () => {
    render(<ProofOfReservesTab />);
    expect(screen.getByText('On-Chain Proof of Reserves & Solvency')).toBeInTheDocument();
    expect(screen.getByText('103.11%')).toBeInTheDocument();
    expect(screen.getByText('$142,500,000.00')).toBeInTheDocument();
  });

  it('verifies user inclusion when account identifier is entered', () => {
    render(<ProofOfReservesTab />);
    const input = screen.getByPlaceholderText(/Enter User Account ID/);
    const button = screen.getByText('Verify Merkle Proof');

    fireEvent.change(input, { target: { value: 'usr_inst_123' } });
    fireEvent.click(button);

    expect(screen.getByText(/VERIFIED: Account leaf 'usr_inst_123'/)).toBeInTheDocument();
  });
});
