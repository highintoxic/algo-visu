
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

interface BarState {
  value: number;
  id: string;
}

export const BarVisualizer = ({ 
  array, 
  getBarColor,
  swappingIndices = []
}: { 
  array: number[]; 
  getBarColor: (index: number) => string;
  swappingIndices?: number[];
}) => {
  const [bars, setBars] = useState<BarState[]>([]);

  // Update bars when array changes, maintaining stable IDs for smooth animations
  useEffect(() => {
    setBars(array.map((value, index) => ({
      value,
      id: `bar-${value}-${index}` // Unique ID for each bar
    })));
  }, [array]);

  // Calculate bar width
  const barWidth = array.length > 0 ? Math.max(100 / array.length, 0.5) : 100;

  return (
    <Box 
      display="flex" 
      alignItems="flex-end" 
      height={320} 
      bgcolor="background.default" 
      borderRadius={2} 
      p={1} 
      boxShadow={2}
      position="relative"
      overflow="hidden"
    >
      {bars.map((bar, index) => {
        const isSwapping = swappingIndices.includes(index);
        
        return (
          <Box
            key={bar.id}
            sx={{
              width: `${barWidth}%`,
              minWidth: '3px',
              borderRadius: '4px 4px 0 0',
              height: `${bar.value}%`,
              background: getBarColor(index),
              transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
              position: 'relative',
              marginLeft: index === 0 ? 0 : '2px',
              transform: isSwapping ? 'scale(1.02) translateY(-2px)' : 'scale(1) translateY(0)',
              boxShadow: isSwapping ? 
                '0 4px 8px rgba(0,0,0,0.2)' : 
                '0 1px 3px rgba(0,0,0,0.1)',
              zIndex: isSwapping ? 10 : 1,
              '&::before': isSwapping ? {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2))',
                borderRadius: '4px 4px 0 0',
                animation: 'pulse 0.6s ease-in-out infinite alternate'
              } : {},
              '@keyframes pulse': {
                '0%': {
                  opacity: 0.7,
                },
                '100%': {
                  opacity: 1,
                }
              }
            }}
          />
        );
      })}
    </Box>
  );
};
