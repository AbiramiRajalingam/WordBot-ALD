import logging
import azure.functions as func
import pandas as pd
import json
from azure.storage.blob import BlobClient
from io import BytesIO

def connectToBlob():
    connection_string = "DefaultEndpointsProtocol=https;AccountName=wordbotstorage;AccountKey=q9kZhqrp+VM41D1dMpmMgc6wDKkOGs8ywLrr7YDjNJNTgviW4yzdATY/sC/AvggC4U0sRGb6+l2pk8NvXhr4WA==;EndpointSuffix=core.windows.net"
    blob = BlobClient.from_connection_string(conn_str=connection_string, container_name="tempcontainer", blob_name="new_parq.parquet")
    return blob


def main(req: func.HttpRequest) -> func.HttpResponse:
    blobobject=connectToBlob()
    blobData=blobobject.download_blob()
    blobStream = BytesIO()
    blobData.download_to_stream(blobStream)
    masterDB = pd.read_parquet(blobStream, engine='pyarrow')
    db1=masterDB[['SourceGUID','Company','Description','Title']]
    db1 = db1.dropna(subset=['Description'])
    db1=db1.head(5000)
    db1 = db1.replace('\n','', regex=True)
    data = db1.to_dict()  
    dblength={'dblength':db1.shape[0]}
    sample = {'data':data,'dblen':dblength}
    sample = json.dumps(sample)
    return func.HttpResponse(sample)
