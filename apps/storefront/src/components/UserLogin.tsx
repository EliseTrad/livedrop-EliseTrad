
import React, { useState } from 'react';
import { useUser } from '@/lib/user-context';

export const UserLogin: React.FC = () => {
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { setCustomer } = useUser();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
			setError('Please enter a valid email address.');
			return;
		}
		setError('');
		setLoading(true);
		try {
			// Fetch customer profile by email
			const res = await fetch(`/api/customers?email=${encodeURIComponent(email)}`);
			if (!res.ok) {
				setError('No customer found with that email.');
				setLoading(false);
				return;
			}
			const customer = await res.json();
			setCustomer(customer);
		} catch (err) {
			setError('Failed to log in. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
			<label htmlFor="email">Enter your email:</label>
			<input
				id="email"
				type="email"
				value={email}
				onChange={e => setEmail(e.target.value)}
				required
				style={{ width: '100%', padding: '8px', margin: '8px 0' }}
				disabled={loading}
			/>
			{error && <div style={{ color: 'red' }}>{error}</div>}
			<button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Continue'}</button>
		</form>
	);
};
