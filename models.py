from pydantic import BaseModel
from typing import Optional

class Zoo(BaseModel):
  id:  Optional[int] = None
  name: str

class Animal(BaseModel):
  id: Optional[int] = None
  species: str
  name: str
  age: int
  last_time_food_served: Optional[str] = None

class Enclosure(BaseModel):
  id: int
  name: str
  type: str

class Worker(BaseModel):
  id: int
  name: str
  role: str
class AnimalEnclosureAssignment(BaseModel):
  id: int
  animal_id: int
  enclosure_id: int

class Talk(BaseModel):
  id:int
  animal_id: int
  worker_id: int