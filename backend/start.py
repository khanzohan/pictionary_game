#!/usr/bin/env python3
"""
Pictionary Game Backend Startup Script
Provides easy development and production server startup options.
"""

import os
import sys
import uvicorn
from pathlib import Path

def start_development():
    """Start the development server with hot reload"""
    print("🚀 Starting Pictionary Backend in DEVELOPMENT mode...")
    print("📍 Server: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🔄 Hot reload: ENABLED")
    print("-" * 50)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

def start_production():
    """Start the production server"""
    print("🏭 Starting Pictionary Backend in PRODUCTION mode...")
    print("📍 Server: http://localhost:8000")
    print("⚡ Workers: 4")
    print("🔄 Hot reload: DISABLED")
    print("-" * 50)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        workers=4,
        log_level="warning"
    )

def check_dependencies():
    """Check if all required dependencies are installed"""
    required_packages = [
        'fastapi',
        'uvicorn',
        'websockets',
        'pydantic'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("❌ Missing required packages:")
        for package in missing_packages:
            print(f"   - {package}")
        print("\n💡 Install missing packages with:")
        print("   pip install -r requirements.txt")
        return False
    
    print("✅ All dependencies are installed!")
    return True

def show_help():
    """Show available commands"""
    print("""
🎮 Pictionary Game Backend Startup Script

Available commands:
  python start.py dev        # Start development server (hot reload)
  python start.py prod       # Start production server (multi-worker)
  python start.py check      # Check dependencies
  python start.py help       # Show this help message

Development Features:
  ✅ Hot reload on file changes
  ✅ Detailed logging
  ✅ Interactive API documentation at /docs

Production Features:
  ✅ Multi-worker process
  ✅ Optimized performance
  ✅ Reduced logging

Quick Start:
  1. pip install -r requirements.txt
  2. python start.py dev
  3. Open http://localhost:8000/docs
    """)

def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        show_help()
        return
    
    command = sys.argv[1].lower()
    
    if command in ['dev', 'development']:
        if check_dependencies():
            start_development()
    
    elif command in ['prod', 'production']:
        if check_dependencies():
            start_production()
    
    elif command == 'check':
        check_dependencies()
    
    elif command in ['help', '--help', '-h']:
        show_help()
    
    else:
        print(f"❌ Unknown command: {command}")
        show_help()

if __name__ == "__main__":
    main() 