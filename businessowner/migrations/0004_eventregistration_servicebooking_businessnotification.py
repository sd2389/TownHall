# Generated migration for event registration, service booking, and notifications

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('businessowner', '0003_businessevent_businessservice_citizenbusinessfeedback'),
        ('citizen', '0006_citizennotification'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventRegistration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('registered', 'Registered'), ('cancelled', 'Cancelled'), ('attended', 'Attended')], default='registered', max_length=15)),
                ('registered_at', models.DateTimeField(auto_now_add=True)),
                ('notes', models.TextField(blank=True)),
                ('citizen', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='citizen.citizenprofile')),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='registrations', to='businessowner.businessevent')),
            ],
            options={
                'ordering': ['-registered_at'],
                'unique_together': {('event', 'citizen')},
            },
        ),
        migrations.CreateModel(
            name='ServiceBooking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('booking_date', models.DateField()),
                ('booking_time', models.TimeField()),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='pending', max_length=15)),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('citizen', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='citizen.citizenprofile')),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='businessowner.businessservice')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='BusinessNotification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notification_type', models.CharField(choices=[('application_approved', 'Application Approved'), ('application_rejected', 'Application Rejected'), ('event_approved', 'Event Approved'), ('event_rejected', 'Event Rejected'), ('complaint_response', 'Complaint Response'), ('booking_new', 'New Booking'), ('general', 'General')], default='general', max_length=20)),
                ('title', models.CharField(max_length=200)),
                ('message', models.TextField()),
                ('is_read', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('business_owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to='businessowner.businessownerprofile')),
                ('related_event', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to='businessowner.businessevent')),
                ('related_license', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to='businessowner.businesslicense')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='businessnotification',
            index=models.Index(fields=['business_owner', '-created_at'], name='businessown_business_created_idx'),
        ),
        migrations.AddIndex(
            model_name='businessnotification',
            index=models.Index(fields=['is_read'], name='businessown_is_read_idx'),
        ),
    ]









