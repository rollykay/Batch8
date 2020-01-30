from datetime import timedelta

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from trips.models import Trip, Station, StationV2
from trips.serializers import TripSerializer, StationSerializer, StationV2Serializer
from trips.tickets import calculate_price
from django.contrib.gis.measure import D
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point


class StationsView(APIView):

    def get(self, request: Request):
        stations = Station.objects.all().order_by('name')
        serializer = StationSerializer(instance=stations, many=True)
        return Response(data=serializer.data)


class StationsV2View(APIView):

    def get(self, request: Request):
        try:
            longitude = float(request.query_params.get('long'))
            latitude = float(request.query_params.get('lat'))
            radius = float(request.query_params.get('r', default=1000))
        except TypeError as e:
            return Response(data={'error': 'Provide valid long and lat.'}, status=status.HTTP_400_BAD_REQUEST)

        print(f'Long={longitude}, Lat={latitude}')

        current_coordinate = Point(longitude, latitude, srid=4326)
        stations = StationV2.objects.filter(
            coordinate__dwithin=(current_coordinate, D(m=radius))
        ).annotate(
            distance=Distance('coordinate', current_coordinate)
        ).order_by('distance')
        # stations = StationV2.objects.all().annotate(
        #     distance=Distance('coordinate', current_coordinate)
        # ).order_by('distance')
        serializer = StationV2Serializer(instance=stations, many=True)
        return Response(data=serializer.data)


class TripsView(APIView):

    def get(self, request: Request):
        user_id = request.query_params.get('user_id')

        # date = datetime.today()-timedelta(days=2)
        # calculate_price(user_id, start_of_week(date), end_of_week(date))

        trips = Trip.objects.all().filter(user_id__exact=user_id).order_by('-start_time')
        serializer = TripSerializer(instance=trips, many=True)
        return Response(data=serializer.data)

    def post(self, request: Request):
        serializer = TripSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        trip = serializer.save()
        calculate_price(trip.user_id, start_of_week(trip.start_time), end_of_week(trip.end_time))
        print(trip)
        return Response(data=serializer.data)


def start_of_week(date):
    start = date - timedelta(days=date.isoweekday() - 1)
    start = start.replace(hour=0, minute=0, second=0, microsecond=0)
    return start


def end_of_week(date):
    end = start_of_week(date) + timedelta(days=7)
    return end
