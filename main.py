from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from db import create_zoos, create_workers, create_enclosures, create_animals, create_animal_enclosure_assignments,createInteractions
from models import Zoo, Worker, Enclosure, Animal
import crud

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


create_zoos()
create_workers()
create_enclosures()
create_animals()
create_animal_enclosure_assignments()
createInteractions()

@app.get("/")
async def root():
  return crud.getHTMLConnection()

@app.get("/zoo/all")
async def getAllZoos():
  """
  return: list -> List of all zoo data
  params: None
  description: Returns all information about all zoos
  """
  try:
    return crud.getAll()
  except Exception as e:
    raise HTTPException(status_code=404, detail=str(e))

@app.get("/zoo")
async def getZoo():
  """
  return: dict -> Complete zoo data
  params: None
  description: Returns all information about the zoo
  """
  try:
    return crud.getZoo()
  except Exception as e:
    raise HTTPException(status_code=404, detail=str(e))

@app.get("/enclosure/{zoo_id}/{enclosure_id}")
async def getEnclosure(zoo_id: int, enclosure_id: int):
  """
  return: dict -> Specific enclosure details
  params: zoo_id -> int, zoo ID; enclosure_id -> int, enclosure ID
  description: Retrieves information about a specific enclosure
  """
  try:
    return crud.getEnclosure(zoo_id, enclosure_id)
  except Exception as e:
    raise HTTPException(status_code=404, detail=str(e))

@app.get("/hungry/{zoo_id}")
async def getHungryAnimals(zoo_id:int):
  """
  return: list -> List of hungry animals
  params: None
  description: Returns all animals that have not been served food
  """
  try:
    return crud.getHungryAnimals(zoo_id)
  except Exception as e:
    raise HTTPException(status_code=404, detail=str(e))


@app.get("/animals/all")
async def getAnimals():
  """
  return: list -> List of all animals
  params: zoo_id -> int, zoo ID
  description: Returns all animals in a specific zoo
  """
  try:
    return crud.getAllAnimals()
  except Exception as e:
    raise HTTPException(status_code=404, detail=str(e))

@app.post("/zoo", response_model=Zoo)
async def addZoo(zoo: Zoo):
  """
  return: Zoo -> Created zoo
  params: zoo -> Zoo, the zoo object
  description: Adds a new zoo to the database
  """
  try:
    return crud.addZoo(zoo)
  except Exception as e:
    raise HTTPException(status_code=404, detail=str(e))

@app.post("/animals/{zoo_id}", response_model=Animal)
async def addAnimal(animal: Animal, zoo_id: int):
  """
  return: Animals -> Created animal
  params: zoo_id -> int, zoo ID; animal -> Animals, the animal object
  description: Add a new animal to a specific zoo
  """
  try:
    return crud.addAnimal(animal, zoo_id)
  except Exception as e:
    raise HTTPException(status_code=404, detail=str(e))

@app.post("/worker/{zoo_id}", response_model=Worker)
async def addWorker(worker: Worker, zoo_id: int):
  """
  return: Worker -> Created worker
  params: zoo_id -> int, zoo ID; worker -> Worker, the worker object
  description: Add a new worker to a specific zoo
  """
  try:
    return crud.addWorker(worker, zoo_id)
  except Exception as e:
    raise HTTPException(status_code=404, detail=str(e))
  

@app.post("/enclosure/{zoo_id}", response_model=Enclosure)
async def addEnclosure(enclosure: Enclosure, zoo_id: int):
  """
  return: Enclosure -> Created enclosure
  params: zoo_id -> int, zoo ID; enclosure -> Enclosure, the enclosure object
  description: Add a new enclosure to a specific zoo
  """
  try:
    return crud.addEnclosure(enclosure, zoo_id)
  except Exception as e:
    raise HTTPException(status_code=404, detail=str(e))

@app.post("/talk/{zoo_id}/{worker_id}/{animal_id}")
async def talk(zoo_id: int, worker_id: int, animal_id: int):
  """
  return: dict -> Interaction message
  params: zoo_id -> int, zoo ID; worker_id -> int, worker ID; animal_id -> int, animal ID
  description: Simulates a conversation between a worker and an animal
  """
  try:
    return crud.talk(zoo_id, worker_id, animal_id)
  except Exception as e:
    raise HTTPException(status_code=404, detail=str(e)) 


@app.put("/assign_animals/{zoo_id}/{animal_id}/{enclosure_id}")
async def assignAnimals(zoo_id: int, animal_id: int, enclosure_id: int):
  """
  return: dict -> Updated enclosure
  params: zoo_id -> int, zoo ID; animal_id -> int, animal ID; enclosure_id -> int, enclosure ID
  description: Assigns an animal to a specific enclosure
  """
  try:
    return crud.addAnimalToEnclosure(zoo_id, animal_id, enclosure_id)
  except Exception as e:
    raise HTTPException(status_code=404, detail=str(e))



@app.delete("/zoo/{zoo_id}")
async def deleteZoo(zoo_id: int):
  """
  return: dict -> Zoo deletion message
  params: zoo_id -> int, zoo ID
  description: Deletes a specific zoo
  """
  try:
    return crud.removeZoo(zoo_id)
  except Exception as e:
    raise HTTPException(status_code=404, detail=str(e))


@app.delete("/animals/{animal_id}") 
async def deleteAnimal(animal_id: int):
  """
  return: dict -> Animal deletion message
  params: animal_id -> int, animal ID
  description: Deletes a specific animal
  """
  try:
    return crud.removeAnimal(animal_id)
  except Exception as e:
    raise HTTPException(status_code=404, detail=str(e))
