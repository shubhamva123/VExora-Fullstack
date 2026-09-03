from sqlalchemy.orm import Session

from app.database.models import Notification


def get_notifications(
    db: Session,
    user_id: int,
):
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )


def mark_as_read(
    db: Session,
    notification: Notification,
):
    notification.is_read = True

    db.commit()
    db.refresh(notification)

    return notification