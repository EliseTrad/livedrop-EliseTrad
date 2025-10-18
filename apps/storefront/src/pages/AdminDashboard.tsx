
import React, { useEffect, useState } from 'react';

interface Metrics {
	totalRevenue: number;
	totalOrders: number;
	avgOrderValue: number;
	ordersByStatus: Record<string, number>;
}

export const AdminDashboard: React.FC = () => {
	const [metrics, setMetrics] = useState<Metrics | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchMetrics() {
			setLoading(true);
			try {
				const res = await fetch('/api/dashboard/business-metrics');
				const data = await res.json();
				setMetrics(data);
			} catch {
				setMetrics(null);
			}
			setLoading(false);
		}
		fetchMetrics();
	}, []);

	return (
		<div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
			<h2>Admin Dashboard</h2>
			{loading && <div>Loading metrics...</div>}
			{metrics && (
				<>
					<div><strong>Total Revenue:</strong> ${metrics.totalRevenue.toFixed(2)}</div>
					<div><strong>Total Orders:</strong> {metrics.totalOrders}</div>
					<div><strong>Average Order Value:</strong> ${metrics.avgOrderValue.toFixed(2)}</div>
					<div style={{ marginTop: 16 }}>
						<strong>Orders by Status:</strong>
						<ul>
							{Object.entries(metrics.ordersByStatus).map(([status, count]) => (
								<li key={status}>{status}: {count}</li>
							))}
						</ul>
					</div>
				</>
			)}
			{!loading && !metrics && <div>Failed to load metrics.</div>}
		</div>
	);
};
