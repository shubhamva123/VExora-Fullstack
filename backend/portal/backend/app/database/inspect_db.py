from sqlalchemy import create_engine, inspect

from app.config import settings

engine = create_engine(settings.DATABASE_URL)
inspector = inspect(engine)

print("=" * 60)
print("DATABASE INSPECTION")
print("=" * 60)

tables = inspector.get_table_names()

print(f"\nFound {len(tables)} tables:\n")

for table in tables:
    print(f"📌 TABLE: {table}")

    print("Columns:")
    for column in inspector.get_columns(table):
        print(
            f"   {column['name']:<25} "
            f"{str(column['type']):<20} "
            f"NULL={column['nullable']}"
        )

    pk = inspector.get_pk_constraint(table)
    print(f"Primary Key: {pk['constrained_columns']}")

    fks = inspector.get_foreign_keys(table)

    if fks:
        print("Foreign Keys:")
        for fk in fks:
            print(
                f"   {fk['constrained_columns']} "
                f"-> {fk['referred_table']} "
                f"{fk['referred_columns']}"
            )

    print("-" * 60)