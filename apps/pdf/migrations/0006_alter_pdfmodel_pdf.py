# Generated by Django 3.2.12 on 2022-04-15 07:49

from django.db import migrations, models
import pdf.models


class Migration(migrations.Migration):

    dependencies = [
        ('pdf', '0005_pdfmodel_deadline'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pdfmodel',
            name='pdf',
            field=models.FileField(null=True, upload_to=pdf.models.pdf_path),
        ),
    ]
