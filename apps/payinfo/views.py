from django.shortcuts import render
from .models import PayInfo

def index(request):
    context = {
        'payinfos': PayInfo.objects.all()
    }
    return render(request,'payinfo/payinfo.html',context=context)