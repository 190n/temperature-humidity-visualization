#!/usr/bin/env python3
# Converts data.csv in current working directory into data.json
# 58560000 is added to each timestamp as I started collecting data at 4:16 PM, which is 58560000
# milliseconds after midnight.

import csv
import json

def mapper(pair):
    return pair[1] + 58560000 if pair[0] == 0 else pair[1]

with open('data.csv') as csvFile:
    rows = []
    reader = csv.reader(csvFile)
    for row in reader:
        rows.append(list(map(mapper, enumerate(list(map(float, row))))))

    with open('data.json', 'w') as jsonFile:
        jsonFile.write(json.dumps({ 'data': rows }))
