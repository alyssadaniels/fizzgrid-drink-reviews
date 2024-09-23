from django.http import JsonResponse
from django.core.mail import EmailMessage
from fizzgrid.settings import EMAIL_HOST_USER
from rest_framework.views import APIView
from rest_framework.parsers import FormParser


class RequestDrinkDetail(APIView):
    """
    Request drink detail
    """

    parser_classes = [FormParser]

    def post(self, request):
        """
        Post drink request
        Form data should include product_name: string, brand_name: string, optional image: file, optional email: string
        """
        # get data
        product_name = request.data.get("product_name")
        brand_name = request.data.get("brand_name")
        email = request.data.get("email")
        image = None

        try:
            image = request.FILES.get("image")
        except:
            image = None

        # check data
        if not product_name or len(product_name) == 0:
            return JsonResponse({"message": "Must provide product name"}, status=400)

        if not brand_name or len(brand_name) == 0:
            return JsonResponse({"message": "Must provide brand name"}, status=400)

        # send
        subject = "Add Drink Request"
        body = f"product_name: {product_name}\nbrand_name: {brand_name}\nemail; {email}"
        attachments = [image]
        email = EmailMessage(subject, body, "from", "to", attachments=attachments)

        if email.send(fail_silently=True) == 1:
            return JsonResponse({"message": "Email sent successfully"})
        else:
            return JsonResponse(
                {"message": "Failed to send, please try again later"}, status=500
            )


class ReportIssueDetail(APIView):
    """
    Report a general issue
    """

    parser_classes = [FormParser]

    def post(self, request):
        """
        Post general issue
        Form data should include summary: string, details: string, optional email: string
        """
        # get data
        summary = request.data.get("summary")
        details = request.data.get("details")
        email = request.data.get("email")

        # check data
        if not summary or len(summary) == 0:
            return JsonResponse({"message": "Must provide summary"}, status=400)

        if not details or len(details) == 0:
            return JsonResponse({"message": "Must provide details"}, status=400)

        # send
        subject = "FizzGrid General Issue Report"
        body = f"Summary: {summary}\nDetails: {details}\nEmail: {email}"
        email = EmailMessage(subject, body, EMAIL_HOST_USER, [EMAIL_HOST_USER])

        if email.send(fail_silently=False) == 1:
            return JsonResponse({"message": "Email sent successfully"})
        else:
            return JsonResponse(
                {"message": "Failed to send, please try again later"}, status=500
            )
