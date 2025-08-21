import { Button as MuiButton } from '@mui/material';
import React from 'react';

export const Button = ({ children, ...props }: React.ComponentProps<typeof MuiButton>) => (
  <MuiButton variant="contained" color="primary" {...props}>{children}</MuiButton>
);
