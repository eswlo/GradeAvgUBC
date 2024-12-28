import zipfile
import json
import psycopg2
import os
from dotenv import load_dotenv

def insert_section(section, cursor):
    try:
        section_year = 1900 if section["Section"] == "overall" else int(section["Year"])
        values_to_insert = [
            section["id"], section["Course"], section["Title"], section["Professor"], section["Subject"], 
            section_year, section["Avg"], section["Pass"], section["Fail"], section["Audit"]
        ]     
        table_name = os.getenv("PGTABLE_SECTIONS")
        cursor.execute(f"""INSERT INTO {table_name} (uuid, id, title, instructor, dept, year, avg, pass, fail, audit) 
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                       """, tuple(values_to_insert))
    except Exception as e:
        print(f"Error occurred when inserting section {section}: {str(e)}")

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
                            insert_section(section, cursor)
                        except Exception as e:
                            print(f"Error occurred when processing section {section}: {str(e)}")
def main():
    load_dotenv()
    path = "archives/ubc-pair-2016.zip"
    db_conn = psycopg2.connect(
        database=os.getenv('PGDATABASE'), 
        user=os.getenv('PGUSER'), 
        password=os.getenv('PGPASSWORD'), 
        host=os.getenv('PGHOST')
        )
    cursor = db_conn.cursor()
    empty_table(cursor)
    parse_and_add_data(path, cursor)
    db_conn.commit()
    cursor.close()
    db_conn.close()

if __name__ == "__main__":
    main()
