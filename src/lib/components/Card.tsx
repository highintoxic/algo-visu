import { Card as MuiCard, CardContent as MuiCardContent, CardHeader as MuiCardHeader, Typography } from '@mui/material';
import React from 'react';

export const Card = ({ children, ...props }: React.ComponentProps<typeof MuiCard>) => (
  <MuiCard elevation={6} {...props} sx={{ borderRadius: 3, bgcolor: 'background.paper' }}>{children}</MuiCard>
);

export const CardHeader = ({ title, subheader }: { title: string; subheader?: string }) => (
  <MuiCardHeader title={<Typography variant="h4" color="primary">{title}</Typography>} subheader={subheader} />
);

export const CardContent = ({ children }: { children: React.ReactNode }) => (
  <MuiCardContent>{children}</MuiCardContent>
);
