"""Management command to create mock data for MVP."""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import MechanicProfile, JobCard, Task


class Command(BaseCommand):
    help = 'Setup mock data for Unsan Academy MVP'

    def handle(self, *args, **options):
        self.stdout.write('Creating mock data...')

        # Create test user and profile
        user, created = User.objects.get_or_create(
            username='demo_mechanic',
            defaults={'email': 'demo@unsan.academy'}
        )
        if created:
            user.set_password('demo1234')
            user.save()

        profile, _ = MechanicProfile.objects.get_or_create(
            user=user,
            defaults={
                'name': '김정비',
                'tier': 'Silver',
                'xp': 350,
                'stat_tech': 45,
                'stat_hand': 60,
                'stat_speed': 35,
                'stat_art': 25,
                'stat_biz': 30,
            }
        )
        self.stdout.write(self.style.SUCCESS(f'Created profile: {profile.name}'))

        # Create Job Cards
        job_cards_data = [
            {
                'title': 'The Flipper',
                'subtitle': 'Restoration Expert',
                'description': '클래식 카 복원의 대가. 폐차 직전의 차량도 새 것처럼 되살려내는 장인.',
                'req_hand': 50,
                'req_art': 40,
                'color_primary': '#FFD700',
                'color_secondary': '#B8860B',
            },
            {
                'title': 'The EV Tuner',
                'subtitle': 'Electric Vehicle Expert',
                'description': '전기차 시대의 선구자. 고전압 시스템과 배터리 기술의 마스터.',
                'req_tech': 60,
                'req_speed': 40,
                'color_primary': '#00BFFF',
                'color_secondary': '#1E90FF',
            },
            {
                'title': 'The Fleet Commander',
                'subtitle': 'B2B Manager',
                'description': '기업 차량 관리의 달인. 수십 대의 차량을 완벽하게 관리하는 전략가.',
                'req_biz': 60,
                'req_speed': 45,
                'color_primary': '#9932CC',
                'color_secondary': '#8B008B',
            },
            {
                'title': 'The Diagnoser',
                'subtitle': 'Diagnostic Master',
                'description': '자동차의 의사. 어떤 문제도 정확하게 진단해내는 테크니션.',
                'req_tech': 70,
                'color_primary': '#32CD32',
                'color_secondary': '#228B22',
            },
            {
                'title': 'The Detailer',
                'subtitle': 'Esthetic Perfectionist',
                'description': '완벽주의 디테일러. 먼지 하나 허용하지 않는 극도의 미학을 추구.',
                'req_art': 65,
                'req_hand': 45,
                'color_primary': '#FF69B4',
                'color_secondary': '#FF1493',
            },
            {
                'title': 'The Speedster',
                'subtitle': 'Efficiency Legend',
                'description': '시간과의 싸움에서 항상 승리. 빠르고 정확한 정비의 대명사.',
                'req_speed': 70,
                'req_hand': 50,
                'color_primary': '#FF4500',
                'color_secondary': '#FF6347',
            },
        ]

        for card_data in job_cards_data:
            JobCard.objects.get_or_create(
                title=card_data['title'],
                defaults=card_data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(job_cards_data)} job cards'))

        # Create Tasks
        tasks_data = [
            {
                'title': '엔진오일 교환 SOP',
                'description': '엔진오일 교환 표준 작업 절차를 완료하세요.',
                'stat_type': 'Hand',
                'stat_reward': 2,
                'xp_reward': 15,
                'requires_photo': True,
            },
            {
                'title': '타이어 공기압 점검',
                'description': '4개 타이어의 공기압을 점검하고 기록하세요.',
                'stat_type': 'Speed',
                'stat_reward': 1,
                'xp_reward': 10,
                'requires_photo': False,
            },
            {
                'title': 'OBD-II 진단 스캔',
                'description': '차량 진단 스캔을 실시하고 결과를 기록하세요.',
                'stat_type': 'Tech',
                'stat_reward': 3,
                'xp_reward': 20,
                'requires_photo': True,
            },
            {
                'title': '실내 클리닝 서비스',
                'description': '차량 실내 청소 및 탈취 작업을 완료하세요.',
                'stat_type': 'Art',
                'stat_reward': 2,
                'xp_reward': 15,
                'requires_photo': True,
            },
            {
                'title': '고객 상담 완료',
                'description': '고객에게 정비 결과를 설명하고 추가 정비 제안을 하세요.',
                'stat_type': 'Biz',
                'stat_reward': 2,
                'xp_reward': 15,
                'requires_photo': False,
            },
            {
                'title': '브레이크 패드 점검',
                'description': '브레이크 패드 마모 상태를 점검하세요.',
                'stat_type': 'Hand',
                'stat_reward': 1,
                'xp_reward': 10,
                'requires_photo': False,
            },
            {
                'title': '냉각수 레벨 체크',
                'description': '냉각수 레벨을 확인하고 필요시 보충하세요.',
                'stat_type': 'Speed',
                'stat_reward': 1,
                'xp_reward': 8,
                'requires_photo': False,
            },
            {
                'title': '외장 광택 작업',
                'description': '차량 외장 광택 작업을 완료하세요.',
                'stat_type': 'Art',
                'stat_reward': 3,
                'xp_reward': 25,
                'requires_photo': True,
            },
        ]

        for task_data in tasks_data:
            Task.objects.get_or_create(
                title=task_data['title'],
                defaults=task_data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(tasks_data)} tasks'))

        self.stdout.write(self.style.SUCCESS('Mock data setup complete!'))
        self.stdout.write(f'Demo account: demo_mechanic / demo1234')
        self.stdout.write(f'Profile ID: {profile.id}')
