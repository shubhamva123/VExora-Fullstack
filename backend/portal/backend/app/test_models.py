from app.database.models import User, Task, Note

print(User.__tablename__)
print(Task.__tablename__)
print(Note.__tablename__)

print("\n✅ Models loaded successfully")