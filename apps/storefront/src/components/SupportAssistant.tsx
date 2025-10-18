
import React, { useState } from 'react';
import { SupportEngine } from '../assistant/engine';

const engine = new SupportEngine();

export const SupportAssistant: React.FC = () => {
	const [query, setQuery] = useState('');
	const [response, setResponse] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const res = await engine.processQuery(query);
		setResponse(res.answer);
		setLoading(false);
	};

	return (
		<div style={{ border: '1px solid #eee', padding: 16, borderRadius: 8, maxWidth: 500 }}>
			<h3>Support Assistant</h3>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={query}
					onChange={e => setQuery(e.target.value)}
					placeholder="Ask a question..."
					style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
				/>
				<button type="submit" disabled={loading}>Ask</button>
			</form>
			{loading && <div>Thinking...</div>}
			{response && <div style={{ marginTop: 12 }}><strong>Response:</strong> {response}</div>}
		</div>
	);
};
