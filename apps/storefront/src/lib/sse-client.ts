
// SSE connection handler for order tracking
export class OrderStatusSSE {
	private eventSource: EventSource | null = null;
	private listeners: ((data: any) => void)[] = [];

	connect(orderId: string) {
		if (this.eventSource) this.disconnect();
		this.eventSource = new EventSource(`/api/orders/${orderId}/stream`);
		this.eventSource.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				this.listeners.forEach((cb) => cb(data));
			} catch (e) {}
		};
		this.eventSource.onerror = () => {
			this.disconnect();
		};
	}

	onUpdate(cb: (data: any) => void) {
		this.listeners.push(cb);
	}

	disconnect() {
		if (this.eventSource) {
			this.eventSource.close();
			this.eventSource = null;
		}
		this.listeners = [];
	}
}
