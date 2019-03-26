from django.db import models

class PayInfo(models.Model):
    title = models.CharField(max_length=100)
    profile = models.CharField(max_length=100)
    price = models.FloatField()
    path = models.FilePathField()