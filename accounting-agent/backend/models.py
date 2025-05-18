from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Client(Base):
    __tablename__ = 'clients'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    balance = Column(Float, default=0.0)
    invoices = relationship("Invoice", back_populates="client", cascade="all, delete-orphan")

class Invoice(Base):
    __tablename__ = 'invoices'
    id = Column(Integer, primary_key=True)
    amount = Column(Float, nullable=False)
    date = Column(Date)
    type = Column(String, nullable=False, default="income")  # 👈 חדש
    client_id = Column(Integer, ForeignKey('clients.id'))
    client = relationship("Client", back_populates="invoices")
