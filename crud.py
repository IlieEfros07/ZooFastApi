from db import get_db_connection
import sqlite3
from fastapi.responses import HTMLResponse , JSONResponse 
import models

def root():
  return {"message": "Zoo Management System"}

def getHTMLConnection():
  with open("index.html","r")as f:
    html_content=f.read()
  return HTMLResponse(content=html_content,status_code=200)




def getZoo():
  try:
    conn = get_db_connection()
    cursor = conn.cursor()
    zoo = cursor.execute("SELECT * FROM zoos").fetchall()
    conn.close()
    if zoo is None:
      raise Exception("Zoo not found")
    return zoo
  except Exception as e:
    raise Exception("Error in getZoo function: " + str(e))

def getEnclosures(zoo_id: int):
  try:
    conn = get_db_connection()
    cursor = conn.cursor()
    enclosures = cursor.execute("SELECT * FROM enclosures WHERE zoo_id = ?", (zoo_id,)).fetchall()
    conn.close()
    if enclosures is None:
      raise Exception("Enclosures not found")
    return enclosures
  except Exception as e:
    raise Exception("Error in getEnclosures function: " + str(e))

def addEnclosure(enclosure: models.Enclosure, zoo_id: int):
  try:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO enclosures (zoo_id, name, type) VALUES (?, ?, ?)", (zoo_id, enclosure.name, enclosure.type,))
    conn.commit()
    conn.close()
    return enclosure
  except Exception as e:
    raise Exception("Error in addEnclosure function: " + str(e))

def getHungryAnimals(zoo_id: int):
  try:
    conn = get_db_connection()
    cursor = conn.cursor()
    animals = cursor.execute("SELECT * FROM animals WHERE zoo_id = ? AND last_time_food_served IS NULL", (zoo_id,)).fetchall()
    conn.close()
    if animals is None:
      raise Exception("Hungry animals not found")
    return animals
  except Exception as e:
    raise Exception("Error in getHungryAnimals function: " + str(e))

def addZoo(zoo: models.Zoo):
  try:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO zoos (name) VALUES (?)", (zoo.name,))
    conn.commit()
    conn.close()
    return zoo
  except Exception as e:
    raise Exception("Error in addZoo function: " + str(e))

def addAnimal(animal: models.Animal, zoo_id: int):
  try:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO animals (zoo_id, species, name, age, last_time_food_served) VALUES (?, ?, ?, ?, ?)", (zoo_id, animal.species, animal.name, animal.age, animal.last_time_food_served,))
    conn.commit()
    conn.close()
    return animal
  except Exception as e:
    raise Exception("Error in addAnimal function: " + str(e))

def addWorker(worker: models.Worker, zoo_id: int):
  try:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO workers (zoo_id, name, role) VALUES (?, ?, ?)", (zoo_id, worker.name, worker.role,))
    conn.commit()
    conn.close()
    return worker
  except Exception as e:
    raise Exception("Error in addWorker function: " + str(e))
  
def addAnimalToEnclosure(zoo_id: int, animal_id: int, enclosure_id: int):
  try:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO animal_enclosure_assignments (zoo_id, animal_id, enclosure_id) VALUES (?, ?, ?)", (zoo_id, animal_id, enclosure_id,))
    conn.commit()
    conn.close()
    return {"message": "Animal added to enclosure successfully"}
  except Exception as e:
    raise Exception("Error in addAnimalToEnclosure function: " + str(e))


def talk(zoo_id: int, worker_id: int, animal_id: int):
  try:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO interactions (zoo_id, worker_id, animal_id) VALUES (?, ?, ?)", (zoo_id, worker_id, animal_id,))
    conn.commit()
    conn.close()
    return {"message": "Conversation started successfully"}
  except Exception as e:
    raise Exception("Error in talk function: " + str(e))
  

def removeZoo(zoo_id: int):
  try:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM zoos WHERE id = ?", (zoo_id,))
    conn.commit()
    conn.close()
    return {"message": "Zoo removed successfully"}
  except Exception as e:
    raise Exception("Error in removeZoo function: " + str(e))

def removeAnimal(animal_id: int):
  try:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM animals WHERE id = ?", (animal_id,))
    conn.commit()
    conn.close()
    return {"message": "Animal removed successfully"}
  except Exception as e:
    raise Exception("Error in removeAnimal function: " + str(e))


def getAllAnimals():
  try:
    conn = get_db_connection()
    cursor = conn.cursor()
    animals = cursor.execute("SELECT * FROM animals").fetchall()
    conn.close()
    if animals is None:
      raise Exception("Animals not found")
    return animals
  except Exception as e:
    raise Exception("Error in getAllAnimals function: " + str(e))

def getAll():
  try:
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    zoos = cursor.execute("SELECT * FROM zoos").fetchall()
    result = []

    for z in zoos:
      zoo_id = z["id"]
      animals = cursor.execute(
        "SELECT * FROM animals WHERE zoo_id = ?", (zoo_id,)
      ).fetchall()
      workers = cursor.execute(
        "SELECT * FROM workers WHERE zoo_id = ?", (zoo_id,)
      ).fetchall()
      enclosures = cursor.execute(
        "SELECT * FROM enclosures WHERE zoo_id = ?", (zoo_id,)
      ).fetchall()

      result.append({
        "id": z["id"],
        "name": z["name"],
        "animals": [dict(a) for a in animals],
        "worker": [dict(w) for w in workers],
        "enclosure":[dict(e) for e in enclosures]
      })
    conn.close()
    return result 
    
  except Exception as e:
    raise Exception("Error in getAll function: " + str(e))
  
