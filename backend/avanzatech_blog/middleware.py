# from django
from django.utils.deprecation import MiddlewareMixin

class DisableCsrfCheck(MiddlewareMixin):
    """
    This middleware class disables CSRF checks for all requests.
    """
    def process_request(self, req):
        attr = '_dont_enforce_csrf_checks'
        if not getattr(req, attr, False):
            setattr(req, attr, True)