from django.contrib.postgres.fields import ArrayField
from django.contrib.gis.db import models


# Create your models here.


class Station(models.Model):
    name = models.CharField(max_length=64, null=False, blank=False)
    latitude = models.FloatField(null=False)
    longitude = models.FloatField(null=False)
    zones = ArrayField(
        base_field=models.IntegerField(null=False)
    )


class StationV2(models.Model):
    name = models.CharField(max_length=64, null=False, blank=False)
    coordinate = models.PointField(geography=True)


class Trip(models.Model):
    user_id = models.CharField(max_length=32, null=False)   # Firebase id

    start_latitude = models.FloatField(null=False)
    start_longitude = models.FloatField(null=False)
    start_station = models.ForeignKey(to=StationV2, on_delete=models.PROTECT, related_name='start_station')
    start_time = models.DateTimeField()

    end_latitude = models.FloatField()
    end_longitude = models.FloatField()
    end_station = models.ForeignKey(to=StationV2, on_delete=models.PROTECT, related_name='end_station')
    end_time = models.DateTimeField()

    ticket = models.CharField(max_length=32)
    ticket_price = models.FloatField()
