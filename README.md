# 🌟 Cringe Horoscope

A modern React application that generates sarcastic and humorous horoscopes with customizable "cringe levels" - from gentle humor to hardcore sarcasm.

![React](https://img.shields.io/badge/React-19.x-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Features

### Core Functionality
- **🎭 Multi-Mode Generation**: Choose between Official, Roast, or Mix modes
- **🔥 Cringe Level Control**: 4-level slider from Gentle (😊) to Hardcore (🔥)
- **🎯 Deterministic Generation**: Reproducible results using seed-based PRNG
- **♈ Interactive Zodiac Selection**: Visual sign picker with emoji icons
- **🍀 Lucky Elements**: Dynamic lucky colors and numbers
- **📸 Image Export**: High-quality PNG/WebP export for social sharing

### Advanced Features
- **⚠️ Cringe Warning Modal**: Special YouTube video warning for maximum cringe level
- **🛠️ Development Mode**: API testing and debugging tools
- **🎨 Modern UI**: Glass morphism design with smooth animations
- **📱 Responsive Design**: Works seamlessly on desktop and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/cringe-horoscope.git
cd cringe-horoscope

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

## 📖 How to Use

1. **Select Your Zodiac Sign**: Choose from the interactive emoji sign picker
2. **Choose Day**: Pick Today or Tomorrow for your horoscope
3. **Select Mode**:
   - **Official**: Real horoscope data from Aztro API
   - **Roast**: Pure sarcastic content
   - **Mix**: Blend of official and sarcastic content
4. **Adjust Cringe Level**: Use the slider to control sarcasm intensity
5. **Generate**: Click "Generate My Cosmic Roast" 
6. **Export**: Save your horoscope as an image for sharing

### Cringe Levels
- **😊 Gentle**: Mild humor and light sarcasm
- **😏 Ironic**: Moderate irony and wit
- **😤 Sarcastic**: Heavy sarcasm and sass
- **🔥 Hardcore**: Maximum cringe with special warning modal

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for blazing-fast development
- **CSS Modules** for component-scoped styling
- **CSS Variables** for consistent theming

### State Management
- Custom React hooks pattern
- `useHoroscope` for API data management
- `useHoroscopeGenerator` for app state
- `useCringeWarning` for modal control

### External Integrations
- **Aztro API** for official horoscope data
- **html2canvas** for image generation
- **Crypto API** for random seed generation

### Development Tools
- **Vitest** for unit testing with 80+ comprehensive tests
- **React Testing Library** for component testing
- **ESLint** + **Prettier** for code quality
- **TypeScript** for type safety
- **Jest DOM** for enhanced testing assertions

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── HoroscopeControls.tsx    # Main control panel
│   ├── HoroscopeDisplay.tsx     # Result display
│   ├── CringeWarningModal.tsx   # Warning modal
│   ├── ExportButton.tsx         # Image export
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useHoroscope.ts         # API data management
│   ├── useHoroscopeGenerator.ts # App state
│   └── useCringeWarning.ts     # Modal control
├── services/           # Business logic
│   ├── aztroApi.ts            # API integration
│   ├── roastGenerator.ts      # Sarcasm generation
│   └── horoscopeComposer.ts   # Content composition
├── utils/              # Utility functions
│   ├── prng.ts               # Random generation
│   ├── colorUtils.ts         # Color processing
│   └── dateHelpers.ts        # Date utilities
├── styles/             # Global styles
├── types/              # TypeScript definitions
└── tests/              # Comprehensive test suite
    ├── GenerateButton.test.ts     # Button component tests
    ├── CringeSlider.test.ts       # Slider component tests
    ├── HoroscopeControls.test.ts  # Controls panel tests
    ├── HoroscopeDisplay.test.tsx  # Display component tests
    ├── LuckyElements.test.ts      # Lucky elements tests
    └── ExportButton.test.tsx      # Export functionality tests
```

## 🧪 Testing

The project includes a comprehensive test suite with **80+ tests** covering all major components:

### Test Coverage
- **Component Tests**: 6 test files covering all main UI components
- **Integration Tests**: Testing component interactions and state management
- **Accessibility Tests**: Ensuring proper ARIA attributes and keyboard navigation
- **Error Handling**: Testing edge cases and error scenarios
- **User Interactions**: Testing click events, keyboard inputs, and form submissions

### Test Files
```
tests/
├── GenerateButton.test.ts      # Main action button (16 tests)
├── CringeSlider.test.ts        # Cringe level slider (16 tests)
├── HoroscopeControls.test.ts   # Control panel (23 tests)
├── HoroscopeDisplay.test.tsx   # Results display (4 tests)
├── LuckyElements.test.ts       # Lucky colors/numbers (16 tests)
└── ExportButton.test.tsx       # Image export (5 tests)
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test tests/GenerateButton.test.ts

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Format code
npm run format
```

### Test Features
- **Mock Implementations**: Comprehensive mocking of external dependencies
- **Edge Case Testing**: Handling of zero values, missing data, and error states
- **Accessibility Testing**: Keyboard navigation and screen reader compatibility
- **Performance Testing**: Component rendering and state updates
- **Type Safety**: Full TypeScript coverage in test files

## 🏗️ Building for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

## 🎨 Development Features

### Development Mode Toggle
Switch between Production and Development modes using the toggle in the header:
- **Production**: Clean user interface
- **Development**: Access to testing tools and debugging components

### Testing Components
- **API Tester**: Test Aztro API integration
- **Determinism Tester**: Verify reproducible generation
- **Backend Tester**: Comprehensive API testing

### Content Generation System
- **Template-based Roasting**: Configurable sarcasm templates
- **Cringe Transformations**: Dynamic content modification
- **Seed-based PRNG**: Deterministic random generation using Mulberry32

## 🤖 AI-Assisted Development

This project was built entirely using **GitHub Copilot prompts**, showcasing modern AI-assisted development:

- **Architecture Planning**: AI-designed modular component structure
- **Component Development**: AI-generated React components with TypeScript
- **Business Logic**: AI-implemented content generation algorithms
- **Styling**: AI-created modern CSS with glass morphism design
- **Testing**: AI-written comprehensive test suites

### Development Methodology
- **Prompt-Driven**: Each feature built through conversational AI prompts
- **Iterative Refinement**: Continuous improvement through AI feedback
- **Best Practices**: AI-enforced modern React and TypeScript patterns
- **Code Quality**: AI-maintained consistency and clean architecture
- **Test-Driven Development**: AI-assisted creation of comprehensive test suites

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Aztro API** for providing official horoscope data
- **GitHub Copilot** for AI-assisted development throughout the project
- **React** and **TypeScript** communities for excellent tooling
- **Vite** for exceptional development experience

## 🔮 Future Enhancements

- [ ] Social media sharing integration
- [ ] Custom horoscope templates
- [ ] Multiple language support
- [ ] User preference persistence
- [ ] Advanced export options (PDF, different image formats)
- [ ] Horoscope history tracking
- [ ] End-to-end testing with Playwright or Cypress
- [ ] Performance testing and optimization
- [ ] Component visual regression testing

---

**Built with React, TypeScript, and a healthy dose of sarcasm** ✨

*This project demonstrates the power of AI-assisted development, showcasing how GitHub Copilot can be used to build complete, production-ready applications through intelligent prompting and iterative refinement.*
