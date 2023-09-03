import requests

name='Google'
year=2012
accounting_office = 'B'

json_data = {}
json_data['name'] = name
json_data['year'] = year
json_data['accounting_office'] = accounting_office

# print(json_data)

response = requests.get('http://localhost:8000/getBalanceSheet', json=json_data).content
print(response)