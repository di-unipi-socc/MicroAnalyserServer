from api.models import Snippet
from api.serializers import SnippetSerializer
from rest_framework import mixins
from rest_framework import generics

# for function based api
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
import os
import json 

from microanalyser.analyser import MicroAnalyser
from microanalyser.loader import JSONLoader
from microanalyser.trasformer import JSONTransformer
from microanalyser.model.template import MicroModel
from microanalyser.model.nodes import Service, Database, CommunicationPattern


loader = JSONLoader()
transformer = JSONTransformer()


file_name = 'data-from-client.json'

@api_view(['GET'])
@csrf_exempt
def graph_analysis(request):
    if request.method == 'GET':
        mmodel = None
        if(os.path.isfile(file_name)):
            mmodel = loader.load(file_name)
            analyser = MicroAnalyser(mmodel)
            res = analyser.analyse()
            print(res)
            return  Response(res)
        else:
            return Response({"msg": "no model uploaded"})

@api_view(['GET', 'POST'])
@csrf_exempt
def graph(request):
    if request.method == 'POST':
        data = request.data
        with open(file_name, 'w') as outfile:
            json.dump(data, outfile, indent=4)

        # micro_model = loader.load_from_dict(data)
        # micro_model = loader.load('data-from-client.json')
        
        # with open('data.json', 'w') as outfile:
        #     json.dump(transformer.transform(micro_model), outfile, indent=4)
        return  Response( {"msg":"graph uploaded correclty"})

    if request.method == 'GET':
        mmodel = None
        if(os.path.isfile(file_name)):
            mmodel = loader.load(file_name)
            dmodel = transformer.transform(mmodel)
            return  Response(dmodel)
        else:
            return Response({"msg": "no model uploaded"})


@api_view(['GET', 'POST'])
@csrf_exempt
def nodes(request):
    if request.method == 'GET':
        if(os.path.isfile('data.json') ):
            with open('data.json') as f:
                model = json.load(f)
            return  Response(model['nodes'])
        else:
            return Response({"msg": "no model uploaded"})
    if request.method == 'POST':
        data = request.data
        node = Service(data["name"])
        micro_model.add_node(node)
        n=micro_model[node.name]
        return Response(node.dict())

def node_detail(request):
    if request.method == 'GET':
        return Response({"message": "Got some data!"})
    return Response({"message": "Hello, world!"})

## MIXINS and class based views 
# class SnippetList(mixins.ListModelMixin,
#                   mixins.CreateModelMixin,
#                   generics.GenericAPIView):
#     queryset = Snippet.objects.all()
#     serializer_class = SnippetSerializer

#     def get(self, request, *args, **kwargs):
#         return self.list(request, *args, **kwargs)

#     def post(self, request, *args, **kwargs):
#         return self.create(request, *args, **kwargs)

# class SnippetDetail(mixins.RetrieveModelMixin,
#                     mixins.UpdateModelMixin,
#                     mixins.DestroyModelMixin,
#                     generics.GenericAPIView):
#     queryset = Snippet.objects.all()
#     serializer_class = SnippetSerializer

#     def get(self, request, *args, **kwargs):
#         return self.retrieve(request, *args, **kwargs)

#     def put(self, request, *args, **kwargs):
#         return self.update(request, *args, **kwargs)

#     def delete(self, request, *args, **kwargs):
#         return self.destroy(request, *args, **kwargs)

## SHORTEST VERSION USING MIXINS
class SnippetList(generics.ListCreateAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer


class SnippetDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer