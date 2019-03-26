
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group,Permission,ContentType
from apps.news.models import News,NewsCategory,Banner,Comment
from apps.course.models import Course,CourseCategory,Teacher
from apps.payinfo.models import PayInfo


class Command(BaseCommand):
    def handle(self, *args, **options):  # 自动执行
        # 1.编辑组
        edit_content_types = [
            ContentType.objects.get_for_model(News),
            ContentType.objects.get_for_model(NewsCategory),
            ContentType.objects.get_for_model(Banner),
            ContentType.objects.get_for_model(Comment),
            ContentType.objects.get_for_model(Course),
            ContentType.objects.get_for_model(CourseCategory),
            ContentType.objects.get_for_model(Teacher),
            ContentType.objects.get_for_model(PayInfo),
        ]
        edit_peimissions = Permission.objects.filter(content_type__in=edit_content_types)
        editGroup = Group.objects.create(name='编辑')
        editGroup.permissions.set(edit_peimissions)
        editGroup.save()
        self.stdout.write(self.style.SUCCESS('编辑组创建完成'))
        # 2.财务组
        finance_content_type = [
            # 这里面涉及到付费模块的内容暂时跳过去了
        ]
        finance_permissions = Permission.objects.filter(content_type__in=finance_content_type)
        financeGroup = Group.objects.create(name='财务')
        financeGroup.permissions.set(finance_permissions)
        financeGroup.save()
        self.stdout.write(self.style.SUCCESS('财务组创建完成'))
        # 3.管理员组
        admin_permission = edit_peimissions.union(finance_permissions)
        adminGroup = Group.objects.create(name='管理员')
        adminGroup.permissions.set(admin_permission)
        adminGroup.save()
        self.stdout.write(self.style.SUCCESS('管理员组创建完成'))
        # 4.超级管理员
        self.stdout.write(self.style.SUCCESS(''))