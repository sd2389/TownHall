# Generated migration for new business models

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('businessowner', '0002_businessownerprofile_billing_address'),
        ('citizen', '0006_citizennotification'),
    ]

    operations = [
        migrations.CreateModel(
            name='BusinessEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('event_date', models.DateField()),
                ('event_time', models.TimeField()),
                ('location', models.CharField(max_length=200)),
                ('status', models.CharField(choices=[('pending', 'Pending Approval'), ('approved', 'Approved'), ('rejected', 'Rejected'), ('cancelled', 'Cancelled')], default='pending', max_length=15)),
                ('max_attendees', models.IntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('business_owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='businessowner.businessownerprofile')),
            ],
            options={
                'ordering': ['-event_date', '-event_time'],
            },
        ),
        migrations.CreateModel(
            name='BusinessService',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('service_name', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('category', models.CharField(max_length=100)),
                ('price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('business_owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='businessowner.businessownerprofile')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='CitizenBusinessFeedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('feedback_text', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('business', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='businessowner.businessownerprofile')),
                ('citizen', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='citizen.citizenprofile')),
            ],
            options={
                'ordering': ['-created_at'],
                'unique_together': {('citizen', 'business')},
            },
        ),
    ]


