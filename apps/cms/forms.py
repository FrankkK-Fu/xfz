from apps.forms import FormMixin
from django import forms
from apps.news.models import News,Banner
from apps.course.models import Course


class EditNewsCategoryForm(forms.Form):
    pk = forms.IntegerField(error_messages={"required":"必须传入分类的ID！"})
    name = forms.CharField(max_length=100)


# 这里面继承forms.ModelForm是因为在news中模型已经创建好了，如果是继承forms.Form则还要重新去写字段浪费时间，FormMixin是封装了之前写的各种错误提示信息
class WriteNewsForm(forms.ModelForm,FormMixin):
    category = forms.IntegerField()

    class Meta:
        model = News
        exclude = ['category','author','pub_time']


class EditNewsForm(forms.ModelForm,FormMixin):
    category = forms.IntegerField()
    pk = forms.IntegerField()

    class Meta:
        model = News
        exclude = ['category','author','pub_time']


class AddBannerForm(forms.ModelForm,FormMixin):
    class Meta:
        model = Banner
        fields = ('priority','image_url','link_to')


class EditBannerForm(forms.ModelForm,FormMixin):
    pk = forms.IntegerField()
    class Meta:
        model = Banner
        fields = ('priority','link_to','image_url')

class PubCourseForm(forms.ModelForm,FormMixin):
    category_id = forms.IntegerField()
    teacher_id = forms.IntegerField()

    class Meta:
        model = Course
        exclude = ("category",'teacher')
