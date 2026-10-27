"""Immutable Audit Trail Repository."""

from typing import Any, Optional
from sqlalchemy.orm import Session
from ..models import AuditLogModel


class AuditRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def log_event(
        self,
        action: str,
        officer: str,
        company_id: Optional[int] = None,
        thread_id: Optional[str] = None,
        previous_state: Optional[dict[str, Any]] = None,
        new_state: Optional[dict[str, Any]] = None,
        notes: Optional[str] = None,
        ip_address: Optional[str] = None,
    ) -> AuditLogModel:
        record = AuditLogModel(
            action=action,
            officer=officer,
            company_id=company_id,
            thread_id=thread_id,
            previous_state=previous_state,
            new_state=new_state,
            notes=notes,
            ip_address=ip_address,
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def list_logs_for_company(self, company_id: int) -> list[AuditLogModel]:
        return (
            self.db.query(AuditLogModel)
            .filter(AuditLogModel.company_id == company_id)
            .order_by(AuditLogModel.created_at.desc())
            .all()
        )

    def list_all_logs(self, limit: int = 100) -> list[AuditLogModel]:
        return (
            self.db.query(AuditLogModel)
            .order_by(AuditLogModel.created_at.desc())
            .limit(limit)
            .all()
        )
