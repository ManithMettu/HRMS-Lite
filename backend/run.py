#!/usr/bin/env python3
"""Entry point for running the FastAPI application."""

import uvicorn
import os

if __name__ == "__main__":
    # Load environment variables
    env = os.getenv("ENVIRONMENT", "development")
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "True") == "True"
    
    print(f"Starting HRMS API server...")
    print(f"Environment: {env}")
    print(f"Host: {host}")
    print(f"Port: {port}")
    print(f"Debug: {debug}")
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )
