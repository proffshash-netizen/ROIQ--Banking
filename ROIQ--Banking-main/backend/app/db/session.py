"""ROIQ Banking Platform - Database Session & Engine Configuration.

Supports both PostgreSQL (production) and SQLite (development/testing)
with thread-safe connection pooling and automatic schema initialization.
"""

import os
from typing import Generator
from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker

from .models import Base
from ..config.settings import settings


def get_normalized_database_url() -> str:
    db_url = settings.database_url or os.getenv("DATABASE_URL")
    if not db_url:
        # Development default SQLite database stored locally
        return "sqlite:///./roiq_banking.db"

    # Normalize Postgres URLs from postgresql:// to postgresql+psycopg:// if needed
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql+psycopg://", 1)
    elif db_url.startswith("postgresql://") and not db_url.startswith("postgresql+"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)

    return db_url


DATABASE_URL = get_normalized_database_url()

# Configure engine arguments based on dialect
connect_args = {}
if "sqlite" in DATABASE_URL:
    connect_args["check_same_thread"] = False

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    echo=settings.debug,
)

# Enable foreign keys for SQLite
if "sqlite" in DATABASE_URL:
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a managed SQLAlchemy database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Creates database tables and seeds initial companies if empty."""
    Base.metadata.create_all(bind=engine)
