
import React, { useEffect, useState } from 'react';
import { OrderStatusSSE } from '../lib/sse-client';

interface OrderTrackingProps {
	orderId: string;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId }) => {
	const [status, setStatus] = useState('');
	const [carrier, setCarrier] = useState('');
	const [eta, setEta] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const sse = new OrderStatusSSE();
		sse.onUpdate((data) => {
			setStatus(data.status);
			setCarrier(data.carrier);
			setEta(data.eta);
			setLoading(false);
		});
		sse.connect(orderId);
		return () => {
			sse.disconnect();
		};
	}, [orderId]);

	return (
		<div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
			<h3>Order Tracking</h3>
			{loading ? (
				<div>Loading status...</div>
			) : (
				<>
					<div>Status: <strong>{status}</strong></div>
					<div>Carrier: {carrier}</div>
					<div>Estimated Delivery: {eta}</div>
				</>
			)}
		</div>
	);
};
