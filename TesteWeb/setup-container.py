import subprocess
import os
import sys
import time

def generate_docker_compose(db_name, collection_name, json_file_path):
    json_file_path = os.path.abspath(json_file_path)
    docker_compose_template = f"""
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - {json_file_path}:/datasets/dataset.json
    command: mongod --bind_ip_all
    depends_on:
      - mongo-seed
  mongo-seed:
    image: mongo:latest
    volumes:
      - {json_file_path}:/datasets/dataset.json
    command: mongoimport --host mongodb -d {db_name} -c {collection_name} --type json --file /datasets/dataset.json --jsonArray
"""
    with open("docker-compose.yml", "w") as f:
        f.write(docker_compose_template)

def start_container():
    subprocess.run(["docker-compose", "up", "-d"])

def get_mongo_container_id():
    # Aguarda 5 segundos para os contêineres iniciarem completamente
    time.sleep(5)
    result = subprocess.run(["docker", "ps", "-q", "--filter", "name=testeweb_mongodb_1"], capture_output=True, text=True)
    return result.stdout.strip()

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python script.py <db_name> <collection_name> <json_file_path>")
        sys.exit(1)

    db_name = sys.argv[1]
    collection_name = sys.argv[2]
    json_file_path = sys.argv[3]
    
    generate_docker_compose(db_name, collection_name, json_file_path)
    start_container()
    mongo_container_id = get_mongo_container_id()
    print(f"MongoDB container ID: {mongo_container_id}")
