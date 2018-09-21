from flask_script import Manager

from app import app


manager = Manager(app)


@manager.command
def runserver():
    """ Run webserver. """

    app.run(host=app.config['HOST'], port=app.config['PORT'],
            debug=True, use_reloader=True)


if __name__ == '__main__':
    manager.run()
