import { Slider as MuiSlider, Typography } from '@mui/material';

export const Slider = ({ label, value, min, max, onChange, disabled }: { label: string; value: number; min: number; max: number; onChange: (e: any, v: number | number[]) => void; disabled?: boolean }) => (
  <div style={{ width: 180, margin: '0 1rem' }}>
    <Typography variant="body2" color="textSecondary">{label}</Typography>
    <MuiSlider value={value} min={min} max={max} onChange={onChange} disabled={disabled} size="small" />
  </div>
);
