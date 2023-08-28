import logging
import azure.functions as func
from azure.storage.blob import BlobClient
import pandas as pd
import json
from azure.identity import DefaultAzureCredential
from io import StringIO,BytesIO

default_credential = DefaultAzureCredential()
account_url='/subscriptions/16a4db5f-2ced-4d03-baf6-acf312284e3b/resourceGroups/wordBotBlob/providers/Microsoft.Storage/storageAccounts/wordbotstorage'
# client = BlobServiceClient(account_url, credential=default_credential)
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource.resources import ResourceManagementClient

credential = DefaultAzureCredential()

client = ResourceManagementClient(
    credential=credential,
    subscription_id='16a4db5f-2ced-4d03-baf6-acf312284e3b'
)

for resource_group in client.resource_groups.list():
    print(f"Resource group: {resource_group.name}")

print(f"Successful credential: {credential._successful_credential.__class__.__name__}")

# def createContainer():
#     connection_string = "DefaultEndpointsProtocol=https;AccountName=wordbotstorage;AccountKey=q9kZhqrp+VM41D1dMpmMgc6wDKkOGs8ywLrr7YDjNJNTgviW4yzdATY/sC/AvggC4U0sRGb6+l2pk8NvXhr4WA==;EndpointSuffix=core.windows.net"
#     #service = BlobServiceClient.from_connection_string(conn_str=connection_string)

#     container_client = ContainerClient.from_connection_string(conn_str=connection_string, container_name="my_container")
#     container_client.create_container()  
#     return func.HttpResponse('Container Created')

def uploadBlob():
    file_name2=('//Users//chaitanyakunapareddi//Desktop//iconsult//AD-Local//wordsData.xlsx')
    masterData = pd.read_excel(file_name2)
    connection_string = "DefaultEndpointsProtocol=https;AccountName=wordbotstorage;AccountKey=q9kZhqrp+VM41D1dMpmMgc6wDKkOGs8ywLrr7YDjNJNTgviW4yzdATY/sC/AvggC4U0sRGb6+l2pk8NvXhr4WA==;EndpointSuffix=core.windows.net"
    blob = BlobClient.from_connection_string(conn_str=connection_string, container_name="my_container", blob_name="my_blob")
    blob.upload_blob(masterData)



def main(req: func.HttpRequest) -> func.HttpResponse:
    #blobdatafile=downloadBlob()
    stream = BytesIO()
    #blobdatafile.download_to_stream(stream)
    aces = pd.read_excel(stream)
    details=aces.shape[0]+1
    sampledata = { 'data' : details}
    sampledata = json.dumps(sampledata)

    return func.HttpResponse(sampledata)

