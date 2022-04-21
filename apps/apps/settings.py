"""
Django settings for apps project.

Generated by 'django-admin startproject' using Django 3.2.12.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

from pathlib import Path
import os
import apps.security_settings as SECURITY_SETTINGS

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = SECURITY_SETTINGS.SECRET_KEY

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition

CORS_ALLOW_ALL_ORIGINS = True

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'user.apps.UserConfig',
    'pdf.apps.PdfConfig',
    'rest_framework',
    'corsheaders',
    'storages',
    'eyetracking.apps.EyetrackingConfig',
    'cs.apps.CsConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'apps.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'apps.wsgi.application'

#############AWS
AWS_ACCESS_KEY_ID = 'AKIARAITQK5LWYIM5I5U'
AWS_SECRET_ACCESS_KEY = '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'
AWS_REGION = 'ap-northeast-2'

### S3 Storages
AWS_STORAGE_BUCKET_NAME = 'capstone-storage'
AWS_S3_CUSTOME_DOMAIN = '%s.s3.%s.amazonaws.com' % (AWS_STORAGE_BUCKET_NAME,AWS_REGION)
AWS_S3_OBJECT_PARAMETERS ={
    'CacheControl' : 'max-age=86400',
}
# AWS_DEFAULT_ACL = 'public-read'
# AWS_LOCATION = 'static'
AWS_QUERYSTRING_AUTH = False

# S3 Storage
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/


AWS_STATIC_LOCATION = ''
STATICFILES_STORAGE = 'config.static_storage.StaticStorage' # 'storages.backends.s3boto3.S3Boto3Storage'
STATIC_URL = 'https://'+AWS_S3_CUSTOME_DOMAIN+'/'

AWS_PUBLIC_MEDIA_LOCATION = "media/public"
DEFAULT_FILE_STORAGE = 'config.media_storage.PublicMediaStorage' # 'storages.backends.s3boto3.S3Boto3Storage'

AWS_PRIVATE_MEDIA_LOCATION = "media/private"
PRIVATE_FILE_STORAGE = 'config.media_storage.PrivateMediaStorage'

# STATIC_DIR = os.path.join(BASE_DIR,'static')
# STATICFILES_DIRS = [
#     STATIC_DIR,
# ]
# STATIC_ROOT = os.path.join(BASE_DIR,'staticfiles')

# MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
# MEDIA_URL = '/media/'

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = SECURITY_SETTINGS.DATABASES


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_USER_MODEL = 'user.User'


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'ko-kr' # 'en-us'

TIME_ZONE = 'Asia/Seoul' # 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# DATE_INPUT_FORMATS = ['%d-%m-%Y']

FIREBASE_CONFIG = os.path.join(BASE_DIR, 'firebase-config.json')