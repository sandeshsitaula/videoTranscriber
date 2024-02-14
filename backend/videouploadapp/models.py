from django.db import models
from django.contrib.postgres.fields import ArrayField
# Create your models here.

class subtitle_storage_model(models.Model):
    video_name=models.CharField(max_length=1000)
    subtitle_array=ArrayField(models.TextField(),default=list)
    timestamp_array=ArrayField(models.TextField(),default=list)

