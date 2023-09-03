from flask import Flask, request, jsonify
import json
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/getBalanceSheet', methods=['GET'])
def getBalanceSheet():
	data = request.args

	name = data.get('name')
	established_year = data.get('year')


	accounting_office = data.get('accounting_office')

	with open('sheet.json', 'r') as json_file:
		json_data = json.load(json_file)


	required_office_details = None

	for i in json_data:
		if i['name'] == name:
			required_office_details = i['balance']
			break

	if required_office_details == None:
		return jsonify(details=None)

	return jsonify(details=required_office_details)


@app.route('/makeDecision', methods=['GET'])
def makeDecision():
	data = request.args

	name = data.get('name')
	established_year = data.get('year')
	profit = data.get('profit')
	preAssessment = 20

	if int(data.get('assetsValue'))>int(data.get('loanValue')):
		preAssessment = 100

	elif int(profit)>0:
		preAssessment = 60

	res = [{
	'business_details':{
			'name':name,
			'established_year':established_year,
			'profileLossSummary':profit
		},
	'preAssessment':preAssessment
	}
	]
	return jsonify(res)

if __name__=='__main__':
    app.run(host='0.0.0.0',port=8000, debug=True)

