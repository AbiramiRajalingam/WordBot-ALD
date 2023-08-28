#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Jan  3 13:05:36 2022

@author: chaitanyakunapareddi
"""

''' importing packages '''

from flask import Flask,request
from flask_restful import Resource, Api, reqparse
import pandas as pd
import ast
from flask_cors import CORS,cross_origin
import json
import re


'''reading job descriptions'''

prk_file ='/Users/chaitanyakunapareddi/Desktop/iconsult/AD-Local/oadbjobs.parquet'
db=pd.read_parquet(prk_file, engine='pyarrow')
db1=db[['SourceGUID','Company','Description','Title']]
db1 = db1.dropna(subset=['Description'])
db1=db1.head(5000)
db1 = db1.replace('\n','', regex=True)
 
# Function to clean the names
def Clean_names(desc_data):
    if re.search('\(.*!@#$%^&*()_+\-=\[\]{};:"\\|/n<>\/?~', desc_data):
        pos = re.search('\(.*!@#$%^&*()_+\-=\[\]{};:"\\|/n<>\/?~', desc_data).start()
        return desc_data[:pos]
    else:
        # if clean up needed return the same name
        return desc_data

db1['Description']=db1['Description'].apply(Clean_names)



''' reading master DB '''
file_name = ("master_db.xlsx")
file_name2=('wordsData.xlsx')
global wordsData
wordsData = pd.read_excel(file_name)
masterData = pd.read_excel(file_name2)
print(masterData.shape[0]+1)

''' setting up API '''

app = Flask(__name__)
'''
app_cors_config = {
  "methods": ["OPTIONS", "GET", "POST","PUT","DELETE"],
}
'''

api_cors_config = {
  "origins": "*",
  "allow_headers": 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
}

#CORS(app)
cors = CORS(app,resources={"/*": api_cors_config})
#app.config['CORS_HEADERS'] = 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
api = Api(app)

''' APIs '''

@app.route('/jobdesc',methods=['GET'])
def get():
    data = db1  
    dblength={'dblength':db1.shape[0]}
    data = data.to_dict()  # convert dataframe to dictionary
    return {'data': data,'dblength':dblength}, 200  # return data and 200 OK code
# methods go here
pass


@app.route('/worbotdetails',methods=['GET'])
def get_worddata():
    masterData = pd.read_excel(file_name2)
    details=masterData.shape[0]+1
    print(details)
    return {'details': details}, 200  # return data and 200 OK code
# methods go here
pass


@app.route('/locations',methods=['POST'])
@cross_origin()
def post():
    masterData = pd.read_excel(file_name2)
    new_data=request.get_json(force=True)
    j_data = json.dumps(new_data)
    json_data=json.loads(j_data)
    df_json=pd.DataFrame(json_data,columns=json_data[0].keys())
    df_json.columns=['ablesit words','suggestion words']
    new_data=masterData.append(df_json,ignore_index=True)
    new_data.to_excel('wordsData.xlsx',index=False)

    return {'message':'success'}, 200 # return data with 200 OK
pass




  

''' main function '''


if __name__ == '__main__':
    #app.run() 
    app.run(host='localhost',port=4300)








