from rest_framework.serializers import ModelSerializer, SerializerMethodField, Serializer, FloatField

from trips.models import Trip, Station, StationV2


class StationSerializer(ModelSerializer):
    class Meta:
        model = Station
        fields = '__all__'


class StationV2Serializer(ModelSerializer):
    distance = SerializerMethodField()
    longitude = SerializerMethodField()
    latitude = SerializerMethodField()

    def get_distance(self, instance):
        return instance.distance.m

    def get_longitude(self, instance):
        return instance.coordinate.x

    def get_latitude(self, instance):
        return instance.coordinate.y

    class Meta:
        model = StationV2
        fields = '__all__'


class TripSerializer(ModelSerializer):

    class Meta:
        model = Trip
        fields = '__all__'

    def create(self, validated_data):
        return Trip.objects.create(**validated_data)

