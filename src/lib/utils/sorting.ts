// Sorting algorithms for the visualizer, refactored for modular use
// Each function receives: array, helpers (setArray, setComparingIndices, setSwappingIndices, setSortedIndices, setPivotIndex, playSound, sleep, stopSortingRef)
// All are async and mutate via helpers

type sortHelpers = {
  setArray: (arr: number[]) => void;
  setComparingIndices: (indices: number[]) => void;
  setSwappingIndices: (indices: number[]) => void;
  setSortedIndices: (fn: (prev: number[]) => number[]) => void;
  playSound: (value: number, type: string) => void;
  sleep: () => Promise<void>;
  stopSortingRef: React.MutableRefObject<boolean>;
};

export async function bubbleSort(arr: number[], helpers: sortHelpers) {
  const { setArray, setComparingIndices, setSwappingIndices, setSortedIndices, playSound, sleep, stopSortingRef } = helpers;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (stopSortingRef.current) return;
      setComparingIndices([j, j + 1]);
      playSound(arr[j], 'compare');
      await sleep();
      if (arr[j] > arr[j + 1]) {
        setSwappingIndices([j, j + 1]);
        playSound(arr[j+1], 'swap');
        await sleep();
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        setArray([...arr]);
        await sleep();
      }
      setComparingIndices([]);
      setSwappingIndices([]);
    }
    if (stopSortingRef.current) return;
    setSortedIndices((prev: number[]) => [...prev, arr.length - 1 - i]);
  }
  if (stopSortingRef.current) return;
  setSortedIndices((prev: number[]) => [...prev, 0]);
}


export async function selectionSort(arr: number[], helpers: sortHelpers) {
  const { setArray, setComparingIndices, setSwappingIndices, setSortedIndices, playSound, sleep, stopSortingRef } = helpers;
  for (let i = 0; i < arr.length; i++) {
    if (stopSortingRef.current) return;
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (stopSortingRef.current) return;
      setComparingIndices([minIndex, j]);
      playSound(arr[j], 'compare');
      await sleep();
      if (arr[j] < arr[minIndex]) minIndex = j;
    }
    setComparingIndices([]);
    setSwappingIndices([i, minIndex]);
    playSound(arr[minIndex], 'swap');
    await sleep();
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    setArray([...arr]);
    setSwappingIndices([]);
    setSortedIndices((prev: number[]) => [...prev, i]);
  }
}

// Quick Sort
export async function quickSort(arr: number[], helpers: sortHelpers) {
  const { setArray, setComparingIndices, setSwappingIndices, setSortedIndices, playSound, sleep, stopSortingRef } = helpers;
  async function quickSortHelper(arr: number[], low: number, high: number) {
    if (stopSortingRef.current || low >= high) return;
    let pi = await partition(arr, low, high);
    if (pi === -1) return;
    await quickSortHelper(arr, low, pi - 1);
    await quickSortHelper(arr, pi + 1, high);
  }
  async function partition(arr: number[], low: number, high: number) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (stopSortingRef.current) return -1;
      setComparingIndices([j, high]);
      playSound(arr[j], 'compare');
      await sleep();
      if (arr[j] < pivot) {
        i++;
        setSwappingIndices([i, j]);
        playSound(arr[j], 'swap');
        await sleep();
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        setSwappingIndices([]);
      }
    }
    setComparingIndices([]);
    if (stopSortingRef.current) return -1;
    setSwappingIndices([i + 1, high]);
    playSound(arr[high], 'swap');
    await sleep();
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    setSwappingIndices([]);
    setSortedIndices((prev: number[]) => [...prev, i + 1]);
    return i + 1;
  }
  await quickSortHelper(arr, 0, arr.length - 1);
}

// Heap Sort
export async function heapSort(arr: number[], helpers: sortHelpers) {
  const { setArray, setComparingIndices, setSwappingIndices, setSortedIndices, playSound, sleep, stopSortingRef } = helpers;
  const n = arr.length;
  async function heapify(arr: number[], n: number, i: number) {
    if (stopSortingRef.current) return;
    let largest = i, l = 2 * i + 1, r = 2 * i + 2;
    setComparingIndices([i, l, r].filter(idx => idx < n));
    playSound(arr[i], 'compare');
    await sleep();
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest !== i) {
      setSwappingIndices([i, largest]);
      playSound(arr[largest], 'swap');
      await sleep();
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setArray([...arr]);
      setSwappingIndices([]);
      await heapify(arr, n, largest);
    }
    setComparingIndices([]);
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    if (stopSortingRef.current) return;
    await heapify(arr, n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    if (stopSortingRef.current) return;
    setSwappingIndices([0, i]);
    playSound(arr[i], 'swap');
    await sleep();
    [arr[0], arr[i]] = [arr[i], arr[0]];
    setArray([...arr]);
    setSortedIndices((prev: number[]) => [...prev, i]);
    setSwappingIndices([]);
    await heapify(arr, i, 0);
  }
  setSortedIndices((prev: number[]) => [...prev, 0]);
}

// Radix Sort
export async function radixSort(arr: number[], helpers: sortHelpers) {
  const { setArray, setComparingIndices, setSwappingIndices, setSortedIndices, playSound, sleep, stopSortingRef } = helpers;
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    if (stopSortingRef.current) return;
    await countingSortForRadix(arr, exp);
    setArray([...arr]);
  }
  // Mark all elements as sorted after radix sort is complete
  setSortedIndices(() => [...Array.from({length: arr.length}, (_, idx) => idx)]);
  async function countingSortForRadix(arr: number[], exp: number) {
    const n = arr.length;
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);
    for (let i = 0; i < n; i++) {
      if (stopSortingRef.current) return;
      setComparingIndices([i]);
      playSound(arr[i], 'compare');
      await sleep();
      count[Math.floor(arr[i] / exp) % 10]++;
    }
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = n - 1; i >= 0; i--) {
      if (stopSortingRef.current) return;
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
    }
    for (let i = 0; i < n; i++) {
      if (stopSortingRef.current) return;
      arr[i] = output[i];
      setArray([...arr]);
      setSwappingIndices([i]);
      playSound(arr[i], 'swap');
      await sleep();
    }
    setComparingIndices([]);
    setSwappingIndices([]);
  }
}

// Pancake Sort
export async function pancakeSort(arr: number[], helpers: sortHelpers) {
  const { setArray, setComparingIndices, setSwappingIndices, setSortedIndices, playSound, sleep, stopSortingRef } = helpers;
  for (let n = arr.length; n > 1; n--) {
    if (stopSortingRef.current) return;
    let maxIdx = 0;
    for (let i = 1; i < n; i++) {
      if (stopSortingRef.current) return;
      setComparingIndices([i, maxIdx]);
      playSound(arr[i], 'compare');
      await sleep();
      if (arr[i] > arr[maxIdx]) maxIdx = i;
    }
    setComparingIndices([]);
    if (maxIdx !== n - 1) {
      if (maxIdx > 0) await flip(arr, maxIdx);
      if (stopSortingRef.current) return;
      await flip(arr, n - 1);
    }
    setSortedIndices((prev: number[]) => [...prev, n - 1]);
  }
  async function flip(arr: number[], i: number) {
    let start = 0;
    while (start < i) {
      if (stopSortingRef.current) return;
      setSwappingIndices([start, i]);
      playSound(arr[i], 'swap');
      await sleep();
      [arr[start], arr[i]] = [arr[i], arr[start]];
      setArray([...arr]);
      start++;
      i--;
    }
    setSwappingIndices([]);
  }
}

// Insertion Sort
export async function insertionSort(arr: number[], helpers: sortHelpers) {
  const { setArray, setComparingIndices, setSwappingIndices, setSortedIndices, playSound, sleep, stopSortingRef } = helpers;
  
  // Mark the first element as sorted
  setSortedIndices((prev: number[]) => [...prev, 0]);
  
  for (let i = 1; i < arr.length; i++) {
    if (stopSortingRef.current) return;
    
    let key = arr[i];
    let j = i - 1;
    
    // Highlight the current element being inserted
    setComparingIndices([i]);
    playSound(arr[i], 'compare');
    await sleep();
    
    // Move elements that are greater than key one position ahead
    while (j >= 0 && arr[j] > key) {
      if (stopSortingRef.current) return;
      
      setComparingIndices([j, j + 1]);
      playSound(arr[j], 'compare');
      await sleep();
      
      // Shift element to the right
      arr[j + 1] = arr[j];
      setArray([...arr]);
      setSwappingIndices([j, j + 1]);
      playSound(arr[j], 'swap');
      await sleep();
      setSwappingIndices([]);
      
      j--;
    }
    
    // Insert the key at its correct position
    arr[j + 1] = key;
    setArray([...arr]);
    setComparingIndices([]);
    
    // Mark the newly inserted element as sorted
    setSortedIndices((prev: number[]) => [...prev, i]);
    await sleep();
  }
}

// Stooge Sort
export async function stoogeSort(arr: number[], helpers: sortHelpers) {
  const { setArray, setComparingIndices, setSwappingIndices, setSortedIndices, playSound, sleep, stopSortingRef } = helpers;
  async function stoogeSortHelper(arr: number[], l: number, h: number) {
    if (stopSortingRef.current || l >= h) return;
    setComparingIndices([l, h]);
    playSound(arr[l], 'compare');
    await sleep();
    if (arr[l] > arr[h]) {
      setSwappingIndices([l, h]);
      playSound(arr[h], 'swap');
      await sleep();
      [arr[l], arr[h]] = [arr[h], arr[l]];
      setArray([...arr]);
      setSwappingIndices([]);
    }
    setComparingIndices([]);
    if (h - l + 1 > 2) {
      let t = Math.floor((h - l + 1) / 3);
      await stoogeSortHelper(arr, l, h - t);
      await stoogeSortHelper(arr, l + t, h);
      await stoogeSortHelper(arr, l, h - t);
    }
  }
  await stoogeSortHelper(arr, 0, arr.length - 1);
  // Mark all elements as sorted after stooge sort is complete
  setSortedIndices(() => [...Array.from({length: arr.length}, (_, idx) => idx)]);
}

export async function mergeSort(arr: number[], helpers: sortHelpers) {
  const { setArray, setComparingIndices, setSwappingIndices, setSortedIndices, playSound, sleep, stopSortingRef } = helpers;
  async function mergeSortHelper(arr: number[], l: number, r: number) {
    if (stopSortingRef.current || l >= r) return;
    const m = l + Math.floor((r - l) / 2);
    await mergeSortHelper(arr, l, m);
    await mergeSortHelper(arr, m + 1, r);
    await merge(arr, l, m, r);
  }
  async function merge(arr: number[], l: number, m: number, r: number) {
    let L = arr.slice(l, m + 1), R = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < L.length && j < R.length) {
      if (stopSortingRef.current) return;
      setComparingIndices([l + i, m + 1 + j]);
      playSound(arr[k], 'compare');
      await sleep();
      if (L[i] <= R[j]) arr[k++] = L[i++];
      else arr[k++] = R[j++];
      setArray([...arr]);
      setSwappingIndices([k - 1]);
      await sleep();
    }
    while (i < L.length) {
      if (stopSortingRef.current) return;
      arr[k++] = L[i++];
      setArray([...arr]);
      await sleep();
    }
    while (j < R.length) {
      if (stopSortingRef.current) return;
      arr[k++] = R[j++];
      setArray([...arr]);
      await sleep();
    }
    setComparingIndices([]);
    setSwappingIndices([]);
  }
  await mergeSortHelper(arr, 0, arr.length - 1);
  // Mark all elements as sorted after merge sort is complete
  setSortedIndices(() => [...Array.from({length: arr.length}, (_, idx) => idx)]);
}
