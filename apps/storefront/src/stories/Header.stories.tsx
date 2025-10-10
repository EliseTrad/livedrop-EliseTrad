import type { Meta, StoryObj } from '@storybook/react'
import { Header } from '../components/organisms/Header'
import { BrowserRouter } from 'react-router-dom'

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithCartItems: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Header with items in cart (simulated)',
      },
    },
  },
}