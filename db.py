
import sqlite3

def get_db_connection():
  conn = sqlite3.connect('zoo_database.db')
  conn.row_factory = sqlite3.Row
  return conn

def create_zoos():
  conn = get_db_connection()
  conn.execute('''
    CREATE TABLE IF NOT EXISTS zoos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  ''')
  conn.commit()
  conn.close()

def create_animals():
  conn = get_db_connection()
  conn.execute('''
    CREATE TABLE IF NOT EXISTS animals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      zoo_id INTEGER NOT NULL,
      species TEXT NOT NULL,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      last_time_food_served TEXT,
      FOREIGN KEY (zoo_id) REFERENCES zoos (id) ON DELETE CASCADE
    )
  ''')
  conn.commit()
  conn.close()

def create_enclosures():
  conn = get_db_connection()
  conn.execute('''
    CREATE TABLE IF NOT EXISTS enclosures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      zoo_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      FOREIGN KEY (zoo_id) REFERENCES zoos (id) ON DELETE CASCADE
    )
  ''')
  conn.commit()
  conn.close()

def create_workers():
  conn = get_db_connection()
  conn.execute('''
    CREATE TABLE IF NOT EXISTS workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      zoo_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      FOREIGN KEY (zoo_id) REFERENCES zoos (id) ON DELETE CASCADE
    )
  ''')
  conn.commit()
  conn.close()

def create_animal_enclosure_assignments():
  conn = get_db_connection()
  conn.execute('''
    CREATE TABLE IF NOT EXISTS animal_enclosure_assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      zoo_id INTEGER NOT NULL,
      animal_id INTEGER NOT NULL,
      enclosure_id INTEGER NOT NULL,
      FOREIGN KEY (animal_id) REFERENCES animals (id) ON DELETE CASCADE,
      FOREIGN KEY (zoo_id) REFERENCES zoos (id) ON DELETE CASCADE,
      FOREIGN KEY (enclosure_id) REFERENCES enclosures (id) ON DELETE CASCADE
    )
  ''')
  conn.commit()
  conn.close()



def createInteractions():
  conn = get_db_connection()
  conn.execute('''
    CREATE TABLE IF NOT EXISTS interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      zoo_id INTEGER NOT NULL,
      animal_id INTEGER NOT NULL,
      worker_id INTEGER NOT NULL,
      FOREIGN KEY (animal_id) REFERENCES animals (id) ON DELETE CASCADE,
      FOREIGN KEY (zoo_id) REFERENCES zoos (id) ON DELETE CASCADE,
      FOREIGN KEY (worker_id) REFERENCES workers (id) ON DELETE CASCADE
    )
  ''')
  conn.commit()
  conn.close()

  