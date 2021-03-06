from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from SpotEventApp.serializers.address import Address as addressSerializer
from SpotEventApp.serializers.address import Create_address as Create_addressSerializer
from SpotEventApp.models.address import Address as addressModel

from SpotEventApp.models.identifier import Identifier as identifierModel


@api_view(['GET','POST'])  # get all the addresses or add an addresss
def address_request(request):
	if (request.method == 'GET'):
		addresses = addressModel.objects.all()
		serializer = addressSerializer(addresses, many=True, context={'request': request})
		return Response(serializer.data)

	elif (request.method == 'POST'):

		if ('id' not in request.COOKIES):
			return Response(status=status.HTTP_403_FORBIDDEN)

		serializer = addressSerializer(data=request.data)
		if (serializer.is_valid()):
			serializer.save()
			serializer = addressSerializer(serializer.save(), many=True, context={'request': request})
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET','PUT','DELETE'])
def single_address_request(request, pk): 

	try: 
		address = addressModel.objects.get(id=pk)
	except addressModel.DoesNotExist: 
		return Response(status=status.HTTP_404_NOT_FOUND)

	if(request.method == 'GET'):	
		serializer = addressSerializer(address, context={'request':request})
		return Response(serializer.data, status=status.HTTP_200_OK)

	elif(request.method == 'PUT'):

		if ('id' not in request.COOKIES):
			return Response(status=status.HTTP_403_FORBIDDEN)

		serializer = addressSerializer(address, data=request.data, context={'request':request})
		if(serializer.is_valid()):
			serializer.save()
			return Response(status=status.HTTP_204_NO_CONTENT)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	else:

		#This code is for deleting an address entity, before deleting we check if 
		# the address is still a foreing key of an user- or venue entity, if so deletino is not allowed 
		# otherwise we delete the address entity

		if(identifierModel.objects.filter(address_id=pk).exists()):
			return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
		else:
			if ('id' not in request.COOKIES):
				return Response(status=status.HTTP_403_FORBIDDEN)
			address.delete()
			return Response(status=status.HTTP_204_NO_CONTENT)
	