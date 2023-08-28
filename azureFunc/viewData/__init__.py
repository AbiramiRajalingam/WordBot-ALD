from doctest import master
import logging
import azure.functions as func
import pandas as pd
import json
from azure.storage.blob import BlobClient
from io import BytesIO

def connectToBlob():
    connection_string = "DefaultEndpointsProtocol=https;AccountName=wordbotstorage;AccountKey=q9kZhqrp+VM41D1dMpmMgc6wDKkOGs8ywLrr7YDjNJNTgviW4yzdATY/sC/AvggC4U0sRGb6+l2pk8NvXhr4WA==;EndpointSuffix=core.windows.net"
    blob = BlobClient.from_connection_string(conn_str=connection_string, container_name="tempcontainer", blob_name="master_db.xlsx")
    return blob

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    blobobject=connectToBlob()
    blobData=blobobject.download_blob()
    blobStream = BytesIO()
    blobData.download_to_stream(blobStream)
    masterDB = pd.read_excel(blobStream)
    arydata = masterDB.values.tolist()
    sampledata = json.dumps(arydata)
    return func.HttpResponse(sampledata)
   
