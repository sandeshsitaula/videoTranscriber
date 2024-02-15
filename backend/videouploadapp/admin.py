from django.contrib import admin
from videouploadapp.models import subtitle_storage_model,cut_video_subtitle_storage_model
# Register your models here.

admin.site.register(subtitle_storage_model)
admin.site.register(cut_video_subtitle_storage_model)
