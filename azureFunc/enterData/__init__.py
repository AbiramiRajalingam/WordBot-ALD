import logging
import azure.functions as func
import pandas as pd
from azure.storage.blob import BlobClient,ContentSettings
import json
from tempfile import NamedTemporaryFile
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
    df_json.columns=['ableist_words','suggestion_words']
    new_data=masterDB.append(df_json,ignore_index=True)
    #blobobject.delete_blob()
    new_data.to_excel("master_db.xlsx",index=False)
    with open("./master_db.xlsx", "rb") as data:
        blobobject.upload_blob(data,overwrite=True)
    return func.HttpResponse('success')

   
