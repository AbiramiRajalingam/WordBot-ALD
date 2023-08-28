import logging
import azure.functions as func
import pandas as pd
from azure.storage.blob import BlobClient,ContentSettings
import json
from io import BytesIO

def connectToBlob():
    connection_string = "DefaultEndpointsProtocol=https;AccountName=wordbotstorage;AccountKey=q9kZhqrp+VM41D1dMpmMgc6wDKkOGs8ywLrr7YDjNJNTgviW4yzdATY/sC/AvggC4U0sRGb6+l2pk8NvXhr4WA==;EndpointSuffix=core.windows.net"
    blob = BlobClient.from_connection_string(conn_str=connection_string, container_name="tempcontainer", blob_name="master_db.xlsx")
    return blob

def main(req: func.HttpRequest) -> func.HttpResponse:
    new_data=req.get_json()
    blobobject=connectToBlob()
    blobData=blobobject.download_blob()
    blobStream = BytesIO()
    blobData.download_to_stream(blobStream)
    masterDB = pd.read_excel(blobStream)
    j_data = json.dumps(new_data)
    json_data=json.loads(j_data)
    df_json=pd.DataFrame(json_data,columns=json_data[0].keys())
    for idx,jsonrow in df_json.iterrows():
        for index,datarow in masterDB.iterrows():
            if (jsonrow['preablw']==datarow['ableist_words']):
                masterDB['ableist_words'][index]=df_json['newablw'][idx]
                masterDB['suggestion_words'][index]=df_json['newsgstnw'][idx]
            else:
                pass
    masterDB.to_excel("master_db.xlsx",index=False)
    with open("./master_db.xlsx", "rb") as data:
        blobobject.upload_blob(data,overwrite=True)
    respMsg = {'message':'success'}
    sample = json.dumps(respMsg)
    return func.HttpResponse(sample)
