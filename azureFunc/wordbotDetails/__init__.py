import json
import logging
import azure.functions as func
from azure.storage.blob import BlobClient
import pandas as pd
from io import BytesIO

def connectToBlob():
    connection_string = "DefaultEndpointsProtocol=https;AccountName=wordbotstorage;AccountKey=q9kZhqrp+VM41D1dMpmMgc6wDKkOGs8ywLrr7YDjNJNTgviW4yzdATY/sC/AvggC4U0sRGb6+l2pk8NvXhr4WA==;EndpointSuffix=core.windows.net"
    blob = BlobClient.from_connection_string(conn_str=connection_string, container_name="tempcontainer", blob_name="master_db.xlsx")
    return blob


def main(req: func.HttpRequest) -> func.HttpResponse:
    blobobject=connectToBlob()
    blobData=blobobject.download_blob()
    blobStream = BytesIO()
    blobData.download_to_stream(blobStream)
    masterDB = pd.read_excel(blobStream)
    details=masterDB.shape[0]+1
    sampledata = { 'data' : details}
    sampledata = json.dumps(sampledata)
    return func.HttpResponse(sampledata)
