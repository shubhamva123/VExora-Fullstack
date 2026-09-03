class Group(Base):
    __tablename__ = "groups"

    group_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    created_by = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False,
    )
    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    creator = relationship(
        "User",
        foreign_keys=[created_by],
    )