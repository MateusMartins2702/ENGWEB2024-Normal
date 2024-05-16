import csv
import json
import sys
import os

def csv_to_json(csv_file_path, json_file_path, delimiter=';'):
    # Abre o arquivo CSV e o arquivo JSON
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        # Lê o CSV
        csv_reader = csv.DictReader(csv_file, delimiter=delimiter)
        # Cria uma lista de dicionários, cada linha do CSV será um dicionário
        data = [row for row in csv_reader]
    
    # Escreve a lista de dicionários no arquivo JSON
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python csv_to_json.py <csv_file_path> <json_file_path>")
        sys.exit(1)
    
    csv_file_path = sys.argv[1]
    json_file_path = sys.argv[2]

    if not os.path.exists(csv_file_path):
        print(f"Error: The file {csv_file_path} does not exist.")
        sys.exit(1)

    csv_to_json(csv_file_path, json_file_path)
    print(f"CSV file has been converted to JSON and saved as {json_file_path}")
