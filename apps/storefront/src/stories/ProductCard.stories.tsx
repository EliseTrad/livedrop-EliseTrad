import type { Meta, StoryObj } from '@storybook/react'
import { ProductCard } from '../components/molecules/ProductCard'

const meta: Meta<typeof ProductCard> = {
  title: 'Molecules/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const mockProduct = {
  id: '1',
  title: 'Premium Wireless Headphones',
  price: 299.99,
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  tags: ['electronics', 'audio', 'wireless'],
  stockQty: 15,
  description: 'High-quality wireless headphones with noise cancellation.',
}

export const Default: Story = {
  args: {
    product: mockProduct,
  },
}

export const OutOfStock: Story = {
  args: {
    product: {
      ...mockProduct,
      stockQty: 0,
    },
  },
}

export const LowStock: Story = {
  args: {
    product: {
      ...mockProduct,
      stockQty: 2,
    },
  },
}