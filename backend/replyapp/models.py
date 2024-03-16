from django.db import models
from videouploadapp.models import subtitle_storage_model
# Create your models here.
#for orignal video when first uploaded
class video-reply_model(models.Model):
    video_name=models.CharField(max_length=1000)
    subtitle_array=ArrayField(models.TextField(),default=list)
    timestamp_array=ArrayField(models.TextField(),default=list)
    replied_to=models.ForeignKey(subtitle_storage_model,on_delete=models.CASCADE)
