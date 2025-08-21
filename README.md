# 🔢 Algorithm Visualizer

An interactive web application that visualizes sorting algorithms with beautiful animations and audio feedback. Watch and listen to algorithms like Bubble Sort, Quick Sort, Merge Sort, and more as they sort data in real-time.

![Algorithm Visualizer Demo](https://img.shields.io/badge/Demo-Live-brightgreen?style=for-the-badge)

## ✨ Features

### 🎬 **Visual Animations**
- **Smooth bar animations** with CSS transitions
- **Real-time sorting visualization** showing comparisons, swaps, and sorted elements
- **Color-coded feedback** for different operations
- **Responsive design** that works on all screen sizes

### 🎵 **Audio Feedback** 
- **Multiple sound types**: Sine, Square, Sawtooth, Triangle waves
- **Frequency mapping** - higher values produce higher pitches
- **Silent mode** option for quiet environments
- **Audio context management** for optimal performance

### 🧮 **Supported Algorithms**
- **Bubble Sort** - Simple comparison-based sorting
- **Selection Sort** - Find minimum and swap
- **Insertion Sort** - Build sorted array one element at a time
- **Merge Sort** - Divide and conquer approach
- **Quick Sort** - Efficient pivot-based sorting
- **Heap Sort** - Binary heap-based sorting
- **Radix Sort** - Non-comparative integer sorting
- **Pancake Sort** - Flip-based sorting algorithm
- **Stooge Sort** - Recursive divide-and-conquer

### ⚙️ **Customization Options**
- **Array size control** (10-250 elements)
- **Speed adjustment** (1-1000 speed levels)
- **Data distributions**: Random, Nearly Sorted, Reversed, Few Unique values
- **Dark/Light theme** support
- **Real-time algorithm explanations**

## 🚀 Getting Started

### Prerequisites
- Node.js (v22.16.x or higher)
- PNPM package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/highintoxic/algo-visu.git
cd algo-visu
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Start the development server**
```bash
pnpm dev
```

4. **Open your browser**
Navigate to `http://localhost:3000` to see the application.

## 🛠️ Built With

- **⚡ Vite** - Next generation frontend tooling
- **⚛️ React 18** - Modern React with hooks and concurrent features
- **🎨 Material-UI** - React component library for beautiful UI
- **🎵 Tone.js** - Web Audio framework for interactive audio
- **📱 TypeScript** - Type-safe JavaScript development
- **🎯 TanStack Router** - Type-safe router for React

## 📱 Usage

1. **Select an Algorithm** - Choose from 9 different sorting algorithms
2. **Customize Settings**:
   - Adjust array size (10-250 elements)
   - Set animation speed (1-1000)
   - Choose sound type or select "None" for silent mode
   - Pick data distribution pattern
3. **Generate Array** - Create a new random array to sort
4. **Start Sorting** - Watch the algorithm work with smooth animations
5. **Learn** - Read the algorithm explanations to understand how each one works

## 🎯 Educational Value

This visualizer is perfect for:
- **Students** learning about algorithms and data structures
- **Teachers** demonstrating sorting concepts in classrooms
- **Developers** refreshing their knowledge of classic algorithms
- **Anyone curious** about how computers sort data

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test         # Run tests
pnpm type:check   # TypeScript type checking
```

### Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── utils/         # Utility functions (algorithms, sound)
│   └── styles/        # Global styles
├── routes/            # TanStack Router routes
└── main.tsx          # Application entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by visualgo.net and other algorithm visualization tools
- Sound implementation inspired by web audio programming concepts
- UI design principles from Material Design guidelines

---

**Made with ❤️ by [highintoxic](https://github.com/highintoxic)**
