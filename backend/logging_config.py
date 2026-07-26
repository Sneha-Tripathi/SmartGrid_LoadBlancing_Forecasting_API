"""
Logging Configuration for Smart Grid Load Balancing API

Configures:
- File handler -> logs/app.log
- Console handler -> stdout
- Proper log levels (INFO, WARNING, ERROR)
- Structured format with timestamp, level, and message
"""

import logging
import sys
from pathlib import Path

LOG_DIR = Path(__file__).resolve().parent / "logs"
LOG_DIR.mkdir(exist_ok=True)

LOG_FILE = LOG_DIR / "app.log"
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


def setup_logger(name: str = "smart_grid") -> logging.Logger:
    """
    Configure and return a logger instance.

    Creates both a file handler (logs/app.log) and a console handler
    (stdout) with proper formatting and log levels.

    Args:
        name: Logger name, defaults to "smart_grid"

    Returns:
        Configured Logger instance
    """
    logger = logging.getLogger(name)

    # Prevent duplicate handlers on repeated calls
    if logger.handlers:
        return logger

    logger.setLevel(logging.INFO)

    # --- File Handler (logs/app.log) ---
    file_handler = logging.FileHandler(LOG_FILE, encoding="utf-8")
    file_handler.setLevel(logging.INFO)
    file_formatter = logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT)
    file_handler.setFormatter(file_formatter)
    logger.addHandler(file_handler)

    # --- Console Handler (stdout) ---
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_formatter = logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT)
    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)

    return logger


# Create default module-level logger
logger = setup_logger()
