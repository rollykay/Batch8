from django.contrib import admin
from django.urls import path, include
from trips.views import TripsView, StationsView, StationsV2View


urlpatterns = [
    path('', TripsView.as_view()),
    path('stations/', StationsView.as_view()),
    path('stations/v2/', StationsV2View.as_view()),
]
