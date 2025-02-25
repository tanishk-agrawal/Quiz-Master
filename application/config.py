def config(app):
    app.config['SECRET_KEY'] = 'my-secret-key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///quiz_master.sqlite3'
    app.config['SECURITY_PASSWORD_SALT'] = 'salty-password'

    app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] = 'Authentication-Token'
    app.config['SECURITY_TOKEN_MAX_AGE'] = 3600 #1hr 
    app.config['SECURITY_LOGIN_WITHOUT_CONFIRMATION'] = True

    app.config['WTF_CSRF_CHECK_DEFAULT'] = False
    app.config['SECURITY_CSRF_PROTECT_MECHANISHMS'] = []
    app.config['SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS'] = True