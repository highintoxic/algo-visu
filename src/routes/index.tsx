import { createFileRoute } from '@tanstack/react-router'
import { SortingVisualizer } from '@/lib/pages/SortingVisualizer';

export const Route = createFileRoute('/')({
  component: SortingVisualizer
})
