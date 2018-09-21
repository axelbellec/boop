from flask import Flask

app = Flask(__name__)

# Configure the application
app.config.from_object('app.config')

from flaskr import views
