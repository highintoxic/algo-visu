import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- Tone.js for Sound ---
// IMPORTANT: You need to add this script tag to your public/index.html file
// <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js"></script>

// --- Sound Engine ---
let synth;
const startAudioContext = async () => {
    if (typeof window.Tone === 'undefined') {
        console.error("Tone.js is not loaded.");
        return;
    }
    if (window.Tone.context.state !== 'running') {
        await window.Tone.start();
    }
    if (!synth) {
        synth = new window.Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.5 }
        }).toDestination();
    }
};
const mapValueToFrequency = (value) => (value / 100) * (800 - 150) + 150;
const playSound = (value, type) => {
    if (synth) {
        const freq = mapValueToFrequency(value);
        synth.triggerAttackRelease(freq * (type === 'swap' ? 1.2 : 1), '16n');
    }
};

// --- Algorithm Data ---
const ALGORITHM_EXPLANATIONS = {
    bubble: { name: 'Bubble Sort', description: 'Compares adjacent elements and swaps them if they are in the wrong order. This process is repeated until the list is sorted, with the largest elements "bubbling" to the end.', time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)' },
    selection: { name: 'Selection Sort', description: 'Repeatedly finds the minimum element from the unsorted part of the array and puts it at the beginning. It maintains a sorted and an unsorted subarray.', time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)' },
    insertion: { name: 'Insertion Sort', description: 'Builds the final sorted array one item at a time. It iterates through the input elements and inserts each element into its correct position in the sorted part of the array.', time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)' },
    merge: { name: 'Merge Sort', description: 'A divide-and-conquer algorithm that divides the array into two halves, recursively sorts them, and then merges the two sorted halves.', time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(n)' },
    quick: { name: 'Quick Sort', description: 'A divide-and-conquer algorithm that picks a \'pivot\' element and partitions the other elements into two sub-arrays, according to whether they are less than or greater than the pivot.', time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' }, space: 'O(log n)' },
    heap: { name: 'Heap Sort', description: 'A comparison-based algorithm that uses a binary heap data structure. It first builds a max-heap from the input data, then repeatedly extracts the maximum element from the heap and places it at the end of the sorted array.', time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(1)' },
    radix: { name: 'Radix Sort', description: 'A non-comparative integer sorting algorithm that sorts data with integer keys by grouping keys by the individual digits which share the same significant position and value.', time: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)' }, space: 'O(n+k)' },
    pancake: { name: 'Pancake Sort', description: 'The only operation is to "flip" a prefix of the array. It works by finding the largest unsorted element, flipping it to the front, and then flipping it to its correct final position.', time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)' },
    stooge: { name: 'Stooge Sort', description: 'A recursive sorting algorithm with a high time complexity. It works by recursively sorting the first 2/3, then the last 2/3, and then the first 2/3 again to ensure the array is sorted.', time: { best: 'O(n^2.71)', average: 'O(n^2.71)', worst: 'O(n^2.71)' }, space: 'O(log n)' },
};

// --- UI Components (Tailwind CSS) ---
const Card = ({ children, className = '' }) => <div className={`bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`p-6 text-center ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }) => <h1 className={`text-3xl md:text-4xl font-bold text-indigo-400 ${className}`}>{children}</h1>;
const CardDescription = ({ children, className = '' }) => <p className={`text-gray-400 mt-2 ${className}`}>{children}</p>;
const CardContent = ({ children, className = '' }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;

const Button = ({ children, onClick, disabled = false, variant = 'primary', className = '' }) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = { primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500', secondary: 'bg-gray-700 hover:bg-indigo-600 text-white focus:ring-indigo-500', success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 text-lg px-6', danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 text-lg px-6', active: 'bg-indigo-600 text-white' };
    return <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variants[variant]} ${className}`}>{children}</button>;
};

const Slider = ({ label, min, max, value, onChange, disabled = false }) => (
    <div className="flex-1 text-center">
        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input type="range" min={min} max={max} value={value} onChange={onChange} disabled={disabled} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed" />
    </div>
);

const AlgorithmExplanation = ({ algorithm }) => {
    const data = ALGORITHM_EXPLANATIONS[algorithm];
    if (!data) return null;
    return (
        <div className="mt-6 bg-black/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-indigo-400 mb-2">{data.name}</h2>
            <p className="text-gray-300 mb-4">{data.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div>
                    <h3 className="font-semibold text-gray-400">Time Complexity</h3>
                    <p className="text-sm text-gray-200">Best: {data.time.best}</p>
                    <p className="text-sm text-gray-200">Average: {data.time.average}</p>
                    <p className="text-sm text-gray-200">Worst: {data.time.worst}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-400">Space Complexity</h3>
                    <p className="text-2xl font-mono text-gray-200 mt-2">{data.space}</p>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function App() {
    const [array, setArray] = useState([]);
    const [arraySize, setArraySize] = useState(50);
    const [speed, setSpeed] = useState(100);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
    const [isSorting, setIsSorting] = useState(false);
    const [distribution, setDistribution] = useState('random');
    const stopSortingRef = useRef(false);

    const [comparingIndices, setComparingIndices] = useState([]);
    const [swappingIndices, setSwappingIndices] = useState([]);
    const [sortedIndices, setSortedIndices] = useState([]);
    const [pivotIndex, setPivotIndex] = useState(-1);

    const ALGORITHMS = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap', 'radix', 'pancake', 'stooge'];
    const DISTRIBUTIONS = ['random', 'nearlySorted', 'reversed', 'fewUnique'];
    const MIN_ARRAY_SIZE = 10;
    const MAX_ARRAY_SIZE = 150;
    const MIN_SPEED = 1;
    const MAX_SPEED = 200;

    const generateNewArray = useCallback(() => {
        if (isSorting) return;
        setComparingIndices([]); setSwappingIndices([]); setSortedIndices([]); setPivotIndex(-1);
        let newArray = Array.from({ length: arraySize }, (_, i) => i + 5);
        switch (distribution) {
            case 'nearlySorted':
                for (let i = 0; i < Math.floor(arraySize / 10); i++) { const idx1 = Math.floor(Math.random() * arraySize); const idx2 = Math.floor(Math.random() * arraySize);[newArray[idx1], newArray[idx2]] = [newArray[idx2], newArray[idx1]]; }
                break;
            case 'reversed': newArray.reverse(); break;
            case 'fewUnique': const uniqueCount = Math.max(5, Math.floor(arraySize / 10)); newArray = newArray.map(() => Math.floor(Math.random() * uniqueCount) * 10 + 5); break;
            case 'random': default: newArray.sort(() => Math.random() - 0.5); break;
        }
        setArray(newArray.map(val => Math.floor(val / (arraySize + 5) * 95) + 5));
    }, [arraySize, isSorting, distribution]);

    useEffect(() => { generateNewArray(); }, [generateNewArray, arraySize, distribution]);
    const sleep = () => new Promise(resolve => setTimeout(resolve, MAX_SPEED + 10 - speed));

    const handleSizeChange = e => setArraySize(Number(e.target.value));
    const handleSpeedChange = e => setSpeed(Number(e.target.value));
    const handleAlgorithmChange = algo => !isSorting && setSelectedAlgorithm(algo);
    const handleDistributionChange = dist => !isSorting && setDistribution(dist);
    const handleStop = () => stopSortingRef.current = true;

    const handleSort = async () => {
        if (isSorting) return;
        await startAudioContext();
        stopSortingRef.current = false; setIsSorting(true);
        setComparingIndices([]); setSwappingIndices([]); setSortedIndices([]); setPivotIndex(-1);
        const sortFunction = getSortFunction(selectedAlgorithm);
        await sortFunction();
        if (!stopSortingRef.current) { for (let i = 0; i < array.length; i++) { if (stopSortingRef.current) break; setSortedIndices(prev => [...prev, i]); await sleep(); } }
        setIsSorting(false);
    };
    
    const getSortFunction = algo => ({ bubble: bubbleSort, selection: selectionSort, insertion: insertionSort, merge: mergeSort, quick: quickSort, heap: heapSort, radix: radixSort, pancake: pancakeSort, stooge: stoogeSort }[algo] || (() => { throw new Error('Unknown algorithm') }));

    // --- Sorting Algorithms (Logic is unchanged) ---
    async function bubbleSort() { const arr = [...array]; for (let i = 0; i < arr.length - 1; i++) { for (let j = 0; j < arr.length - i - 1; j++) { if (stopSortingRef.current) return; setComparingIndices([j, j + 1]); playSound(arr[j], 'compare'); await sleep(); if (arr[j] > arr[j + 1]) { setSwappingIndices([j, j + 1]); playSound(arr[j+1], 'swap'); await sleep(); [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; setArray([...arr]); await sleep(); } setComparingIndices([]); setSwappingIndices([]); } if (stopSortingRef.current) return; setSortedIndices(prev => [...prev, arr.length - 1 - i]); } if (stopSortingRef.current) return; setSortedIndices(prev => [...prev, 0]); }
    async function selectionSort() { const arr = [...array]; for (let i = 0; i < arr.length; i++) { if (stopSortingRef.current) return; let minIndex = i; for (let j = i + 1; j < arr.length; j++) { if (stopSortingRef.current) return; setComparingIndices([minIndex, j]); playSound(arr[j], 'compare'); await sleep(); if (arr[j] < arr[minIndex]) minIndex = j; } setComparingIndices([]); setSwappingIndices([i, minIndex]); playSound(arr[minIndex], 'swap'); await sleep(); [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]; setArray([...arr]); setSwappingIndices([]); setSortedIndices(prev => [...prev, i]); } }
    async function insertionSort() { const arr = [...array]; setSortedIndices([0]); for (let i = 1; i < arr.length; i++) { if (stopSortingRef.current) return; let key = arr[i], j = i - 1; setComparingIndices([i]); playSound(key, 'compare'); await sleep(); while (j >= 0 && arr[j] > key) { if (stopSortingRef.current) return; setComparingIndices([j, j+1]); setSwappingIndices([j, j+1]); playSound(arr[j], 'swap'); await sleep(); arr[j + 1] = arr[j]; setArray([...arr]); setSwappingIndices([]); j--; } arr[j + 1] = key; setArray([...arr]); setComparingIndices([]); setSortedIndices(prev => [...prev, i]); } }
    async function mergeSort() { const arr = [...array]; await mergeSortHelper(arr, 0, arr.length - 1); }
    async function mergeSortHelper(arr, l, r) { if (stopSortingRef.current || l >= r) return; const m = l + Math.floor((r - l) / 2); await mergeSortHelper(arr, l, m); await mergeSortHelper(arr, m + 1, r); await merge(arr, l, m, r); }
    async function merge(arr, l, m, r) { let L = arr.slice(l, m + 1), R = arr.slice(m + 1, r + 1); let i = 0, j = 0, k = l; while (i < L.length && j < R.length) { if (stopSortingRef.current) return; setComparingIndices([l + i, m + 1 + j]); playSound(arr[k], 'compare'); await sleep(); if (L[i] <= R[j]) arr[k++] = L[i++]; else arr[k++] = R[j++]; setArray([...arr]); setSwappingIndices([k - 1]); await sleep(); } while (i < L.length) { if (stopSortingRef.current) return; arr[k++] = L[i++]; setArray([...arr]); await sleep(); } while (j < R.length) { if (stopSortingRef.current) return; arr[k++] = R[j++]; setArray([...arr]); await sleep(); } setComparingIndices([]); setSwappingIndices([]); }
    async function quickSort() { const arr = [...array]; await quickSortHelper(arr, 0, arr.length - 1); if (stopSortingRef.current) return; setPivotIndex(-1); }
    async function quickSortHelper(arr, low, high) { if (stopSortingRef.current || low >= high) { if(low === high) setSortedIndices(prev => [...prev, low]); return; } let pi = await partition(arr, low, high); if (pi === -1) return; await quickSortHelper(arr, low, pi - 1); await quickSortHelper(arr, pi + 1, high); }
    async function partition(arr, low, high) { let pivot = arr[high]; setPivotIndex(high); let i = low - 1; for (let j = low; j < high; j++) { if (stopSortingRef.current) return -1; setComparingIndices([j, high]); playSound(arr[j], 'compare'); await sleep(); if (arr[j] < pivot) { i++; setSwappingIndices([i, j]); playSound(arr[j], 'swap'); await sleep(); [arr[i], arr[j]] = [arr[j], arr[i]]; setArray([...arr]); setSwappingIndices([]); } } setComparingIndices([]); if (stopSortingRef.current) return -1; setSwappingIndices([i + 1, high]); playSound(arr[high], 'swap'); await sleep(); [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; setArray([...arr]); setSwappingIndices([]); setPivotIndex(-1); setSortedIndices(prev => [...prev, i + 1]); return i + 1; }
    async function heapSort() { const arr = [...array]; const n = arr.length; for (let i = Math.floor(n / 2) - 1; i >= 0; i--) { if (stopSortingRef.current) return; await heapify(arr, n, i); } for (let i = n - 1; i > 0; i--) { if (stopSortingRef.current) return; setSwappingIndices([0, i]); playSound(arr[i], 'swap'); await sleep(); [arr[0], arr[i]] = [arr[i], arr[0]]; setArray([...arr]); setSortedIndices(prev => [...prev, i]); setSwappingIndices([]); await heapify(arr, i, 0); } if (stopSortingRef.current) return; setSortedIndices(prev => [...prev, 0]); }
    async function heapify(arr, n, i) { if (stopSortingRef.current) return; let largest = i, l = 2 * i + 1, r = 2 * i + 2; setComparingIndices([i, l, r].filter(idx => idx < n)); playSound(arr[i], 'compare'); await sleep(); if (l < n && arr[l] > arr[largest]) largest = l; if (r < n && arr[r] > arr[largest]) largest = r; if (largest !== i) { setSwappingIndices([i, largest]); playSound(arr[largest], 'swap'); await sleep(); [arr[i], arr[largest]] = [arr[largest], arr[i]]; setArray([...arr]); setSwappingIndices([]); await heapify(arr, n, largest); } setComparingIndices([]); }
    async function radixSort() { let arr = [...array]; const max = Math.max(...arr); for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) { if (stopSortingRef.current) return; await countingSortForRadix(arr, exp); arr = [...array]; } }
    async function countingSortForRadix(arr, exp) { const n = arr.length; const output = new Array(n).fill(0); const count = new Array(10).fill(0); for (let i = 0; i < n; i++) { if (stopSortingRef.current) return; setComparingIndices([i]); playSound(arr[i], 'compare'); await sleep(); count[Math.floor(arr[i] / exp) % 10]++; } for (let i = 1; i < 10; i++) count[i] += count[i - 1]; for (let i = n - 1; i >= 0; i--) { if (stopSortingRef.current) return; const digit = Math.floor(arr[i] / exp) % 10; output[count[digit] - 1] = arr[i]; count[digit]--; } for (let i = 0; i < n; i++) { if (stopSortingRef.current) return; arr[i] = output[i]; setArray([...arr]); setSwappingIndices([i]); playSound(arr[i], 'swap'); await sleep(); } setComparingIndices([]); setSwappingIndices([]); }
    async function pancakeSort() { const arr = [...array]; for (let n = arr.length; n > 1; n--) { if (stopSortingRef.current) return; let maxIdx = 0; for (let i = 1; i < n; i++) { if (stopSortingRef.current) return; setComparingIndices([i, maxIdx]); playSound(arr[i], 'compare'); await sleep(); if (arr[i] > arr[maxIdx]) maxIdx = i; } setComparingIndices([]); if (maxIdx !== n - 1) { if (maxIdx > 0) await flip(arr, maxIdx); if (stopSortingRef.current) return; await flip(arr, n - 1); } if (stopSortingRef.current) return; setSortedIndices(prev => [...prev, n - 1]); } }
    async function flip(arr, i) { let start = 0; while (start < i) { if (stopSortingRef.current) return; setSwappingIndices([start, i]); playSound(arr[i], 'swap'); await sleep(); [arr[start], arr[i]] = [arr[i], arr[start]]; setArray([...arr]); start++; i--; } setSwappingIndices([]); }
    async function stoogeSort() { const arr = [...array]; await stoogeSortHelper(arr, 0, arr.length - 1); }
    async function stoogeSortHelper(arr, l, h) { if (stopSortingRef.current || l >= h) return; setComparingIndices([l, h]); playSound(arr[l], 'compare'); await sleep(); if (arr[l] > arr[h]) { setSwappingIndices([l, h]); playSound(arr[h], 'swap'); await sleep(); [arr[l], arr[h]] = [arr[h], arr[l]]; setArray([...arr]); setSwappingIndices([]); } setComparingIndices([]); if (h - l + 1 > 2) { let t = Math.floor((h - l + 1) / 3); await stoogeSortHelper(arr, l, h - t); await stoogeSortHelper(arr, l + t, h); await stoogeSortHelper(arr, l, h - t); } }

    const getBarColor = index => sortedIndices.includes(index) ? 'bg-green-500' : pivotIndex === index ? 'bg-purple-500' : swappingIndices.includes(index) ? 'bg-red-500' : comparingIndices.includes(index) ? 'bg-yellow-400' : 'bg-indigo-500';

    return (
        <div className="bg-black text-gray-100 flex flex-col items-center justify-center min-h-screen p-4 font-sans">
            <Card className="w-full max-w-7xl mx-auto">
                <CardHeader>
                    <CardTitle>Sorting Algorithm Visualizer</CardTitle>
                    <CardDescription>Watch and listen to sorting algorithms in action!</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col xl:flex-row items-center justify-between gap-4 mb-4 p-4 bg-gray-900/50 rounded-lg">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <Button onClick={generateNewArray} disabled={isSorting}>Generate New Array</Button>
                            <div className="h-8 w-px bg-gray-600 hidden md:block mx-2"></div>
                            {isSorting ? <Button onClick={handleStop} variant="danger">Stop</Button> : <Button onClick={handleSort} variant="success">Sort!</Button>}
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                            <Slider label="Size" min={MIN_ARRAY_SIZE} max={MAX_ARRAY_SIZE} value={arraySize} onChange={handleSizeChange} disabled={isSorting} />
                            <Slider label="Speed" min={MIN_SPEED} max={MAX_SPEED} value={speed} onChange={handleSpeedChange} disabled={isSorting} />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-2 p-4 bg-gray-900/50 rounded-lg">
                        <div className="text-sm font-medium text-gray-300 mr-2 shrink-0">Algorithms:</div>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {ALGORITHMS.map(algo => <Button key={algo} onClick={() => handleAlgorithmChange(algo)} disabled={isSorting} variant={selectedAlgorithm === algo ? 'active' : 'secondary'} className="capitalize text-xs px-2 py-1">{algo}</Button>)}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 p-4 bg-gray-900/50 rounded-lg">
                        <div className="text-sm font-medium text-gray-300 mr-2 shrink-0">Initial Array:</div>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {DISTRIBUTIONS.map(dist => <Button key={dist} onClick={() => handleDistributionChange(dist)} disabled={isSorting} variant={distribution === dist ? 'active' : 'secondary'} className="capitalize text-xs px-2 py-1">{dist}</Button>)}
                        </div>
                    </div>

                    <div className="w-full h-80 md:h-96 bg-gray-900/70 rounded-lg flex justify-center items-end p-2 gap-px shadow-inner">
                        {array.map((value, index) => <div key={index} className={`bar w-full transition-colors duration-100 ${getBarColor(index)}`} style={{ height: `${value}%` }}></div>)}
                    </div>
                    <AlgorithmExplanation algorithm={selectedAlgorithm} />
                </CardContent>
            </Card>
        </div>
    );
}
