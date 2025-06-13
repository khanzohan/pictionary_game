import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Trash2, Palette, Minus, Plus, Eraser } from 'lucide-react';
import { GameState, DrawingPoint, DrawingStroke } from '../types/game';
import { webSocketService, DrawingMessage, ClearCanvasMessage } from '../services/api';

interface DrawingCanvasProps {
  gameState: GameState;
  isDrawer: boolean;
  onClearCanvas?: () => void;
}

export interface DrawingCanvasRef {
  clearCanvas: () => void;
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(({ gameState, isDrawer, onClearCanvas }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<DrawingPoint[]>([]);
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentWidth, setCurrentWidth] = useState(3);
  const [isErasing, setIsErasing] = useState(false);

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'
  ];

  const clearCanvas = useCallback(() => {
    setStrokes([]);
    setCurrentStroke([]);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Send clear canvas message via WebSocket if we're the drawer
    if (isDrawer && webSocketService.isConnected()) {
      const message: ClearCanvasMessage = {
        type: 'clear_canvas'
      };
      webSocketService.send(message);
    }
    
    if (onClearCanvas) {
      onClearCanvas();
    }
  }, [onClearCanvas, isDrawer]);

  // Expose clearCanvas function through ref
  useImperativeHandle(ref, () => ({
    clearCanvas
  }), [clearCanvas]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    const handleDrawingMessage = (message: any) => {
      if (message.type === 'drawing' && message.stroke) {
        // Add the received stroke to our local strokes
        const newStroke: DrawingStroke = {
          points: message.stroke.points,
          color: message.stroke.color,
          width: message.stroke.width
        };
        setStrokes(prev => [...prev, newStroke]);
      }
    };

    const handleClearCanvas = (message: any) => {
      if (message.type === 'clear_canvas') {
        // Clear canvas when receiving clear message from other players
        setStrokes([]);
        setCurrentStroke([]);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    };

    // Subscribe to WebSocket events
    webSocketService.on('drawing', handleDrawingMessage);
    webSocketService.on('clear_canvas', handleClearCanvas);

    return () => {
      // Unsubscribe from WebSocket events
      webSocketService.off('drawing', handleDrawingMessage);
      webSocketService.off('clear_canvas', handleClearCanvas);
    };
  }, []);

  const getCanvasCoordinates = useCallback((e: MouseEvent | TouchEvent): DrawingPoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }, []);

  const eraseAtPoint = useCallback((point: DrawingPoint, eraseRadius: number = 20) => {
    setStrokes(prevStrokes => {
      return prevStrokes.filter(stroke => {
        // Check if any point in the stroke is within the erase radius
        return !stroke.points.some(strokePoint => {
          const distance = Math.sqrt(
            Math.pow(strokePoint.x - point.x, 2) + Math.pow(strokePoint.y - point.y, 2)
          );
          return distance <= eraseRadius;
        });
      });
    });
  }, []);

  const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDrawer || gameState !== 'playing') return;
    
    const point = getCanvasCoordinates(e);
    
    if (isErasing) {
      eraseAtPoint(point);
    } else {
      setIsDrawing(true);
      setCurrentStroke([point]);
    }
  }, [isDrawer, gameState, getCanvasCoordinates, isErasing, eraseAtPoint]);

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDrawer || gameState !== 'playing') return;

    const point = getCanvasCoordinates(e);
    
    if (isErasing) {
      eraseAtPoint(point);
    } else if (isDrawing) {
      setCurrentStroke(prev => [...prev, point]);
    }
  }, [isDrawing, isDrawer, gameState, getCanvasCoordinates, isErasing, eraseAtPoint]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing || isErasing) return;
    
    setIsDrawing(false);
    if (currentStroke.length > 0) {
      const newStroke: DrawingStroke = {
        points: currentStroke,
        color: currentColor,
        width: currentWidth
      };
      
      // Add stroke locally
      setStrokes(prev => [...prev, newStroke]);
      
      // Send stroke via WebSocket if we're the drawer
      if (isDrawer && webSocketService.isConnected()) {
        const message: DrawingMessage = {
          type: 'drawing',
          stroke: {
            points: currentStroke,
            color: currentColor,
            width: currentWidth
          }
        };
        webSocketService.send(message);
      }
    }
    setCurrentStroke([]);
  }, [isDrawing, isErasing, currentStroke, currentColor, currentWidth, isDrawer]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all completed strokes
    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });

    // Draw current stroke (only for the drawer)
    if (currentStroke.length > 1 && !isErasing && isDrawer) {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      currentStroke.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
  }, [strokes, currentStroke, currentColor, currentWidth, isErasing, isDrawer]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => startDrawing(e);
    const handleMouseMove = (e: MouseEvent) => draw(e);
    const handleMouseUp = () => stopDrawing();
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      startDrawing(e);
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      draw(e);
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      stopDrawing();
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startDrawing, draw, stopDrawing]);

  const handleColorSelect = (color: string) => {
    setCurrentColor(color);
    setIsErasing(false); // Exit erase mode when selecting a color
  };

  const toggleEraseMode = () => {
    setIsErasing(!isErasing);
  };

  return (
    <div className="space-y-4">
      {/* Drawing Tools */}
      {isDrawer && gameState === 'playing' && (
        <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
          {/* Color Palette */}
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-gray-600" />
            <div className="flex gap-1">
              {colors.map(color => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    currentColor === color && !isErasing ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
          </div>

          {/* Erase Button */}
          <button
            onClick={toggleEraseMode}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isErasing 
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Eraser className="w-4 h-4" />
            {isErasing ? 'Erasing' : 'Erase'}
          </button>

          {/* Brush Size - only show when not erasing */}
          {!isErasing && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentWidth(Math.max(1, currentWidth - 1))}
                className="p-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium w-8 text-center">{currentWidth}</span>
              <button
                onClick={() => setCurrentWidth(Math.min(20, currentWidth + 1))}
                className="p-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Clear Button */}
          <button
            onClick={clearCanvas}
            className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      )}

      {/* Canvas */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className={`w-full h-auto ${
            isDrawer && gameState === 'playing' 
              ? isErasing ? 'cursor-crosshair' : 'cursor-crosshair'
              : 'cursor-default'
          }`}
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Game State Messages */}
      {!isDrawer && (
        <p className="text-center text-gray-500 italic">
          {gameState === 'playing' ? 'Watch and guess what is being drawn!' : 'Waiting for game to start...'}
        </p>
      )}

      {isDrawer && gameState === 'waiting' && (
        <p className="text-center text-blue-600 font-medium">
          You're the drawer! Wait for the game to start.
        </p>
      )}

      {/* Tool Instructions */}
      {isDrawer && gameState === 'playing' && (
        <div className="text-center text-sm text-gray-600">
          {isErasing ? (
            <p>🧹 <strong>Erase mode:</strong> Click on drawings to remove them</p>
          ) : (
            <p>🎨 <strong>Draw mode:</strong> Select colors, adjust brush size, or use eraser</p>
          )}
        </div>
      )}
    </div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas; 