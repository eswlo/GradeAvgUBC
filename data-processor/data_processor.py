import zipfile
import json
import psycopg2
import os
from dotenv import load_dotenv
from urllib.parse import urlparse


def insert_section(section, cursor):
    try:
        section_year = os.getenv("PGOVERALL_YEAR") if section["Section"] == "overall" else int(section["Year"])
        values_to_insert = [
            section["id"], int(section["Course"]), section["Title"], section["Professor"], section["Subject"], 
            section_year, section["Avg"], section["Pass"], section["Fail"], section["Audit"]
        ]     
        table_name = os.getenv("PGTABLE_SECTIONS")
        cursor.execute(f"""INSERT INTO {table_name} (uuid, id, title, instructor, dept, year, avg, pass, fail, audit) 
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                       """, tuple(values_to_insert))
    except Exception as e:
        print(f"Error occurred when inserting section {section}: {str(e)}")

def create_table(cursor): 
    table_name = os.getenv("PGTABLE_SECTIONS")
    drop_query = f"DROP TABLE IF EXISTS {table_name};"
    create_query = """
        CREATE TABLE sections(
            psqlidx BIGSERIAL NOT NULL,
            uuid TEXT NOT NULL,
            id INT NOT NULL,
            title TEXT NOT NULL,
            instructor TEXT NOT NULL,
            dept TEXT NOT NULL,
            year INT NOT NULL,
            avg NUMERIC(5,2) NOT NULL,
            pass INT NOT NULL,
            fail INT NOT NULL,
            audit INT NOT NULL
        );
    """
    cursor.execute(drop_query)
    try:
        cursor.execute(create_query)
    except Exception as e:
        print(f"Error occurred when creating table {table_name}: {str(e)}")



def empty_table(cursor):
    try:
        table_name = os.getenv("PGTABLE_SECTIONS")
        truncate_query = f"TRUNCATE TABLE {table_name} CASCADE;"
        cursor.execute(truncate_query)
    except Exception as e:
        print(f"Error occurred when truncating table {table_name}: {str(e)}")


def parse_and_add_data(path, cursor):
    with zipfile.ZipFile(path, 'r') as zip:
        courses = zip.namelist()
        for file in courses:
            if not file.endswith('/'):
                try:
                    course_str = zip.read(file).decode('UTF8') # read file in bytes and decode to a string
                    course_obj = json.loads(course_str)
                    sections = course_obj["result"]
                except Exception as e:
                    print(f"Error occurred when reading zip file {file}: {str(e)}")
                if len(sections) != 0:
                    for section in sections:
                        try:
                            # print("Inserting a section...")
                            insert_section(section, cursor)
                            # print("Section inserted.")
                        except Exception as e:
                            print(f"Error occurred when processing section {section}: {str(e)}")
def main():
    # print(os.getcwd())
    path = "archives/ubc-pair-2016.zip"
    load_dotenv(dotenv_path='../server/.env')
    connection_string = ""
    if (os.getenv("NODE_ENV") == "development"):
        database=os.getenv("PGDATABASE")
        username=os.getenv('PGUSER') 
        password=os.getenv('PGPASSWORD') 
        host=os.getenv('PGHOST')
        print(database)
        connection_string = f"dbname={database} user={username} password={password} host={host}"
    else:
        parsed_url = urlparse(os.getenv("PGRENDERURL"))
        username = parsed_url.username
        password = parsed_url.password
        host = parsed_url.hostname
        database = parsed_url.path.lstrip('/')  # Remove leading '/' from the database name
        connection_string = f"dbname={database} user={username} password={password} host={host}"
    print("connection_string:", connection_string)
    db_conn = psycopg2.connect(connection_string)
    cursor = db_conn.cursor()
    print("Creating table...")
    create_table(cursor)
    print("Table created. On to add data...")
    parse_and_add_data(path, cursor)
    print("Data added.")
    db_conn.commit()
    cursor.close()
    db_conn.close()

if __name__ == "__main__":
    main()
