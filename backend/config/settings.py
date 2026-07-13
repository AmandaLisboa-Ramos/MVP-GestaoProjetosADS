import os
from dotenv import load_dotenv
from datetime import timedelta
import dj_database_url
from decouple import config 
load_dotenv()

# Base
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Seguranca
SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)

# URLs
ROOT_URLCONF = 'config.urls'

# Auth
AUTH_USER_MODEL = 'authentication.CustomUser'

# Apps
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',                        
    'rest_framework_simplejwt.token_blacklist',         
    'drf_spectacular',
    'corsheaders',
    'apps.authentication',   
    'apps.grupos',
    'apps.alunos',
    'apps.projetos',
    'apps.entregas',
]

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}
# Middleware
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

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Banco de dados
DATABASE_URL = config('DATABASE_URL', default=None)

if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL, conn_max_age=600)
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': config('DB_NAME', default='datagerenciamentomvp'),
            'USER': config('DB_USER', default='root'),
            'PASSWORD': config('DB_PASSWORD', default=''),
            'HOST': config('DB_HOST', default='127.0.0.1'),
            'PORT': config('DB_PORT', default='3306'),
        }
    }

SPECTACULAR_SETTINGS = {
    "TITLE": "Gerenciamento MVP API",
    "DESCRIPTION": "API do sistema de gerenciamento de projetos ADS",
    "VERSION": "1.0.0",
    "COMPONENT_SPLIT_REQUEST": True,
    "SERVE_INCLUDE_SCHEMA": False,
    "TAGS": [
        {
            "name": "Autenticação",
            "description": (
                "Endpoints responsáveis pelo controle de acesso ao sistema. "
                "Inclui login, geração e renovação de tokens JWT, logout com "
                "invalidação de sessão, cadastro de novos usuários, alteração "
                "de senha e consulta do perfil do usuário logado."
            ),
        },
        {
            "name": "Alunos",
            "description": (
                "Endpoints para gerenciamento completo dos alunos. "
                "Permite cadastrar, listar, buscar, editar, excluir e "
                "vincular alunos a grupos de projeto."
            ),
        },
        {
            "name": "Grupos",
            "description": (
                "Endpoints para gerenciamento das equipes de projeto. "
                "Permite criar, listar, editar e excluir grupos, além de "
                "consultar os alunos vinculados a cada equipe."
            ),
        },
        {
            "name": "Projetos",
            "description": (
                "Endpoints para gerenciamento dos projetos MVP. "
                "Permite criar, listar, editar e excluir projetos, "
                "com controle de status entre em andamento e concluído."
            ),
        },
        {
            "name": "Entregas",
            "description": (
                "Endpoints para gerenciamento das entregas e apresentações. "
                "Permite registrar entregas, marcar como apresentadas e "
                "adicionar links de apresentação por projeto."
            ),
        },
    ],
    "APPEND_COMPONENTS": {
        "securitySchemes": {
            "bearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT",
            }
        }
    },
    "SECURITY": [{"bearerAuth": []}],
    "ENUM_NAME_OVERRIDES": {
        "StatusEnum": "apps.projetos.models.Projeto.Status",
        "GrupoStatusEnum": "apps.grupos.models.Grupo.Status",
    },
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME':    timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME':   timedelta(days=7),
    'ROTATE_REFRESH_TOKENS':    True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES':        ('Bearer',),
}

# Internacionalizacao

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=lambda v: [s.strip() for s in v.split(',')])
# LANGUAGE_CODE = 'en-us'

# TIME_ZONE = 'UTC'

# USE_I18N = True

# USE_TZ = True

# Arquivos estaticos
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

# CORS


CORS_ALLOW_ALL_ORIGINS = True