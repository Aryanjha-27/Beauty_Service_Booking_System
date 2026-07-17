from django.contrib import admin
from userauth import models

admin.site.register(models.user)
admin.site.register(models.profile)
