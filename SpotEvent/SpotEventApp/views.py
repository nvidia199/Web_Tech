from django.http import HttpResponse
from django.template.loader import get_template


def login(request):
	context={}
	return HttpResponse(get_template('login.html').render(context, request))

def profile(request):
	context={}
	return HttpResponse(get_template('profile.html').render(context, request))

def event(request):
	context={}
	return HttpResponse(get_template('event.html').render(context, request))

def review(request):
	context={}
	return HttpResponse(get_template('review.html').render(context, request))

def venue(request):
	context={}
	return HttpResponse(get_template('venue.html').render(context, request))

def address(request):
	context={}
	return HttpResponse(get_template('address.html').render(context, request))

def browse(request):
	context={}
	return HttpResponse(get_template('browse.html').render(context, request))

def spotlight(request):
	context={}
	return HttpResponse(get_template('spotlight.html').render(context, request))

