from trips.models import Trip
from datetime import timedelta
from datetime import datetime


SINGLE_TRIP_TICKET = 'SINGLE_TRIP_TICKET'
DAY_TICKET = 'DAY_TICKET'
WEEKLY_TICKET = 'WEEKLY_TICKET'

TICKET_PRICES = {
    SINGLE_TRIP_TICKET: 3.30,
    DAY_TICKET: 7.80,
    WEEKLY_TICKET: 17.10
}


def calculate_price(user_id, duration_start: datetime, duration_end):
    trips = Trip.objects.filter(
        user_id__exact=user_id,
        start_time__gte=duration_start,
        start_time__lt=duration_end
    ).order_by('start_time')

    current_day = duration_start.date()
    weekly_cost = 0.0
    while current_day < duration_end.date():
        next_day = current_day + timedelta(days=1)
        day_trips = trips.filter(start_time__gte=current_day, start_time__lt=next_day)
        day_trips_count = day_trips.count()
        if day_trips_count * TICKET_PRICES[SINGLE_TRIP_TICKET] >= TICKET_PRICES[DAY_TICKET]:
            day_trips.update(ticket=DAY_TICKET)
            weekly_cost += TICKET_PRICES[DAY_TICKET]
        else:
            day_trips.update(ticket=SINGLE_TRIP_TICKET)
            weekly_cost += day_trips_count * TICKET_PRICES[SINGLE_TRIP_TICKET]
        current_day = next_day

    if weekly_cost >= TICKET_PRICES[WEEKLY_TICKET]:
        trips.update(ticket=WEEKLY_TICKET)

    prev_day = None
    for trip in trips:
        ticket = trip.ticket
        if ticket == SINGLE_TRIP_TICKET:
            trip.ticket_price = TICKET_PRICES[ticket]
        elif ticket == DAY_TICKET and trip.start_time.date() != prev_day:
            trip.ticket_price = TICKET_PRICES[ticket]
        elif ticket == WEEKLY_TICKET and prev_day is None:
            trip.ticket_price = TICKET_PRICES[ticket]
        else:
            trip.ticket_price = 0
        trip.save()
        prev_day = trip.start_time.date()

