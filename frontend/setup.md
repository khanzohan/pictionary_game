# Quick Setup Guide

## Instant Setup (Copy & Paste)

```bash
# 1. Navigate to the project directory
cd pictionary-frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

## That's it! 🎉

The game will be available at `http://localhost:3000`

## What You Get

✅ **Full Drawing Canvas** - Color palette, brush sizes, clear function  
✅ **Word Bank** - 80+ carefully selected Pictionary words  
✅ **Timer System** - 60-second rounds with visual countdown  
✅ **Score Tracking** - Points system with player leaderboard  
✅ **Mobile Support** - Touch drawing on smartphones/tablets  
✅ **Modern UI** - Beautiful, responsive design  

## Game Features

- **2+ Players**: Take turns drawing and guessing
- **Auto Turn System**: Automatically switches between players
- **Word Categories**: Animals, objects, food, actions, sports, nature, emotions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **No Backend Required**: Pure frontend application

## Controls

### For the Drawer:
- Select colors from the palette
- Adjust brush size with +/- buttons
- Clear canvas to start over
- Watch the timer!

### For Guessers:
- Type your guess in the input field
- Press Enter or click "Guess"
- Earn 10 points for correct answers

## Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- --port 3001
```

**Dependencies issues?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Need to reset everything?**
```bash
git clean -fdx
npm install
```

Enjoy your Pictionary game! 🎨🎮 