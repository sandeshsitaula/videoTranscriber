from django.db import models
from django.contrib.postgres.fields import ArrayField
# Create your models here.

#for orignal video when first uploaded
class subtitle_storage_model(models.Model):
    video_name=models.CharField(max_length=1000)
    subtitle_array=ArrayField(models.TextField(),default=list)
    timestamp_array=ArrayField(models.TextField(),default=list)

#after the video is cut
class cut_video_subtitle_storage_model(models.Model):
    original_video_path=models.CharField(max_length=1000)
    cut_video_path=models.TextField()
    subtitle_string=models.TextField()
