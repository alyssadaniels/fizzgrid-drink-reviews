from django.http import HttpResponse, JsonResponse
from django.middleware.csrf import get_token


def get_csrf(request):
    match request.method:
        case 'GET':
            response = JsonResponse({'detail': 'CSRF cookie set'})
            response['X-CSRFToken'] = get_token(request)
            return response
        case _:
            return HttpResponse(status=405)