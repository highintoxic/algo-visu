import { Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { ALGORITHM_EXPLANATIONS } from '@/lib/utils/algorithms';

export const AlgorithmExplanation = ({ algorithm }: { algorithm: string }) => {
  type AlgoKey = keyof typeof ALGORITHM_EXPLANATIONS;
  const data = ALGORITHM_EXPLANATIONS[algorithm as AlgoKey];
  if (!data) return null;
  return (
    <Paper elevation={2} sx={{p: 3, bgcolor: 'background.default' }}>
      <Typography variant="h5" color="primary" gutterBottom>{data.name}</Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>{data.description}</Typography>
      <Grid container spacing={2}>
        <Grid>
          <div>
            <Typography variant="subtitle2">Time Complexity</Typography>
            <Typography variant="body2">Best: {data.time.best}</Typography>
            <Typography variant="body2">Average: {data.time.average}</Typography>
            <Typography variant="body2">Worst: {data.time.worst}</Typography>
          </div>
        </Grid>
        <Grid>
          <div>
            <Typography variant="subtitle2">Space Complexity</Typography>
            <Typography variant="h6">{data.space}</Typography>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};
