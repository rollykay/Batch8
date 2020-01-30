FROM gcr.io/google-appengine/python

RUN apt-get update && apt-get install -y binutils libproj-dev gdal-bin

# Copy the application's requirements.txt and run pip to install all
# dependencies into the virtualenv.
ADD requirements.txt /app/requirements.txt
RUN pip3 install -r /app/requirements.txt

# Add the application source code.
ADD . /app

VOLUME /cloudsql

EXPOSE 8080

# Run a WSGI server to serve the application. gunicorn must be declared as
# a dependency in requirements.txt.
#CMD gunicorn -b :$PORT backend.wsgi
CMD python3 manage.py runserver 0.0.0.0:$PORT

# Run container using the following command
# docker run -d -p 8080:8080 -v /Users/anindya/phoenix/backend:/app --env DB_HOST=host.docker.internal --name phoenix phoenix && docker logs -f phoenix
