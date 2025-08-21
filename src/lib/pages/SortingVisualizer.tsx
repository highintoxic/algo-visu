import { useState, useCallback, useEffect, useRef } from 'react';

import { Button } from '../components/Button';
import { Slider } from '../components/Slider';
import { AlgorithmExplanation } from '../components/AlgorithmExplanation';
import { BarVisualizer } from '../components/BarVisualizer';
import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort, heapSort, radixSort, pancakeSort, stoogeSort } from '../utils/sorting';
import { startAudioContext, playSound, setSoundType, SOUND_TYPES } from '../utils/sound';
import { useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ALGORITHMS = ['bubble', 'selection', 'insertion', 'merge', 'quick','heap','radix','pancake','stooge'];
const DISTRIBUTIONS = ['random', 'nearlySorted', 'reversed', 'fewUnique'];
const MIN_ARRAY_SIZE = 10;
const MIN_BAR_WIDTH = 4; // px, must match BarVisualizer

// Dynamically calculate max array size based on window width
function getMaxArraySize() {
  if (typeof window !== 'undefined') {
    const maxWidth = Math.min(window.innerWidth, 1000); // match BarVisualizer container
    return Math.floor(maxWidth / MIN_BAR_WIDTH);
  }
  return 100;
}
const MIN_SPEED = 1;
const MAX_SPEED = 1000;

export function SortingVisualizer() {
  const [maxArraySize, setMaxArraySize] = useState(getMaxArraySize());
  const [mode, setMode] = useState<'light' | 'dark'>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState(Math.floor(getMaxArraySize() / 2));
  const [speed, setSpeed] = useState(100);
  const [soundType, setSoundTypeState] = useState('sine');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  const [isSorting, setIsSorting] = useState(false);
  const [distribution, setDistribution] = useState('random');
  const stopSortingRef = useRef(false);

  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [pivotIndex, setPivotIndex] = useState(-1);

  const generateNewArray = useCallback(() => {
    if (isSorting) return;
    setComparingIndices([]); setSwappingIndices([]); setSortedIndices([]); setPivotIndex(-1);
    let newArray = Array.from({ length: arraySize }, (_, i) => i + 5);
    switch (distribution) {
      case 'nearlySorted':
        for (let i = 0; i < Math.floor(arraySize / 10); i++) {
          const idx1 = Math.floor(Math.random() * arraySize);
          const idx2 = Math.floor(Math.random() * arraySize);
          [newArray[idx1], newArray[idx2]] = [newArray[idx2], newArray[idx1]];
        }
        break;
      case 'reversed':
        newArray.reverse();
        break;
      case 'fewUnique':
        const uniqueCount = Math.max(5, Math.floor(arraySize / 10));
        newArray = newArray.map(() => Math.floor(Math.random() * uniqueCount) * 10 + 5);
        break;
      case 'random':
      default:
        newArray.sort(() => Math.random() - 0.5);
        break;
    }
    setArray(newArray.map(val => Math.floor(val / (arraySize + 5) * 95) + 5));
  }, [arraySize, isSorting, distribution]);

  useEffect(() => { generateNewArray(); }, [generateNewArray, arraySize, distribution]);
  // Update max array size on window resize
  useEffect(() => {
    const handleResize = () => setMaxArraySize(getMaxArraySize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const sleep = (): Promise<void> => new Promise(resolve => setTimeout(resolve, Math.max(0, 1010 - speed)));

  const handleSizeChange = (_: any, v: number | number[]) => setArraySize(Number(v));
  const handleSpeedChange = (_: any, v: number | number[]) => setSpeed(Number(v));
  const handleSoundTypeChange = (newSoundType: string) => {
    if (!isSorting) {
      setSoundTypeState(newSoundType);
      setSoundType(newSoundType);
    }
  };
  const handleAlgorithmChange = (algo: string) => !isSorting && setSelectedAlgorithm(algo);
  const handleDistributionChange = (dist: string) => !isSorting && setDistribution(dist);
  const handleStop = () => stopSortingRef.current = true;

  const handleSort = async () => {
    if (isSorting) return;
    await startAudioContext();
    setSoundType(soundType); // Set the current sound type when starting audio
    stopSortingRef.current = false; setIsSorting(true);
    setComparingIndices([]); setSwappingIndices([]); setSortedIndices([]); setPivotIndex(-1);
    const helpers = {
      setArray,
      setComparingIndices,
      setSwappingIndices,
      setSortedIndices,
      playSound,
      sleep,
      stopSortingRef
    };
    const arrCopy = [...array];
    if (selectedAlgorithm === 'bubble') await bubbleSort(arrCopy, helpers);
    else if (selectedAlgorithm === 'selection') await selectionSort(arrCopy, helpers);
    else if (selectedAlgorithm === 'insertion') await insertionSort(arrCopy, helpers);
    else if (selectedAlgorithm === 'merge') await mergeSort(arrCopy, helpers);
    else if (selectedAlgorithm === 'quick') await quickSort(arrCopy, helpers);
    else if (selectedAlgorithm === 'heap') await heapSort(arrCopy, helpers);
    else if (selectedAlgorithm === 'stooge') await stoogeSort(arrCopy, helpers);
    else if (selectedAlgorithm === 'pancake') await pancakeSort(arrCopy, helpers);
    else if (selectedAlgorithm === 'radix') await radixSort(arrCopy, helpers);
    if (!stopSortingRef.current) {
      for (let i = 0; i < array.length; i++) {
        if (stopSortingRef.current) break;
        setSortedIndices(prev => [...prev, i]);
        await sleep();
      }
    }
    setIsSorting(false);
  };

  const getBarColor = (index: number) =>
    sortedIndices.includes(index) ? '#4caf50' :
    pivotIndex === index ? '#9c27b0' :
    swappingIndices.includes(index) ? '#f44336' :
    comparingIndices.includes(index) ? '#ffeb3b' :
    '#3f51b5';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        style={{
          minHeight: '100vh',
          width: '100vw',
          background: theme.palette.background.default,
          color: theme.palette.text.primary,
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr auto',
          gap: '2px',
          padding: '16px',
        }}
      >
        {/* Header with theme toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: '2.5rem', margin: 0 }}>Sorting Algorithm Visualizer</h1>
            <p style={{ margin: '8px 0 0 0', color: theme.palette.text.secondary }}>Watch and listen to sorting algorithms in action!</p>
          </div>
          <IconButton onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </div>

        {/* Visualizer Section */}
        <div 
          style={{ 
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
            borderRadius: '12px',
            padding: '2px',
            border: `1px solid ${mode === 'dark' ? '#333' : '#e0e0e0'}`,
            boxShadow: mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <BarVisualizer 
            array={array} 
            getBarColor={getBarColor} 
            swappingIndices={swappingIndices}
          />
        </div>

        {/* Spacer for flex growth */}
        <div style={{ minHeight: '2px' }} />

        {/* Controls Section - Grid Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '10px',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {/* Main Controls Box */}
          <div
            style={{
              backgroundColor: mode === 'dark' ? '#1e1e1e' : '#f9f9f9',
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${mode === 'dark' ? '#333' : '#e0e0e0'}`,
              boxShadow: mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 600 }}>Controls</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button onClick={generateNewArray} disabled={isSorting}>Generate New Array</Button>
                {isSorting ? <Button onClick={handleStop} color="error">Stop</Button> : <Button onClick={handleSort} color="success">Sort!</Button>}
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Slider label="Size" min={MIN_ARRAY_SIZE} max={maxArraySize} value={arraySize} onChange={handleSizeChange} disabled={isSorting} />
                <Slider label="Speed" min={MIN_SPEED} max={MAX_SPEED} value={speed} onChange={handleSpeedChange} disabled={isSorting} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Sound:</label>
                <select
                  value={soundType}
                  onChange={(e) => handleSoundTypeChange(e.target.value)}
                  disabled={isSorting}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: mode === 'dark' ? '#424242' : '#fff',
                    color: mode === 'dark' ? '#fff' : '#000',
                    fontSize: '0.875rem',
                    minWidth: '140px'
                  }}
                >
                  {Object.entries(SOUND_TYPES).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Algorithms Box */}
          <div
            style={{
              backgroundColor: mode === 'dark' ? '#1e1e1e' : '#f9f9f9',
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${mode === 'dark' ? '#333' : '#e0e0e0'}`,
              boxShadow: mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 600 }}>Algorithms</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {ALGORITHMS.map(algo => 
                <Button 
                  key={algo} 
                  onClick={() => handleAlgorithmChange(algo)} 
                  disabled={isSorting} 
                  color={selectedAlgorithm === algo ? 'primary' : 'inherit'}
                  style={{ textTransform: 'capitalize' }}
                >
                  {algo}
                </Button>
              )}
            </div>
          </div>

          {/* Data Distributions Box */}
          <div
            style={{
              backgroundColor: mode === 'dark' ? '#1e1e1e' : '#f9f9f9',
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${mode === 'dark' ? '#333' : '#e0e0e0'}`,
              boxShadow: mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 600 }}>Data Distributions</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {DISTRIBUTIONS.map(dist => 
                <Button 
                  key={dist} 
                  onClick={() => handleDistributionChange(dist)} 
                  disabled={isSorting} 
                  color={distribution === dist ? 'primary' : 'inherit'}
                  style={{ textTransform: 'capitalize' }}
                >
                  {dist === 'nearlySorted' ? 'Nearly Sorted' : 
                   dist === 'fewUnique' ? 'Few Unique' : dist}
                </Button>
              )}
            </div>
          </div>

          {/* Algorithm Explanation Box */}
          <div
            style={{
              backgroundColor: mode === 'dark' ? '#1e1e1e' : '#f9f9f9',
              borderRadius: '12px',
              padding: '2px',
              border: `1px solid ${mode === 'dark' ? '#333' : '#e0e0e0'}`,
              boxShadow: mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
              gridColumn: '1 / -1', // Span across all columns
            }}
          >
            <AlgorithmExplanation algorithm={selectedAlgorithm} />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default SortingVisualizer;
